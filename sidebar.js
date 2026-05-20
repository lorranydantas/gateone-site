// ========================================
// GATEONE — Sidebar compartilhado
// Uso: <aside class="sidebar" id="sidebar"></aside>
//       <script src="sidebar.js"></script>
//       <script>window.renderSidebar('dashboard');</script>
// ========================================

(function () {
  const ITEMS = [
    { key: 'dashboard',    href: 'dashboard.html',     label: 'Dashboard',           icon: 'home' },
    { key: 'analises',     href: 'analises.html',      label: 'Análises',            icon: 'list' },
    { key: 'nova-analise', href: 'nova-analise.html',  label: 'Nova Análise',        icon: 'plus' },
    { key: 'politica',     href: 'politica.html',      label: 'Política de Crédito', icon: 'shield' },
  ];

  const FUTUROS = [
    { label: 'Corretores',    icon: 'users' },
    { label: 'Relatórios',    icon: 'chart' },
    { label: 'Notificações',  icon: 'bell' },
  ];

  const ICONS = {
    home:   '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z"/></svg>',
    list:   '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>',
    plus:   '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>',
    shield: '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    users:  '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    chart:  '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    bell:   '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
  };

  window.renderSidebar = function (activePage) {
    const aside = document.getElementById('sidebar');
    if (!aside) return;

    const navHtml = ITEMS.map((it) => `
      <a href="${it.href}" class="${it.key === activePage ? 'active' : ''}">
        ${ICONS[it.icon]}<span>${it.label}</span>
      </a>
    `).join('');

    const futurosHtml = FUTUROS.map((it) => `
      <span class="item disabled">
        ${ICONS[it.icon]}<span>${it.label}</span>
        <span class="em-breve">Em breve</span>
      </span>
    `).join('');

    aside.innerHTML = `
      <a class="logo" href="dashboard.html"><span class="gate">GATE</span><span class="one">ONE</span></a>
      <nav class="side-nav">
        ${navHtml}
        <span class="label">Em breve</span>
        ${futurosHtml}
      </nav>
      <div class="side-foot">
        <div class="user-email" id="sideUserEmail">…</div>
        <button class="btn btn-outline btn-block btn-sm" onclick="window.sair()">Sair</button>
      </div>
    `;
  };

  window.preencherUsuarioSidebar = function (user) {
    const el = document.getElementById('sideUserEmail');
    if (el && user?.email) el.textContent = user.email;
  };
})();
