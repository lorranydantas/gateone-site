// ========================================
// GATEONE — Cliente Supabase + helpers
// ========================================

const SUPABASE_URL = 'https://azkitnuxlawufkqbsmej.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wMjYVFX5dreHh1b5M-hx8w_o9TLGhCN';

const { createClient } = window.supabase;
window.gateoneSupabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Helpers de sessão ---
window.exigirLogin = async function () {
  const { data, error } = await window.gateoneSupabase.auth.getSession();
  if (error || !data.session) {
    window.location.replace('login.html');
    return null;
  }
  return data.session.user;
};

window.sair = async function () {
  await window.gateoneSupabase.auth.signOut();
  window.location.replace('login.html');
};

// --- Buscar incorporadora vinculada ao usuário logado ---
// (a tabela `incorporadoras` precisa ter a coluna `email` populada com o email do ADM)
window.buscarIncorporadoraDoUsuario = async function (user) {
  if (!user?.email) return null;
  const { data, error } = await window.gateoneSupabase
    .from('incorporadoras')
    .select('id, nome, email, ativa')
    .eq('email', user.email)
    .eq('ativa', true)
    .maybeSingle();
  if (error) {
    console.error('Erro buscando incorporadora:', error.message);
    return null;
  }
  return data;
};

// --- Atalhos visuais ---
window.formatBR = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n ?? 0);
window.formatDataBR = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};
window.mascararCPF = (cpf) => {
  if (!cpf) return '—';
  const digits = String(cpf).replace(/\D/g, '');
  if (digits.length !== 11) return cpf;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};
