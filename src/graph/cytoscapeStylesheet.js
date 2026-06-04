/**
 * Production Cytoscape.js stylesheet.
 *
 * Node sizing:
 *   Level 0 groups (Phase 1): 82px
 *   Level 1 sub-groups (Phase 2): 66px
 *   Level 2 devices (Phase 2): 52px
 *
 * Interaction classes:
 *   .faded        → de-emphasised (not part of selection neighbourhood)
 *   .highlighted  → emphasised (neighbour of selected node)
 *   .selected-node → the directly selected node
 */

const encode = (svg) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

// ─── SVG icon library ──────────────────────────────────────────────────────
// All icons: 24×24 viewBox, stroke-based, white strokes for contrast on blue.

const ICON = {
  cloud: encode(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.93)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/></svg>`),

  router: encode(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.93)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="9" width="20" height="9" rx="2"/><line x1="8"  y1="9" x2="8"  y2="6.5" stroke="rgba(255,255,255,0.65)" stroke-width="1.5"/><line x1="12" y1="9" x2="12" y2="4.5" stroke="rgba(255,255,255,0.65)" stroke-width="1.5"/><line x1="16" y1="9" x2="16" y2="6.5" stroke="rgba(255,255,255,0.65)" stroke-width="1.5"/><circle cx="8"  cy="13.5" r="1.2" fill="rgba(255,255,255,0.93)" stroke="none"/><circle cx="12" cy="13.5" r="1.2" fill="rgba(255,255,255,0.93)" stroke="none"/><circle cx="16" cy="13.5" r="1.2" fill="rgba(255,255,255,0.93)" stroke="none"/></svg>`),

  switch: encode(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.93)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8.5" width="20" height="7" rx="1.5"/><line x1="6.5"  y1="8.5" x2="6.5"  y2="6"  stroke="rgba(255,255,255,0.6)" stroke-width="1.4"/><line x1="10.5" y1="8.5" x2="10.5" y2="6"  stroke="rgba(255,255,255,0.6)" stroke-width="1.4"/><line x1="14.5" y1="8.5" x2="14.5" y2="6"  stroke="rgba(255,255,255,0.6)" stroke-width="1.4"/><line x1="18"   y1="8.5" x2="18"   y2="6"  stroke="rgba(255,255,255,0.6)" stroke-width="1.4"/><line x1="6.5"  y1="15.5" x2="6.5"  y2="18" stroke="rgba(255,255,255,0.6)" stroke-width="1.4"/><line x1="10.5" y1="15.5" x2="10.5" y2="18" stroke="rgba(255,255,255,0.6)" stroke-width="1.4"/><line x1="14.5" y1="15.5" x2="14.5" y2="18" stroke="rgba(255,255,255,0.6)" stroke-width="1.4"/><circle cx="6.5"  cy="12" r="1" fill="rgba(255,255,255,0.93)" stroke="none"/><circle cx="10.5" cy="12" r="1" fill="rgba(255,255,255,0.93)" stroke="none"/><circle cx="14.5" cy="12" r="1" fill="rgba(255,255,255,0.93)" stroke="none"/><circle cx="18"   cy="12" r="1" fill="rgba(255,255,255,0.93)" stroke="none"/></svg>`),

  server: encode(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.93)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3.5" width="20" height="5" rx="1.5"/><rect x="2" y="10.5" width="20" height="5" rx="1.5"/><circle cx="18.5" cy="6"    r="1" fill="rgba(255,255,255,0.93)" stroke="none"/><circle cx="18.5" cy="13"   r="1" fill="rgba(255,255,255,0.93)" stroke="none"/><line x1="5.5" y1="6"  x2="12" y2="6"  stroke="rgba(255,255,255,0.6)" stroke-width="1.3"/><line x1="5.5" y1="13" x2="12" y2="13" stroke="rgba(255,255,255,0.6)" stroke-width="1.3"/><line x1="12" y1="15.5" x2="12" y2="19" stroke="rgba(255,255,255,0.65)" stroke-width="1.5"/><line x1="8.5" y1="19" x2="15.5" y2="19"/></svg>`),

  laptop: encode(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.93)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="10.5" rx="1.5"/><path d="M2 19.5h20l-1.5-4H3.5L2 19.5z"/></svg>`),

  desktop: encode(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.93)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="13.5" rx="1.5"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="16.5" x2="12" y2="21"/></svg>`),

  // Generic sub-group icon (Phase 2 re-use)
  group: encode(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.93)" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="5" r="2.5"/><circle cx="5"  cy="17" r="2.5"/><circle cx="19" cy="17" r="2.5"/><line x1="12" y1="7.5" x2="6.5"  y2="14.5"/><line x1="12" y1="7.5" x2="17.5" y2="14.5"/></svg>`),
};

// ─── Icon selector helper ──────────────────────────────────────────────────

function iconFor(type) {
  if (type === 'cloud-group' || type === 'cloud-provider') return ICON.cloud;
  if (type === 'router-group' || type === 'router-subgroup' || type === 'router') return ICON.router;
  if (type === 'switch-group' || type === 'switch-subgroup' || type === 'switch') return ICON.switch;
  if (type === 'server-group' || type === 'server-subgroup' || type === 'server') return ICON.server;
  if (type === 'laptop-group' || type === 'laptop') return ICON.laptop;
  if (type === 'desktop-group' || type === 'desktop') return ICON.desktop;
  return ICON.group;
}

// ─── Colour palette ────────────────────────────────────────────────────────

const COLOR = {
  nodeDefault:   '#5b8db8',
  nodeHover:     '#4a7ba5',
  nodeSelected:  '#2c5f8a',
  nodeHighlight: '#3a7ab0',

  edgeDefault:   '#93bbdc',
  edgeHighlight: '#5b8db8',

  labelText:     '#1a2535',
  labelOutline:  'rgba(255,255,255,0.88)',

  borderWhite:   'rgba(255,255,255,0.7)',
  selectedRing:  '#ffffff',
};

// ─── Exported stylesheet array ─────────────────────────────────────────────

export const cytoscapeStylesheet = [

  // ── Base node ─────────────────────────────────────────────────────────────
  {
    selector: 'node',
    style: {
      width:  82,
      height: 82,
      shape:  'ellipse',
      'background-color':   COLOR.nodeDefault,
      'background-opacity': 1,

      'border-width':   2,
      'border-color':   'rgba(255,255,255,0.45)',
      'border-opacity': 1,

      'background-image':            ICON.group,
      'background-fit':              'none',
      'background-width':            '52%',
      'background-height':           '52%',
      'background-position-x':       '50%',
      'background-position-y':       '50%',
      'background-image-containment': 'over',
      'background-clip':             'none',

      label:               'data(label)',
      'font-family':       "'Inter', -apple-system, sans-serif",
      'font-size':         12,
      'font-weight':       500,
      color:               COLOR.labelText,
      'text-valign':       'bottom',
      'text-halign':       'center',
      'text-margin-y':     6,
      'text-wrap':         'wrap',
      'text-max-width':    96,
      'text-outline-color': COLOR.labelOutline,
      'text-outline-width': 3,
      'text-outline-opacity': 1,

      'transition-property':        'background-color, border-color, border-width, opacity',
      'transition-duration':        '0.15s',
      'transition-timing-function': 'ease',
    },
  },

  // ── Per-type icons ────────────────────────────────────────────────────────
  {
    selector: 'node[type="cloud-group"]',
    style: { 'background-image': ICON.cloud },
  },
  {
    selector: 'node[type="cloud-provider"]',
    style: { 'background-image': ICON.cloud, width: 66, height: 66 },
  },
  {
    selector: 'node[type="router-group"]',
    style: { 'background-image': ICON.router },
  },
  {
    selector: 'node[type="router-subgroup"]',
    style: { 'background-image': ICON.router, width: 66, height: 66 },
  },
  {
    selector: 'node[type="router"]',
    style: { 'background-image': ICON.router, width: 52, height: 52 },
  },
  {
    selector: 'node[type="switch-group"]',
    style: { 'background-image': ICON.switch },
  },
  {
    selector: 'node[type="switch-subgroup"]',
    style: { 'background-image': ICON.switch, width: 66, height: 66 },
  },
  {
    selector: 'node[type="switch"]',
    style: { 'background-image': ICON.switch, width: 52, height: 52 },
  },
  {
    selector: 'node[type="server-group"]',
    style: { 'background-image': ICON.server },
  },
  {
    selector: 'node[type="server-subgroup"]',
    style: { 'background-image': ICON.server, width: 66, height: 66 },
  },
  {
    selector: 'node[type="server"]',
    style: { 'background-image': ICON.server, width: 52, height: 52 },
  },
  {
    selector: 'node[type="laptop-group"]',
    style: { 'background-image': ICON.laptop },
  },
  {
    selector: 'node[type="region-group"]',
    style: { 'background-image': ICON.group, width: 66, height: 66 },
  },
  {
    selector: 'node[type="laptop"]',
    style: { 'background-image': ICON.laptop, width: 52, height: 52 },
  },
  {
    selector: 'node[type="desktop-group"]',
    style: { 'background-image': ICON.desktop },
  },
  {
    selector: 'node[type="desktop"]',
    style: { 'background-image': ICON.desktop, width: 52, height: 52 },
  },

  // ── Node hover ────────────────────────────────────────────────────────────
  {
    selector: 'node:hover',
    style: {
      'background-color': COLOR.nodeHover,
      'border-color':     'rgba(255,255,255,0.75)',
      'border-width':     2.5,
    },
  },

  // ── Interaction states ────────────────────────────────────────────────────
  {
    selector: 'node.faded',
    style: {
      opacity: 0.22,
    },
  },
  {
    selector: 'node.highlighted',
    style: {
      opacity:            1,
      'background-color': COLOR.nodeHighlight,
      'border-color':     'rgba(255,255,255,0.8)',
      'border-width':     2.5,
    },
  },
  {
    selector: 'node.selected-node',
    style: {
      opacity:            1,
      'background-color': COLOR.nodeSelected,
      'border-color':     COLOR.selectedRing,
      'border-width':     3,
      'z-index':          999,
    },
  },

  // ── Base edge ─────────────────────────────────────────────────────────────
  {
    selector: 'edge',
    style: {
      width:          2,
      'line-color':   COLOR.edgeDefault,
      'curve-style':  'bezier',
      'line-opacity': 0.85,

      'transition-property':        'line-color, width, opacity',
      'transition-duration':        '0.15s',
      'transition-timing-function': 'ease',
    },
  },

  // ── Edge states ───────────────────────────────────────────────────────────
  {
    selector: 'edge.faded',
    style: {
      opacity: 0.1,
    },
  },
  {
    selector: 'edge.highlighted',
    style: {
      'line-color':   COLOR.edgeHighlight,
      width:          2.5,
      'line-opacity': 1,
      opacity:        1,
    },
  },

  // ── Edge hover ────────────────────────────────────────────────────────────
  {
    selector: 'edge:hover',
    style: {
      'line-color': COLOR.edgeHighlight,
      width:        2.5,
    },
  },
];
