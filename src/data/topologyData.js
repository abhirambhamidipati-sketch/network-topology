/**
 * Enterprise Network Topology Data Model
 *
 * Defines the full hierarchy for all phases.
 * Phase 1: Only TOP_LEVEL_NODES and BACKBONE_EDGES are rendered.
 * Phase 2+: EXPANSION_MAP children are added on demand.
 */

export const NODE_TYPES = {
  CLOUD_GROUP:   'cloud-group',
  ROUTER_GROUP:  'router-group',
  SWITCH_GROUP:  'switch-group',
  SERVER_GROUP:  'server-group',
  LAPTOP_GROUP:  'laptop-group',
  DESKTOP_GROUP: 'desktop-group',

  // Phase 2 sub-group types
  CLOUD_PROVIDER:    'cloud-provider',
  ROUTER_SUBGROUP:   'router-subgroup',
  SWITCH_SUBGROUP:   'switch-subgroup',
  SERVER_SUBGROUP:   'server-subgroup',
  REGION_GROUP:      'region-group',

  // Phase 2 leaf device types
  ROUTER:   'router',
  SWITCH:   'switch',
  SERVER:   'server',
  LAPTOP:   'laptop',
  DESKTOP:  'desktop',
};

export const NODE_LEVELS = {
  TOP_GROUP: 0,
  SUB_GROUP: 1,
  DEVICE:    2,
};

// ─── Phase 1 visible nodes ─────────────────────────────────────────────────

export const TOP_LEVEL_NODES = [
  {
    data: {
      id: 'cloud',
      label: 'Cloud / Internet',
      type: NODE_TYPES.CLOUD_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'External cloud providers and internet gateway',
        deviceCount: 3,
        status: 'healthy',
      },
    },
  },
  {
    data: {
      id: 'router-group',
      label: 'Router Group',
      type: NODE_TYPES.ROUTER_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'Core and branch routers handling WAN/LAN routing',
        deviceCount: 4,
        status: 'healthy',
      },
    },
  },
  {
    data: {
      id: 'switch-group',
      label: 'Switch Group',
      type: NODE_TYPES.SWITCH_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'Core and access layer switches',
        deviceCount: 8,
        status: 'healthy',
      },
    },
  },
  {
    data: {
      id: 'central-server',
      label: 'Central Server\nGroup',
      type: NODE_TYPES.SERVER_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'Web, application, database and file servers',
        deviceCount: 12,
        status: 'healthy',
      },
    },
  },
  {
    data: {
      id: 'laptop-group',
      label: 'Laptop Group',
      type: NODE_TYPES.LAPTOP_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'Enterprise laptops across all regions',
        deviceCount: 48,
        status: 'healthy',
      },
    },
  },
  {
    data: {
      id: 'desktop-group',
      label: 'Desktop Group',
      type: NODE_TYPES.DESKTOP_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'Enterprise desktops across all regions',
        deviceCount: 34,
        status: 'healthy',
      },
    },
  },
];

// ─── Backbone edges ────────────────────────────────────────────────────────

export const BACKBONE_EDGES = [
  {
    data: {
      id: 'e-cloud-router',
      source: 'cloud',
      target: 'router-group',
      edgeType: 'backbone',
      bandwidth: '10 Gbps',
      protocol: 'BGP',
    },
  },
  {
    data: {
      id: 'e-router-switch',
      source: 'router-group',
      target: 'switch-group',
      edgeType: 'backbone',
      bandwidth: '10 Gbps',
      protocol: 'OSPF',
    },
  },
  {
    data: {
      id: 'e-switch-server',
      source: 'switch-group',
      target: 'central-server',
      edgeType: 'backbone',
      bandwidth: '10 Gbps',
      protocol: 'Ethernet',
    },
  },
  {
    data: {
      id: 'e-switch-laptop',
      source: 'switch-group',
      target: 'laptop-group',
      edgeType: 'backbone',
      bandwidth: '1 Gbps',
      protocol: 'Ethernet',
    },
  },
  {
    data: {
      id: 'e-switch-desktop',
      source: 'switch-group',
      target: 'desktop-group',
      edgeType: 'backbone',
      bandwidth: '1 Gbps',
      protocol: 'Ethernet',
    },
  },
];

// ─── Phase 1 element set ───────────────────────────────────────────────────

export const PHASE1_ELEMENTS = [...TOP_LEVEL_NODES, ...BACKBONE_EDGES];

// ─── Expansion map (Phase 2) ───────────────────────────────────────────────
// Maps a group node ID to its child nodes and edges that appear on expansion.
// Defined here so Phase 2 requires no data-layer changes.

export const EXPANSION_MAP = {
  cloud: {
    nodes: [
      { data: { id: 'aws',      label: 'AWS',         type: NODE_TYPES.CLOUD_PROVIDER, parentGroup: 'cloud', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Amazon Web Services', deviceCount: 0, status: 'healthy' } } },
      { data: { id: 'azure',    label: 'Azure',        type: NODE_TYPES.CLOUD_PROVIDER, parentGroup: 'cloud', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Microsoft Azure',    deviceCount: 0, status: 'healthy' } } },
      { data: { id: 'internet', label: 'Internet',     type: NODE_TYPES.CLOUD_PROVIDER, parentGroup: 'cloud', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Public internet gateway', deviceCount: 0, status: 'healthy' } } },
    ],
    edges: [
      { data: { id: 'e-cloud-aws',      source: 'cloud', target: 'aws',      edgeType: 'internal' } },
      { data: { id: 'e-cloud-azure',    source: 'cloud', target: 'azure',    edgeType: 'internal' } },
      { data: { id: 'e-cloud-internet', source: 'cloud', target: 'internet', edgeType: 'internal' } },
    ],
  },

  'router-group': {
    nodes: [
      { data: { id: 'core-routers',   label: 'Core Routers',   type: NODE_TYPES.ROUTER_SUBGROUP, parentGroup: 'router-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'High-capacity core routing', deviceCount: 2, status: 'healthy' } } },
      { data: { id: 'branch-routers', label: 'Branch Routers', type: NODE_TYPES.ROUTER_SUBGROUP, parentGroup: 'router-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Branch office routers',     deviceCount: 2, status: 'healthy' } } },
    ],
    edges: [
      { data: { id: 'e-rg-core',   source: 'router-group', target: 'core-routers',   edgeType: 'internal' } },
      { data: { id: 'e-rg-branch', source: 'router-group', target: 'branch-routers', edgeType: 'internal' } },
    ],
  },

  'switch-group': {
    nodes: [
      { data: { id: 'core-switches',   label: 'Core Switches',   type: NODE_TYPES.SWITCH_SUBGROUP, parentGroup: 'switch-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Distribution layer switches', deviceCount: 3, status: 'healthy' } } },
      { data: { id: 'access-switches', label: 'Access Switches', type: NODE_TYPES.SWITCH_SUBGROUP, parentGroup: 'switch-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Edge access switches',        deviceCount: 5, status: 'healthy' } } },
    ],
    edges: [
      { data: { id: 'e-sg-core',   source: 'switch-group', target: 'core-switches',   edgeType: 'internal' } },
      { data: { id: 'e-sg-access', source: 'switch-group', target: 'access-switches', edgeType: 'internal' } },
    ],
  },

  'central-server': {
    nodes: [
      { data: { id: 'web-servers',  label: 'Web Servers',  type: NODE_TYPES.SERVER_SUBGROUP, parentGroup: 'central-server', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Frontend web servers',    deviceCount: 3, status: 'healthy' } } },
      { data: { id: 'app-servers',  label: 'App Servers',  type: NODE_TYPES.SERVER_SUBGROUP, parentGroup: 'central-server', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Application servers',     deviceCount: 4, status: 'healthy' } } },
      { data: { id: 'db-servers',   label: 'DB Servers',   type: NODE_TYPES.SERVER_SUBGROUP, parentGroup: 'central-server', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Database servers',        deviceCount: 3, status: 'healthy' } } },
      { data: { id: 'file-servers', label: 'File Servers', type: NODE_TYPES.SERVER_SUBGROUP, parentGroup: 'central-server', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'File and NAS servers',    deviceCount: 2, status: 'healthy' } } },
    ],
    edges: [
      { data: { id: 'e-cs-web',  source: 'central-server', target: 'web-servers',  edgeType: 'internal' } },
      { data: { id: 'e-cs-app',  source: 'central-server', target: 'app-servers',  edgeType: 'internal' } },
      { data: { id: 'e-cs-db',   source: 'central-server', target: 'db-servers',   edgeType: 'internal' } },
      { data: { id: 'e-cs-file', source: 'central-server', target: 'file-servers', edgeType: 'internal' } },
    ],
  },

  'laptop-group': {
    nodes: [
      { data: { id: 'lap-na', label: 'North America', type: NODE_TYPES.REGION_GROUP, parentGroup: 'laptop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Laptops – North America', deviceCount: 18, status: 'healthy' } } },
      { data: { id: 'lap-eu', label: 'Europe',        type: NODE_TYPES.REGION_GROUP, parentGroup: 'laptop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Laptops – Europe',        deviceCount: 16, status: 'healthy' } } },
      { data: { id: 'lap-ap', label: 'Asia Pacific',  type: NODE_TYPES.REGION_GROUP, parentGroup: 'laptop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Laptops – Asia Pacific',  deviceCount: 14, status: 'healthy' } } },
    ],
    edges: [
      { data: { id: 'e-lg-na', source: 'laptop-group', target: 'lap-na', edgeType: 'internal' } },
      { data: { id: 'e-lg-eu', source: 'laptop-group', target: 'lap-eu', edgeType: 'internal' } },
      { data: { id: 'e-lg-ap', source: 'laptop-group', target: 'lap-ap', edgeType: 'internal' } },
    ],
  },

  'desktop-group': {
    nodes: [
      { data: { id: 'desk-na', label: 'North America', type: NODE_TYPES.REGION_GROUP, parentGroup: 'desktop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Desktops – North America', deviceCount: 14, status: 'healthy' } } },
      { data: { id: 'desk-eu', label: 'Europe',        type: NODE_TYPES.REGION_GROUP, parentGroup: 'desktop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Desktops – Europe',        deviceCount: 12, status: 'healthy' } } },
      { data: { id: 'desk-ap', label: 'Asia Pacific',  type: NODE_TYPES.REGION_GROUP, parentGroup: 'desktop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Desktops – Asia Pacific',  deviceCount: 8,  status: 'healthy' } } },
    ],
    edges: [
      { data: { id: 'e-dg-na', source: 'desktop-group', target: 'desk-na', edgeType: 'internal' } },
      { data: { id: 'e-dg-eu', source: 'desktop-group', target: 'desk-eu', edgeType: 'internal' } },
      { data: { id: 'e-dg-ap', source: 'desktop-group', target: 'desk-ap', edgeType: 'internal' } },
    ],
  },
};

// ─── Node type display labels ──────────────────────────────────────────────

export const TYPE_LABELS = {
  [NODE_TYPES.CLOUD_GROUP]:    'Cloud / Internet',
  [NODE_TYPES.ROUTER_GROUP]:   'Router Group',
  [NODE_TYPES.SWITCH_GROUP]:   'Switch Group',
  [NODE_TYPES.SERVER_GROUP]:   'Server Group',
  [NODE_TYPES.LAPTOP_GROUP]:   'Laptop Group',
  [NODE_TYPES.DESKTOP_GROUP]:  'Desktop Group',
  [NODE_TYPES.CLOUD_PROVIDER]: 'Cloud Provider',
  [NODE_TYPES.ROUTER_SUBGROUP]:'Router Sub-group',
  [NODE_TYPES.SWITCH_SUBGROUP]:'Switch Sub-group',
  [NODE_TYPES.SERVER_SUBGROUP]:'Server Sub-group',
  [NODE_TYPES.REGION_GROUP]:   'Regional Group',
  [NODE_TYPES.ROUTER]:         'Router',
  [NODE_TYPES.SWITCH]:         'Switch',
  [NODE_TYPES.SERVER]:         'Server',
  [NODE_TYPES.LAPTOP]:         'Laptop',
  [NODE_TYPES.DESKTOP]:        'Desktop',
};
