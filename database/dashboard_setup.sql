-- ============================================
-- GATEONE — Setup do Dashboard ADM
-- Aplicar no Supabase SQL Editor (uma vez)
-- ============================================

-- 1. Adiciona coluna `email` em incorporadoras pra vincular o ADM logado
ALTER TABLE incorporadoras
  ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_incorporadoras_email
  ON incorporadoras(email);

-- 2. RLS — Row-Level Security
-- Cada usuário só vê dados da sua própria incorporadora.

ALTER TABLE incorporadoras    ENABLE ROW LEVEL SECURITY;
ALTER TABLE politicas_credito ENABLE ROW LEVEL SECURITY;
ALTER TABLE analises          ENABLE ROW LEVEL SECURITY;

-- 2.1. incorporadoras: usuário só lê o próprio registro (match por email)
DROP POLICY IF EXISTS "incorporadora_own_row" ON incorporadoras;
CREATE POLICY "incorporadora_own_row" ON incorporadoras
  FOR SELECT
  USING (email = auth.email());

-- 2.2. politicas_credito: SELECT/INSERT/UPDATE limitados à própria incorporadora
DROP POLICY IF EXISTS "politicas_select_own" ON politicas_credito;
CREATE POLICY "politicas_select_own" ON politicas_credito
  FOR SELECT
  USING (incorporadora_id IN (SELECT id FROM incorporadoras WHERE email = auth.email()));

DROP POLICY IF EXISTS "politicas_insert_own" ON politicas_credito;
CREATE POLICY "politicas_insert_own" ON politicas_credito
  FOR INSERT
  WITH CHECK (incorporadora_id IN (SELECT id FROM incorporadoras WHERE email = auth.email()));

DROP POLICY IF EXISTS "politicas_update_own" ON politicas_credito;
CREATE POLICY "politicas_update_own" ON politicas_credito
  FOR UPDATE
  USING (incorporadora_id IN (SELECT id FROM incorporadoras WHERE email = auth.email()));

-- 2.3. analises: leitura limitada à incorporadora do usuário
DROP POLICY IF EXISTS "analises_select_own" ON analises;
CREATE POLICY "analises_select_own" ON analises
  FOR SELECT
  USING (incorporadora_id IN (SELECT id FROM incorporadoras WHERE email = auth.email()));

-- ============================================
-- 3. Bootstrap: criar incorporadora exemplo + ADM
-- Substitua os valores antes de rodar.
-- ============================================
--
-- INSERT INTO incorporadoras (nome, token, email, ativa)
-- VALUES ('Minha Incorporadora', 'token-único-aqui', 'adm@minhaincorporadora.com', true);
--
-- Depois crie o usuário em Authentication > Users no painel do Supabase
-- com o MESMO email (ou via signup pelo login.html).
