-- ============================================
-- GATEONE — Onboarding wizard setup
-- Aplicar no Supabase SQL Editor (uma vez)
-- ============================================

-- 1. Incorporadoras: campos extras pro wizard
ALTER TABLE incorporadoras
  ADD COLUMN IF NOT EXISTS cnpj TEXT,
  ADD COLUMN IF NOT EXISTS telefone TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completo BOOLEAN DEFAULT false;

-- 2. Empreendimentos
CREATE TABLE IF NOT EXISTS empreendimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incorporadora_id UUID REFERENCES incorporadoras(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  status TEXT NOT NULL,
  endereco TEXT,
  ticket_medio NUMERIC,
  vgv_total NUMERIC,
  vgf NUMERIC,
  previsao_entrega DATE,
  total_unidades INTEGER,
  total_blocos INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_empreendimentos_incorporadora
  ON empreendimentos(incorporadora_id);

-- 3. Política de crédito: vincula a empreendimento + prazo máximo
ALTER TABLE politicas_credito
  ADD COLUMN IF NOT EXISTS empreendimento_id UUID REFERENCES empreendimentos(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS prazo_maximo_meses INTEGER DEFAULT 360;

-- 4. RLS — políticas extras pro wizard

-- 4.1 incorporadoras: UPDATE do próprio registro (já tem SELECT do dashboard_setup.sql)
DROP POLICY IF EXISTS "incorporadora_update_own" ON incorporadoras;
CREATE POLICY "incorporadora_update_own" ON incorporadoras
  FOR UPDATE
  USING (email = auth.email())
  WITH CHECK (email = auth.email());

-- 4.2 empreendimentos: RLS limitado ao próprio
ALTER TABLE empreendimentos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "empreendimentos_select_own" ON empreendimentos;
CREATE POLICY "empreendimentos_select_own" ON empreendimentos
  FOR SELECT
  USING (incorporadora_id IN (SELECT id FROM incorporadoras WHERE email = auth.email()));

DROP POLICY IF EXISTS "empreendimentos_insert_own" ON empreendimentos;
CREATE POLICY "empreendimentos_insert_own" ON empreendimentos
  FOR INSERT
  WITH CHECK (incorporadora_id IN (SELECT id FROM incorporadoras WHERE email = auth.email()));

DROP POLICY IF EXISTS "empreendimentos_update_own" ON empreendimentos;
CREATE POLICY "empreendimentos_update_own" ON empreendimentos
  FOR UPDATE
  USING (incorporadora_id IN (SELECT id FROM incorporadoras WHERE email = auth.email()));

-- 4.3 corretores: RLS limitado ao próprio
ALTER TABLE corretores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "corretores_select_own" ON corretores;
CREATE POLICY "corretores_select_own" ON corretores
  FOR SELECT
  USING (incorporadora_id IN (SELECT id FROM incorporadoras WHERE email = auth.email()));

DROP POLICY IF EXISTS "corretores_insert_own" ON corretores;
CREATE POLICY "corretores_insert_own" ON corretores
  FOR INSERT
  WITH CHECK (incorporadora_id IN (SELECT id FROM incorporadoras WHERE email = auth.email()));
