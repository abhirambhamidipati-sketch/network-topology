/**
 * Enterprise Network Topology Stylesheet — QWERTY Corporation
 *
 * Visual identity:
 *   — Enterprise blue/navy palette (Microsoft Defender / Azure inspired)
 *   — Unified SVG icon language across all 16+ node types
 *   — Layered interaction states: default → hover → selected → faded
 *   — displayLabel shows "Name\nN devices" for collapsed groups
 *   — Expansion uses pure radial layout — no compound containers
 *
 * Node sizing:
 *   Level 0 groups  (top-group):  90px
 *   Level 1 sub-groups:           72px
 *   Level 2 devices (leaf):       52px
 *
 * Interaction classes:
 *   .faded         — de-emphasised (not in selection neighbourhood)
 *   .highlighted   — in selection neighbourhood
 *   .selected-node — the directly selected node
 *   .path-node     — on the highlighted path
 *   .path-edge     — on the highlighted path
 */

const ntpl_encode = (svg) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

// ─── SVG icon library ─────────────────────────────────────────────────────────
// All icons: 24×24 viewBox, 1.6px stroke, rgba(255,255,255,0.95) — unified language.

const W  = 'rgba(255,255,255,0.95)';   // icon stroke colour
const WM = 'rgba(255,255,255,0.70)';   // muted detail colour
const WD = 'rgba(255,255,255,0.45)';   // dim accent

const ICON = {
  // ── Cloud / Internet ────────────────────────────────────────────────────
  cloud: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
  ),
  internet: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a14.5 14.5 0 0 1 4 9 14.5 14.5 0 0 1-4 9 14.5 14.5 0 0 1-4-9 14.5 14.5 0 0 1 4-9z"/><line x1="3.5" y1="9" x2="20.5" y2="9" stroke="${WM}"/><line x1="3.5" y1="15" x2="20.5" y2="15" stroke="${WM}"/></svg>`,
  ),

  // ── Security ───────────────────────────────────────────────────────────
  vpn: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><line x1="12" y1="15" x2="12" y2="17" stroke="${WM}" stroke-width="2"/><circle cx="12" cy="16" r="1" fill="${W}" stroke="none"/></svg>`,
  ),
  firewall: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4.5v5.5c0 5.5-3.5 10.5-8 12-4.5-1.5-8-6.5-8-12V6.5L12 2z"/><polyline points="9,12 11,14 15,10" stroke="${WM}" stroke-width="1.8"/></svg>`,
  ),

  // ── Network infrastructure ─────────────────────────────────────────────
  router: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="20" height="8" rx="2"/><line x1="6"  y1="8" x2="6"  y2="5" stroke="${WM}" stroke-width="1.4"/><line x1="12" y1="8" x2="12" y2="3" stroke="${WM}" stroke-width="1.4"/><line x1="18" y1="8" x2="18" y2="5" stroke="${WM}" stroke-width="1.4"/><circle cx="6"  cy="12" r="1.2" fill="${W}" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="${W}" stroke="none"/><circle cx="18" cy="12" r="1.2" fill="${W}" stroke="none"/><circle cx="6"  cy="5"  r="1"   fill="${WM}" stroke="none"/><circle cx="12" cy="3"  r="1"   fill="${WM}" stroke="none"/><circle cx="18" cy="5"  r="1"   fill="${WM}" stroke="none"/></svg>`,
  ),
  switch: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="20" height="8" rx="1.5"/><line x1="6"  y1="8" x2="6"  y2="5.5" stroke="${WM}" stroke-width="1.3"/><line x1="10" y1="8" x2="10" y2="5.5" stroke="${WM}" stroke-width="1.3"/><line x1="14" y1="8" x2="14" y2="5.5" stroke="${WM}" stroke-width="1.3"/><line x1="18" y1="8" x2="18" y2="5.5" stroke="${WM}" stroke-width="1.3"/><line x1="6"  y1="16" x2="6"  y2="18.5" stroke="${WM}" stroke-width="1.3"/><line x1="10" y1="16" x2="10" y2="18.5" stroke="${WM}" stroke-width="1.3"/><line x1="14" y1="16" x2="14" y2="18.5" stroke="${WM}" stroke-width="1.3"/><circle cx="6"  cy="12" r="1" fill="${W}" stroke="none"/><circle cx="10" cy="12" r="1" fill="${W}" stroke="none"/><circle cx="14" cy="12" r="1" fill="${W}" stroke="none"/><circle cx="18" cy="12" r="1" fill="${W}" stroke="none"/></svg>`,
  ),

  // ── Server types ───────────────────────────────────────────────────────
  server: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2"  width="20" height="5.5" rx="1.5"/><rect x="2" y="9"  width="20" height="5.5" rx="1.5"/><rect x="2" y="16" width="20" height="5.5" rx="1.5"/><circle cx="18.5" cy="4.75" r="1" fill="${W}" stroke="none"/><circle cx="18.5" cy="11.75" r="1" fill="${W}" stroke="none"/><circle cx="18.5" cy="18.75" r="1" fill="${W}" stroke="none"/><line x1="5.5" y1="4.75"  x2="14" y2="4.75"  stroke="${WD}" stroke-width="1.2"/><line x1="5.5" y1="11.75" x2="14" y2="11.75" stroke="${WD}" stroke-width="1.2"/></svg>`,
  ),
  database: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5.5" rx="8" ry="2.5"/><path d="M4 5.5v5c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v-5"/><path d="M4 10.5v5c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v-5"/></svg>`,
  ),
  directory: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="5.5" rx="1.5"/><circle cx="18.5" cy="5.75" r="1.1" fill="${W}" stroke="none"/><line x1="12" y1="8.5"  x2="12" y2="11.5" stroke="${WM}"/><line x1="7"  y1="11.5" x2="17" y2="11.5" stroke="${WM}"/><circle cx="7"  cy="14.5" r="2.2" stroke="${W}"/><circle cx="12" cy="14.5" r="2.2" stroke="${W}"/><circle cx="17" cy="14.5" r="2.2" stroke="${W}"/></svg>`,
  ),
  mail: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><polyline points="2,5 12,13 22,5"/></svg>`,
  ),
  file: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13,2 13,9 20,9"/><line x1="7" y1="13" x2="17" y2="13" stroke="${WM}"/><line x1="7" y1="17" x2="13" y2="17" stroke="${WM}"/></svg>`,
  ),
  monitoring: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,12 18,12 15,20 9,4 6,12 2,12"/></svg>`,
  ),
  backup: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>`,
  ),

  // ── Endpoints ──────────────────────────────────────────────────────────
  laptop: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/><line x1="12" y1="16" x2="12" y2="20" stroke="${WM}"/></svg>`,
  ),
  desktop: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="13" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="16" x2="12" y2="21" stroke="${WM}"/></svg>`,
  ),
  mobile: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2.5"/><line x1="12" y1="18" x2="12" y2="18.1" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  ),
  guest: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5 20v-1a7 7 0 0 1 14 0v1"/></svg>`,
  ),

  // ── Structural / container ─────────────────────────────────────────────
  region: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5" stroke="${WM}"/></svg>`,
  ),
  group: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${W}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><line x1="12" y1="7.5" x2="6.5" y2="15.5"/><line x1="12" y1="7.5" x2="17.5" y2="15.5"/></svg>`,
  ),
};

// ─── Enterprise color palette ────────────────────────────────────────────────

const COLOR = {
  // Background fill per node type family
  cloud:      '#0369A1',   // Sky blue — external connectivity
  vpn:        '#6D28D9',   // Deep violet — VPN / security tunnel
  firewall:   '#B91C1C',   // Deep red — perimeter protection
  router:     '#0C4A6E',   // Deep ocean blue — core routing
  switch:     '#134E4A',   // Deep teal — switching
  server:     '#1E3A8A',   // Deep navy — general servers
  webServer:  '#1D4ED8',   // Blue — web tier
  appServer:  '#5B21B6',   // Purple — app tier
  dbServer:   '#7C2D12',   // Dark burnt orange — data tier
  adServer:   '#1E3A8A',   // Deep navy — identity
  mailServer: '#075985',   // Deep sky — mail
  fileServer: '#78350F',   // Dark amber — storage
  monitoring: '#064E3B',   // Dark green — observability
  backup:     '#1E40AF',   // Indigo — backup
  laptop:     '#115E59',   // Dark teal — laptops
  desktop:    '#1D4ED8',   // Blue — desktops
  mobile:     '#581C87',   // Deep purple — mobile
  guest:      '#92400E',   // Dark amber — guest
  region:     '#1E293B',   // Dark slate — regions
  vpnDevice:  '#7C3AED',   // Violet
  firewallDev:'#DC2626',   // Red

  // Hover: ~20% lighter
  cloudHover:     '#0284C7',
  vpnHover:       '#7C3AED',
  firewallHover:  '#DC2626',
  routerHover:    '#075985',
  switchHover:    '#0F766E',
  serverHover:    '#1D4ED8',
  webServerHover: '#2563EB',
  appServerHover: '#6D28D9',
  dbServerHover:  '#9A3412',
  adServerHover:  '#1D4ED8',
  mailServerHover:'#0369A1',
  fileServerHover:'#92400E',
  monitoringHover:'#065F46',
  backupHover:    '#1E40AF',
  laptopHover:    '#0F766E',
  desktopHover:   '#2563EB',
  mobileHover:    '#6D28D9',
  guestHover:     '#B45309',
  regionHover:    '#334155',

  // Compound container tints — visible on dark canvas
  cloudBg:     'rgba(3,105,161,0.16)',
  vpnBg:       'rgba(109,40,217,0.16)',
  firewallBg:  'rgba(185,28,28,0.16)',
  routerBg:    'rgba(12,74,110,0.16)',
  switchBg:    'rgba(19,78,74,0.16)',
  serverBg:    'rgba(30,58,138,0.16)',
  laptopBg:    'rgba(17,94,89,0.16)',
  desktopBg:   'rgba(29,78,216,0.16)',
  mobileBg:    'rgba(88,28,135,0.16)',
  guestBg:     'rgba(146,64,14,0.16)',
  regionBg:    'rgba(30,41,59,0.16)',
  genericBg:   'rgba(30,58,138,0.16)',

  // Compound container borders — more visible on dark
  cloudBorder:     'rgba(3,105,161,0.55)',
  vpnBorder:       'rgba(109,40,217,0.55)',
  firewallBorder:  'rgba(185,28,28,0.55)',
  routerBorder:    'rgba(12,74,110,0.55)',
  switchBorder:    'rgba(19,78,74,0.55)',
  serverBorder:    'rgba(30,58,138,0.55)',
  laptopBorder:    'rgba(17,94,89,0.55)',
  desktopBorder:   'rgba(29,78,216,0.55)',
  mobileBorder:    'rgba(88,28,135,0.55)',
  guestBorder:     'rgba(146,64,14,0.55)',
  regionBorder:    'rgba(30,41,59,0.55)',
  genericBorder:   'rgba(30,58,138,0.55)',

  // Interaction states
  selectedRing:  '#FFFFFF',
  highlightRing: 'rgba(255,255,255,0.75)',
  pathNodeFill:  '#D97706',
  pathEdge:      '#F59E0B',
  edgeDefault:   '#94A3B8',
  edgeHighlight: '#CBD5E1',

  // Labels — white text for dark canvas
  labelText:    '#F1F5F9',
  labelOutline: 'rgba(15,23,42,0.9)',
};

// ─── Stylesheet ────────────────────────────────────────────────────────────

export const cytoscapeStylesheet = [

  // ── Base node ──────────────────────────────────────────────────────────────
  {
    selector: 'node',
    style: {
      width:  90,
      height: 90,
      shape:  'ellipse',
      'background-color':             '#334155',
      'border-width':                 2.5,
      'border-color':                 'rgba(255,255,255,0.30)',
      'background-image':             ICON.group,
      'background-fit':               'none',
      'background-width':             '54%',
      'background-height':            '54%',
      'background-position-x':        '50%',
      'background-position-y':        '50%',
      'background-image-containment': 'over',
      'background-clip':              'none',
      label:                   'data(label)',
      'font-family':           "'Inter', 'Segoe UI', -apple-system, sans-serif",
      'font-size':             12,
      'font-weight':           500,
      color:                   COLOR.labelText,
      'text-valign':           'bottom',
      'text-halign':           'center',
      'text-margin-y':         9,
      'text-wrap':             'wrap',
      'text-max-width':        110,
      'text-outline-color':    COLOR.labelOutline,
      'text-outline-width':    2,
      'text-outline-opacity':  1,
      'transition-property':   'background-color, border-color, border-width, opacity',
      'transition-duration':   '0.2s',
      'transition-timing-function': 'ease-out',
    },
  },

  // Groups always show displayLabel (label + device count); label is managed via data
  {
    selector: 'node[isGroup]',
    style: { label: 'data(displayLabel)' },
  },

  // ── Level sizing ───────────────────────────────────────────────────────────
  { selector: 'node[level=1]', style: { width: 72, height: 72, 'font-size': 11 } },
  { selector: 'node[level=2]', style: { width: 52, height: 52, 'font-size': 10, 'text-margin-y': 7 } },

  // ── Cloud family ───────────────────────────────────────────────────────────
  { selector: 'node[type="cloud-group"]',    style: { 'background-color': COLOR.cloud,  'background-image': ICON.cloud  } },
  { selector: 'node[type="cloud-provider"]', style: { 'background-color': COLOR.cloud,  'background-image': ICON.internet, width: 72, height: 72 } },

  // ── VPN family ─────────────────────────────────────────────────────────────
  { selector: 'node[type="vpn-group"]',      style: { 'background-color': COLOR.vpn,    'background-image': ICON.vpn    } },
  { selector: 'node[type="vpn-subgroup"]',   style: { 'background-color': COLOR.vpn,    'background-image': ICON.vpn,    width: 72, height: 72 } },
  { selector: 'node[type="vpn-device"]',     style: { 'background-color': COLOR.vpnDevice, 'background-image': ICON.vpn, width: 52, height: 52 } },

  // ── Firewall family ────────────────────────────────────────────────────────
  { selector: 'node[type="firewall-group"]',    style: { 'background-color': COLOR.firewall, 'background-image': ICON.firewall } },
  { selector: 'node[type="firewall-subgroup"]', style: { 'background-color': COLOR.firewall, 'background-image': ICON.firewall, width: 72, height: 72 } },
  { selector: 'node[type="firewall"]',          style: { 'background-color': COLOR.firewallDev, 'background-image': ICON.firewall, width: 52, height: 52 } },

  // ── Router family ──────────────────────────────────────────────────────────
  { selector: 'node[type="router-group"]',    style: { 'background-color': COLOR.router,  'background-image': ICON.router  } },
  { selector: 'node[type="router-subgroup"]', style: { 'background-color': COLOR.router,  'background-image': ICON.router,  width: 72, height: 72 } },
  { selector: 'node[type="router"]',          style: { 'background-color': COLOR.router,  'background-image': ICON.router,  width: 52, height: 52 } },

  // ── Switch family ──────────────────────────────────────────────────────────
  { selector: 'node[type="switch-group"]',    style: { 'background-color': COLOR.switch,  'background-image': ICON.switch  } },
  { selector: 'node[type="switch-subgroup"]', style: { 'background-color': COLOR.switch,  'background-image': ICON.switch,  width: 72, height: 72 } },
  { selector: 'node[type="switch"]',          style: { 'background-color': COLOR.switch,  'background-image': ICON.switch,  width: 52, height: 52 } },

  // ── Server family ──────────────────────────────────────────────────────────
  { selector: 'node[type="server-group"]',       style: { 'background-color': COLOR.server,     'background-image': ICON.server    } },
  { selector: 'node[type="web-server-group"]',   style: { 'background-color': COLOR.webServer,  'background-image': ICON.server,   width: 72, height: 72 } },
  { selector: 'node[type="app-server-group"]',   style: { 'background-color': COLOR.appServer,  'background-image': ICON.server,   width: 72, height: 72 } },
  { selector: 'node[type="db-server-group"]',    style: { 'background-color': COLOR.dbServer,   'background-image': ICON.database, width: 72, height: 72 } },
  { selector: 'node[type="ad-server-group"]',    style: { 'background-color': COLOR.adServer,   'background-image': ICON.directory,width: 72, height: 72 } },
  { selector: 'node[type="mail-server-group"]',  style: { 'background-color': COLOR.mailServer, 'background-image': ICON.mail,     width: 72, height: 72 } },
  { selector: 'node[type="file-server-group"]',  style: { 'background-color': COLOR.fileServer, 'background-image': ICON.file,     width: 72, height: 72 } },
  { selector: 'node[type="monitoring-group"]',   style: { 'background-color': COLOR.monitoring, 'background-image': ICON.monitoring,width: 72, height: 72 } },
  { selector: 'node[type="backup-group"]',       style: { 'background-color': COLOR.backup,     'background-image': ICON.backup,   width: 72, height: 72 } },

  // Device-level server nodes
  { selector: 'node[type="web-server"]',        style: { 'background-color': COLOR.webServer,  'background-image': ICON.server,    width: 52, height: 52 } },
  { selector: 'node[type="app-server"]',        style: { 'background-color': COLOR.appServer,  'background-image': ICON.server,    width: 52, height: 52 } },
  { selector: 'node[type="db-server"]',         style: { 'background-color': COLOR.dbServer,   'background-image': ICON.database,  width: 52, height: 52 } },
  { selector: 'node[type="ad-server"]',         style: { 'background-color': COLOR.adServer,   'background-image': ICON.directory, width: 52, height: 52 } },
  { selector: 'node[type="mail-server"]',       style: { 'background-color': COLOR.mailServer, 'background-image': ICON.mail,      width: 52, height: 52 } },
  { selector: 'node[type="file-server"]',       style: { 'background-color': COLOR.fileServer, 'background-image': ICON.file,      width: 52, height: 52 } },
  { selector: 'node[type="monitoring-server"]', style: { 'background-color': COLOR.monitoring, 'background-image': ICON.monitoring,width: 52, height: 52 } },
  { selector: 'node[type="backup-server"]',     style: { 'background-color': COLOR.backup,     'background-image': ICON.backup,    width: 52, height: 52 } },

  // ── Endpoint families ──────────────────────────────────────────────────────
  { selector: 'node[type="laptop-group"]',  style: { 'background-color': COLOR.laptop,  'background-image': ICON.laptop  } },
  { selector: 'node[type="laptop"]',        style: { 'background-color': COLOR.laptop,  'background-image': ICON.laptop,  width: 52, height: 52 } },
  { selector: 'node[type="desktop-group"]', style: { 'background-color': COLOR.desktop, 'background-image': ICON.desktop } },
  { selector: 'node[type="desktop"]',       style: { 'background-color': COLOR.desktop, 'background-image': ICON.desktop, width: 52, height: 52 } },
  { selector: 'node[type="mobile-group"]',  style: { 'background-color': COLOR.mobile,  'background-image': ICON.mobile  } },
  { selector: 'node[type="mobile"]',        style: { 'background-color': COLOR.mobile,  'background-image': ICON.mobile,  width: 52, height: 52 } },
  { selector: 'node[type="guest-group"]',   style: { 'background-color': COLOR.guest,   'background-image': ICON.guest   } },
  { selector: 'node[type="guest-device"]',  style: { 'background-color': COLOR.guest,   'background-image': ICON.guest,   width: 52, height: 52 } },

  // Region groups
  { selector: 'node[type="region-group"]', style: { 'background-color': COLOR.region, 'background-image': ICON.region, width: 72, height: 72 } },

  // ── Hover states ───────────────────────────────────────────────────────────
  { selector: 'node[type="cloud-group"]:hover',      style: { 'background-color': COLOR.cloudHover      } },
  { selector: 'node[type="cloud-provider"]:hover',   style: { 'background-color': COLOR.cloudHover      } },
  { selector: 'node[type="vpn-group"]:hover',        style: { 'background-color': COLOR.vpnHover        } },
  { selector: 'node[type="vpn-subgroup"]:hover',     style: { 'background-color': COLOR.vpnHover        } },
  { selector: 'node[type="vpn-device"]:hover',       style: { 'background-color': COLOR.vpnHover        } },
  { selector: 'node[type="firewall-group"]:hover',   style: { 'background-color': COLOR.firewallHover   } },
  { selector: 'node[type="firewall-subgroup"]:hover',style: { 'background-color': COLOR.firewallHover   } },
  { selector: 'node[type="firewall"]:hover',         style: { 'background-color': COLOR.firewallHover   } },
  { selector: 'node[type="router-group"]:hover',     style: { 'background-color': COLOR.routerHover     } },
  { selector: 'node[type="router-subgroup"]:hover',  style: { 'background-color': COLOR.routerHover     } },
  { selector: 'node[type="router"]:hover',           style: { 'background-color': COLOR.routerHover     } },
  { selector: 'node[type="switch-group"]:hover',     style: { 'background-color': COLOR.switchHover     } },
  { selector: 'node[type="switch-subgroup"]:hover',  style: { 'background-color': COLOR.switchHover     } },
  { selector: 'node[type="switch"]:hover',           style: { 'background-color': COLOR.switchHover     } },
  { selector: 'node[type="server-group"]:hover',     style: { 'background-color': COLOR.serverHover     } },
  { selector: 'node[type="web-server-group"]:hover', style: { 'background-color': COLOR.webServerHover  } },
  { selector: 'node[type="app-server-group"]:hover', style: { 'background-color': COLOR.appServerHover  } },
  { selector: 'node[type="db-server-group"]:hover',  style: { 'background-color': COLOR.dbServerHover   } },
  { selector: 'node[type="ad-server-group"]:hover',  style: { 'background-color': COLOR.adServerHover   } },
  { selector: 'node[type="mail-server-group"]:hover',style: { 'background-color': COLOR.mailServerHover } },
  { selector: 'node[type="file-server-group"]:hover',style: { 'background-color': COLOR.fileServerHover } },
  { selector: 'node[type="monitoring-group"]:hover', style: { 'background-color': COLOR.monitoringHover } },
  { selector: 'node[type="backup-group"]:hover',     style: { 'background-color': COLOR.backupHover     } },
  { selector: 'node[type="web-server"]:hover',       style: { 'background-color': COLOR.webServerHover  } },
  { selector: 'node[type="app-server"]:hover',       style: { 'background-color': COLOR.appServerHover  } },
  { selector: 'node[type="db-server"]:hover',        style: { 'background-color': COLOR.dbServerHover   } },
  { selector: 'node[type="ad-server"]:hover',        style: { 'background-color': COLOR.adServerHover   } },
  { selector: 'node[type="mail-server"]:hover',      style: { 'background-color': COLOR.mailServerHover } },
  { selector: 'node[type="file-server"]:hover',      style: { 'background-color': COLOR.fileServerHover } },
  { selector: 'node[type="monitoring-server"]:hover',style: { 'background-color': COLOR.monitoringHover } },
  { selector: 'node[type="backup-server"]:hover',    style: { 'background-color': COLOR.backupHover     } },
  { selector: 'node[type="laptop-group"]:hover',     style: { 'background-color': COLOR.laptopHover     } },
  { selector: 'node[type="laptop"]:hover',           style: { 'background-color': COLOR.laptopHover     } },
  { selector: 'node[type="desktop-group"]:hover',    style: { 'background-color': COLOR.desktopHover    } },
  { selector: 'node[type="desktop"]:hover',          style: { 'background-color': COLOR.desktopHover    } },
  { selector: 'node[type="mobile-group"]:hover',     style: { 'background-color': COLOR.mobileHover     } },
  { selector: 'node[type="mobile"]:hover',           style: { 'background-color': COLOR.mobileHover     } },
  { selector: 'node[type="guest-group"]:hover',      style: { 'background-color': COLOR.guestHover      } },
  { selector: 'node[type="guest-device"]:hover',     style: { 'background-color': COLOR.guestHover      } },
  { selector: 'node[type="region-group"]:hover',     style: { 'background-color': COLOR.regionHover     } },

  {
    selector: 'node:hover',
    style: {
      'border-color': 'rgba(255,255,255,0.85)',
      'border-width':  3.5,
      cursor: 'pointer',
      'z-index': 10,
    },
  },

  // ── Interaction state classes ──────────────────────────────────────────────

  // context-fade: backbone / unrelated nodes during expansion drill-down.
  // Drops nodes to 25% and hides edges so the focused level is visually dominant.
  {
    selector: 'node.context-fade',
    style: { opacity: 0.22 },
  },
  {
    selector: 'edge.context-fade',
    style: { opacity: 0.04 },
  },

  // ancestor-dim: nodes in the exploration path above the current focus level.
  // Visible enough to preserve spatial context; de-emphasised relative to focus.
  {
    selector: 'node.ancestor-dim',
    style: { opacity: 0.50 },
  },
  {
    selector: 'edge.ancestor-dim',
    style: { opacity: 0.20 },
  },

  // hover-dim: gentle de-emphasis while hovering — preserves network context
  {
    selector: 'node.hover-dim',
    style: { opacity: 0.70 },
  },
  {
    selector: 'edge.hover-dim',
    style: { opacity: 0.14 },
  },

  // faded: strong de-emphasis for selection neighbourhood focus
  {
    selector: 'node.faded',
    style: { opacity: 0.12 },
  },
  {
    selector: 'node.highlighted',
    style: {
      opacity:        1,
      'border-color': COLOR.highlightRing,
      'border-width': 3,
    },
  },
  {
    selector: 'node.selected-node',
    style: {
      opacity:        1,
      'border-color': COLOR.selectedRing,
      'border-width': 4,
      'z-index':      999,
    },
  },

  // ── Path highlighting ──────────────────────────────────────────────────────
  {
    selector: 'node.path-node',
    style: {
      opacity:            1,
      'background-color': COLOR.pathNodeFill,
      'border-color':     '#FFFFFF',
      'border-width':     3.5,
      'z-index':          998,
    },
  },
  {
    selector: 'edge.path-edge',
    style: {
      'line-color': COLOR.pathEdge,
      width:        4,
      opacity:      1,
      'z-index':    997,
    },
  },

  // ── Base edge ──────────────────────────────────────────────────────────────
  {
    selector: 'edge',
    style: {
      width:                        2.5,
      'line-color':                 COLOR.edgeDefault,
      'curve-style':                'bezier',
      'line-opacity':               0.80,
      'target-arrow-shape':         'triangle',
      'target-arrow-color':         COLOR.edgeDefault,
      'arrow-scale':                1.1,
      'transition-property':        'line-color, width, opacity',
      'transition-duration':        '0.2s',
      'transition-timing-function': 'ease-out',
    },
  },

  // Backbone edges — bright, thick, clearly directional
  {
    selector: 'edge[edgeType="backbone"]',
    style: {
      width:                4,
      'line-color':         '#94A3B8',
      'line-opacity':       1.0,
      'target-arrow-color': '#94A3B8',
      'arrow-scale':        1.4,
    },
  },

  // Internal edges within an expanded group — muted dashed
  {
    selector: 'edge[edgeType="internal"]',
    style: {
      width:                2,
      'line-style':         'dashed',
      'line-dash-pattern':  [6, 3],
      'line-color':         'rgba(148,163,184,0.65)',
      'line-opacity':       1,
      'target-arrow-shape': 'vee',
      'target-arrow-color': 'rgba(148,163,184,0.65)',
      'arrow-scale':        0.9,
    },
  },

  // Device edges — thin dotted, no arrow (high density)
  {
    selector: 'edge[edgeType="device"]',
    style: {
      width:                1.4,
      'line-color':         'rgba(148,163,184,0.45)',
      'line-style':         'dotted',
      'line-opacity':       1,
      'target-arrow-shape': 'none',
    },
  },

  // ── Edge interaction states ────────────────────────────────────────────────
  { selector: 'edge.faded',       style: { opacity: 0.04 } },
  {
    selector: 'edge.highlighted',
    style: {
      'line-color':         COLOR.edgeHighlight,
      'target-arrow-color': COLOR.edgeHighlight,
      width:                3.5,
      opacity:              1,
    },
  },
  {
    selector: 'edge:hover',
    style: {
      'line-color':         COLOR.edgeHighlight,
      'target-arrow-color': COLOR.edgeHighlight,
      width:                3.5,
      opacity:              1,
    },
  },

  // ── Health status rings ────────────────────────────────────────────────────
  // Triggered by data(status) flattened from meta.status at load time.
  {
    selector: 'node[status="warning"]:childless',
    style: { 'border-color': '#F59E0B', 'border-width': 4 },
  },
  {
    selector: 'node[status="critical"]:childless',
    style: { 'border-color': '#EF4444', 'border-width': 4 },
  },
  {
    selector: 'node[status="unknown"]:childless',
    style: { 'border-color': 'rgba(148,163,184,0.6)', 'border-width': 3 },
  },
];
