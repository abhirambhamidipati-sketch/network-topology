/**
 * Production Cytoscape.js stylesheet.
 *
 * Node sizing by level:
 *   Level 0 groups (top-group): 82px
 *   Level 1 sub-groups:         66px
 *   Level 2 devices (leaf):     52px
 *
 * Node colours by type family:
 *   Cloud:   #4299e1 (blue)
 *   Router:  #9f7aea (purple)
 *   Switch:  #38b2ac (teal)
 *   Server:  #e53e3e (red)
 *   Laptop:  #38a169 (green)
 *   Desktop: #dd6b20 (orange)
 *
 * Interaction classes:
 *   .faded         — de-emphasised (not in selection neighbourhood)
 *   .highlighted   — emphasised (in selection neighbourhood)
 *   .selected-node — the directly selected node
 *   .path-node     — on the highlighted path
 *   .path-edge     — on the highlighted path
 *
 * Compound node containers:
 *   node:parent — renders as translucent rounded rectangle
 */

const ntpl_encode = (svg) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

// ─── SVG icon library ──────────────────────────────────────────────────────

const ICON = {
  cloud: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.93)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/></svg>`,
  ),
  router: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.93)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="9" width="20" height="9" rx="2"/><line x1="8" y1="9" x2="8" y2="6.5" stroke="rgba(255,255,255,0.65)" stroke-width="1.5"/><line x1="12" y1="9" x2="12" y2="4.5" stroke="rgba(255,255,255,0.65)" stroke-width="1.5"/><line x1="16" y1="9" x2="16" y2="6.5" stroke="rgba(255,255,255,0.65)" stroke-width="1.5"/><circle cx="8" cy="13.5" r="1.2" fill="rgba(255,255,255,0.93)" stroke="none"/><circle cx="12" cy="13.5" r="1.2" fill="rgba(255,255,255,0.93)" stroke="none"/><circle cx="16" cy="13.5" r="1.2" fill="rgba(255,255,255,0.93)" stroke="none"/></svg>`,
  ),
  switch: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.93)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8.5" width="20" height="7" rx="1.5"/><line x1="6.5" y1="8.5" x2="6.5" y2="6" stroke="rgba(255,255,255,0.6)" stroke-width="1.4"/><line x1="10.5" y1="8.5" x2="10.5" y2="6" stroke="rgba(255,255,255,0.6)" stroke-width="1.4"/><line x1="14.5" y1="8.5" x2="14.5" y2="6" stroke="rgba(255,255,255,0.6)" stroke-width="1.4"/><line x1="18" y1="8.5" x2="18" y2="6" stroke="rgba(255,255,255,0.6)" stroke-width="1.4"/><line x1="6.5" y1="15.5" x2="6.5" y2="18" stroke="rgba(255,255,255,0.6)" stroke-width="1.4"/><line x1="10.5" y1="15.5" x2="10.5" y2="18" stroke="rgba(255,255,255,0.6)" stroke-width="1.4"/><line x1="14.5" y1="15.5" x2="14.5" y2="18" stroke="rgba(255,255,255,0.6)" stroke-width="1.4"/><circle cx="6.5" cy="12" r="1" fill="rgba(255,255,255,0.93)" stroke="none"/><circle cx="10.5" cy="12" r="1" fill="rgba(255,255,255,0.93)" stroke="none"/><circle cx="14.5" cy="12" r="1" fill="rgba(255,255,255,0.93)" stroke="none"/><circle cx="18" cy="12" r="1" fill="rgba(255,255,255,0.93)" stroke="none"/></svg>`,
  ),
  server: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.93)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3.5" width="20" height="5" rx="1.5"/><rect x="2" y="10.5" width="20" height="5" rx="1.5"/><circle cx="18.5" cy="6" r="1" fill="rgba(255,255,255,0.93)" stroke="none"/><circle cx="18.5" cy="13" r="1" fill="rgba(255,255,255,0.93)" stroke="none"/><line x1="5.5" y1="6" x2="12" y2="6" stroke="rgba(255,255,255,0.6)" stroke-width="1.3"/><line x1="5.5" y1="13" x2="12" y2="13" stroke="rgba(255,255,255,0.6)" stroke-width="1.3"/><line x1="12" y1="15.5" x2="12" y2="19" stroke="rgba(255,255,255,0.65)" stroke-width="1.5"/><line x1="8.5" y1="19" x2="15.5" y2="19"/></svg>`,
  ),
  laptop: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.93)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="10.5" rx="1.5"/><path d="M2 19.5h20l-1.5-4H3.5L2 19.5z"/></svg>`,
  ),
  desktop: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.93)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="13.5" rx="1.5"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="16.5" x2="12" y2="21"/></svg>`,
  ),
  group: ntpl_encode(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.93)" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="17" r="2.5"/><circle cx="19" cy="17" r="2.5"/><line x1="12" y1="7.5" x2="6.5" y2="14.5"/><line x1="12" y1="7.5" x2="17.5" y2="14.5"/></svg>`,
  ),
};

// ─── Type-specific colour palette ─────────────────────────────────────────

const COLOR = {
  // Per-type node fill colours
  cloud:   '#4299e1',
  router:  '#9f7aea',
  switch:  '#38b2ac',
  server:  '#e53e3e',
  laptop:  '#38a169',
  desktop: '#dd6b20',

  // Per-type hover colours (slightly darker)
  cloudHover:   '#3182ce',
  routerHover:  '#805ad5',
  switchHover:  '#2c7a7b',
  serverHover:  '#c53030',
  laptopHover:  '#276749',
  desktopHover: '#c05621',

  // Per-type compound container backgrounds
  cloudBg:   'rgba(66,153,225,0.05)',
  routerBg:  'rgba(159,122,234,0.05)',
  switchBg:  'rgba(56,178,172,0.05)',
  serverBg:  'rgba(229,62,62,0.05)',
  laptopBg:  'rgba(56,161,105,0.05)',
  desktopBg: 'rgba(221,107,32,0.05)',

  // Per-type compound border colours
  cloudBorder:   'rgba(66,153,225,0.28)',
  routerBorder:  'rgba(159,122,234,0.28)',
  switchBorder:  'rgba(56,178,172,0.28)',
  serverBorder:  'rgba(229,62,62,0.28)',
  laptopBorder:  'rgba(56,161,105,0.28)',
  desktopBorder: 'rgba(221,107,32,0.28)',

  // Interaction states
  nodeSelected:   '#1a365d',
  nodeHighlight:  '#2b6cb0',
  edgeDefault:    '#a0aec0',
  edgeHighlight:  '#4a5568',
  pathNodeFill:   '#e6b800',
  pathEdge:       '#e6b800',

  labelText:    '#1a2535',
  labelOutline: 'rgba(255,255,255,0.88)',
  selectedRing: '#ffffff',
};

// ─── Exported stylesheet ───────────────────────────────────────────────────

export const cytoscapeStylesheet = [

  // ── Base node (all nodes inherit from this) ─────────────────────────────
  {
    selector: 'node',
    style: {
      width:  82,
      height: 82,
      shape:  'ellipse',
      'background-color':            '#5b8db8',
      'border-width':                2,
      'border-color':                'rgba(255,255,255,0.45)',
      'background-image':            ICON.group,
      'background-fit':              'none',
      'background-width':            '52%',
      'background-height':           '52%',
      'background-position-x':       '50%',
      'background-position-y':       '50%',
      'background-image-containment': 'over',
      'background-clip':             'none',
      label:                  'data(label)',
      'font-family':          "'Inter', -apple-system, sans-serif",
      'font-size':            12,
      'font-weight':          500,
      color:                  COLOR.labelText,
      'text-valign':          'bottom',
      'text-halign':          'center',
      'text-margin-y':        6,
      'text-wrap':            'wrap',
      'text-max-width':       96,
      'text-outline-color':   COLOR.labelOutline,
      'text-outline-width':   3,
      'text-outline-opacity': 1,
      'transition-property':        'background-color, border-color, border-width, opacity',
      'transition-duration':        '0.18s',
      'transition-timing-function': 'ease',
    },
  },

  // ── Cloud family ──────────────────────────────────────────────────────────
  { selector: 'node[type="cloud-group"]',    style: { 'background-color': COLOR.cloud,  'background-image': ICON.cloud  } },
  { selector: 'node[type="cloud-provider"]', style: { 'background-color': COLOR.cloud,  'background-image': ICON.cloud,  width: 66, height: 66 } },

  // ── Router family ─────────────────────────────────────────────────────────
  { selector: 'node[type="router-group"]',   style: { 'background-color': COLOR.router, 'background-image': ICON.router } },
  { selector: 'node[type="router-subgroup"]',style: { 'background-color': COLOR.router, 'background-image': ICON.router, width: 66, height: 66 } },
  { selector: 'node[type="router"]',         style: { 'background-color': COLOR.router, 'background-image': ICON.router, width: 52, height: 52 } },

  // ── Switch family ─────────────────────────────────────────────────────────
  { selector: 'node[type="switch-group"]',   style: { 'background-color': COLOR.switch, 'background-image': ICON.switch } },
  { selector: 'node[type="switch-subgroup"]',style: { 'background-color': COLOR.switch, 'background-image': ICON.switch, width: 66, height: 66 } },
  { selector: 'node[type="switch"]',         style: { 'background-color': COLOR.switch, 'background-image': ICON.switch, width: 52, height: 52 } },

  // ── Server family ─────────────────────────────────────────────────────────
  { selector: 'node[type="server-group"]',   style: { 'background-color': COLOR.server, 'background-image': ICON.server } },
  { selector: 'node[type="server-subgroup"]',style: { 'background-color': COLOR.server, 'background-image': ICON.server, width: 66, height: 66 } },
  { selector: 'node[type="server"]',         style: { 'background-color': COLOR.server, 'background-image': ICON.server, width: 52, height: 52 } },

  // ── Laptop family ─────────────────────────────────────────────────────────
  { selector: 'node[type="laptop-group"]',   style: { 'background-color': COLOR.laptop, 'background-image': ICON.laptop } },
  { selector: 'node[type="laptop"]',         style: { 'background-color': COLOR.laptop, 'background-image': ICON.laptop, width: 52, height: 52 } },

  // ── Desktop family ────────────────────────────────────────────────────────
  { selector: 'node[type="desktop-group"]',  style: { 'background-color': COLOR.desktop, 'background-image': ICON.desktop } },
  { selector: 'node[type="desktop"]',        style: { 'background-color': COLOR.desktop, 'background-image': ICON.desktop, width: 52, height: 52 } },

  // ── Region group (laptops/desktops regional containers) ───────────────────
  { selector: 'node[type="region-group"]',   style: { 'background-color': '#718096', 'background-image': ICON.group, width: 66, height: 66 } },

  // ── Hover states ──────────────────────────────────────────────────────────
  { selector: 'node[type="cloud-group"]:hover',    style: { 'background-color': COLOR.cloudHover   } },
  { selector: 'node[type="cloud-provider"]:hover', style: { 'background-color': COLOR.cloudHover   } },
  { selector: 'node[type="router-group"]:hover',   style: { 'background-color': COLOR.routerHover  } },
  { selector: 'node[type="router-subgroup"]:hover',style: { 'background-color': COLOR.routerHover  } },
  { selector: 'node[type="router"]:hover',         style: { 'background-color': COLOR.routerHover  } },
  { selector: 'node[type="switch-group"]:hover',   style: { 'background-color': COLOR.switchHover  } },
  { selector: 'node[type="switch-subgroup"]:hover',style: { 'background-color': COLOR.switchHover  } },
  { selector: 'node[type="switch"]:hover',         style: { 'background-color': COLOR.switchHover  } },
  { selector: 'node[type="server-group"]:hover',   style: { 'background-color': COLOR.serverHover  } },
  { selector: 'node[type="server-subgroup"]:hover',style: { 'background-color': COLOR.serverHover  } },
  { selector: 'node[type="server"]:hover',         style: { 'background-color': COLOR.serverHover  } },
  { selector: 'node[type="laptop-group"]:hover',   style: { 'background-color': COLOR.laptopHover  } },
  { selector: 'node[type="laptop"]:hover',         style: { 'background-color': COLOR.laptopHover  } },
  { selector: 'node[type="desktop-group"]:hover',  style: { 'background-color': COLOR.desktopHover } },
  { selector: 'node[type="desktop"]:hover',        style: { 'background-color': COLOR.desktopHover } },

  {
    selector: 'node:hover',
    style: {
      'border-color': 'rgba(255,255,255,0.75)',
      'border-width':  2.5,
      cursor: 'pointer',
    },
  },

  // ── Compound parent containers (expanded group visual backdrop) ───────────
  {
    selector: 'node:parent',
    style: {
      shape:                 'roundrectangle',
      'background-color':    'rgba(240,245,255,0.55)',
      'background-opacity':  1,
      'border-width':        1.5,
      'border-color':        'rgba(160,174,192,0.4)',
      'border-style':        'dashed',
      'background-image':    'none',
      'text-valign':         'top',
      'text-halign':         'center',
      'text-margin-y':       -8,
      'font-size':           11,
      'font-weight':         600,
      color:                 '#4a5568',
      'text-outline-color':  'rgba(240,245,255,0.9)',
      'text-outline-width':  2,
      padding:               '28px',
      'min-width':           90,
      'min-height':          70,
      'z-compound-depth':    'bottom',
    },
  },

  // Per-type compound container colour overrides
  { selector: 'node:parent[type="cloud-group"]',    style: { 'background-color': COLOR.cloudBg,   'border-color': COLOR.cloudBorder  } },
  { selector: 'node:parent[type="cloud-provider"]', style: { 'background-color': COLOR.cloudBg,   'border-color': COLOR.cloudBorder  } },
  { selector: 'node:parent[type="router-group"]',   style: { 'background-color': COLOR.routerBg,  'border-color': COLOR.routerBorder } },
  { selector: 'node:parent[type="router-subgroup"]',style: { 'background-color': COLOR.routerBg,  'border-color': COLOR.routerBorder } },
  { selector: 'node:parent[type="switch-group"]',   style: { 'background-color': COLOR.switchBg,  'border-color': COLOR.switchBorder } },
  { selector: 'node:parent[type="switch-subgroup"]',style: { 'background-color': COLOR.switchBg,  'border-color': COLOR.switchBorder } },
  { selector: 'node:parent[type="server-group"]',   style: { 'background-color': COLOR.serverBg,  'border-color': COLOR.serverBorder } },
  { selector: 'node:parent[type="server-subgroup"]',style: { 'background-color': COLOR.serverBg,  'border-color': COLOR.serverBorder } },
  { selector: 'node:parent[type="laptop-group"]',   style: { 'background-color': COLOR.laptopBg,  'border-color': COLOR.laptopBorder } },
  { selector: 'node:parent[type="desktop-group"]',  style: { 'background-color': COLOR.desktopBg, 'border-color': COLOR.desktopBorder} },
  { selector: 'node:parent[type="region-group"]',   style: { 'background-color': 'rgba(113,128,150,0.05)', 'border-color': 'rgba(113,128,150,0.28)' } },

  // ── Interaction states ────────────────────────────────────────────────────
  {
    selector: 'node.faded',
    style: { opacity: 0.18 },
  },
  {
    selector: 'node.highlighted',
    style: {
      opacity:         1,
      'border-color':  'rgba(255,255,255,0.85)',
      'border-width':  2.5,
    },
  },
  {
    selector: 'node.selected-node',
    style: {
      opacity:         1,
      'border-color':  COLOR.selectedRing,
      'border-width':  3.5,
      'z-index':       999,
    },
  },

  // ── Path highlighting ─────────────────────────────────────────────────────
  {
    selector: 'node.path-node',
    style: {
      opacity:           1,
      'background-color': COLOR.pathNodeFill,
      'border-color':    '#fff',
      'border-width':    3,
      'z-index':         998,
    },
  },
  {
    selector: 'edge.path-edge',
    style: {
      'line-color':  COLOR.pathEdge,
      width:         3.5,
      opacity:       1,
      'z-index':     997,
    },
  },

  // ── Base edge ──────────────────────────────────────────────────────────────
  {
    selector: 'edge',
    style: {
      width:                        2,
      'line-color':                 COLOR.edgeDefault,
      'curve-style':                'bezier',
      'line-opacity':               0.75,
      'transition-property':        'line-color, width, opacity',
      'transition-duration':        '0.18s',
      'transition-timing-function': 'ease',
    },
  },

  // Internal edges (within an expanded group) — thinner and muted
  {
    selector: 'edge[edgeType="internal"]',
    style: {
      width:          1.5,
      'line-style':   'dashed',
      'line-dash-pattern': [5, 3],
      'line-color':   'rgba(160,174,192,0.7)',
    },
  },

  // Device edges (sub-group → leaf device)
  {
    selector: 'edge[edgeType="device"]',
    style: {
      width:        1.2,
      'line-color': 'rgba(160,174,192,0.55)',
      'line-style': 'dotted',
    },
  },

  // ── Edge states ───────────────────────────────────────────────────────────
  { selector: 'edge.faded',       style: { opacity: 0.08 } },
  { selector: 'edge.highlighted', style: { 'line-color': COLOR.edgeHighlight, width: 2.5, opacity: 1 } },
  { selector: 'edge:hover',       style: { 'line-color': COLOR.edgeHighlight, width: 2.5 } },
];
