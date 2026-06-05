/**
 * Enterprise Network Topology Data Model
 *
 * Three-level hierarchy:
 *   Level 0 — TOP_LEVEL_NODES        (6 group circles visible on load)
 *   Level 1 — EXPANSION_MAP          (sub-groups revealed on first double-click)
 *   Level 2 — DEVICE_EXPANSION_MAP   (leaf devices revealed on second double-click)
 *
 * ALL_EXPANSION_MAP merges both maps so expansion logic uses a single lookup.
 * EXPANDABLE_IDS is the Set of node IDs that have an expansion entry.
 */

// ─── Node type constants ───────────────────────────────────────────────────

export const NODE_TYPES = {
  // Level 0 – top-group
  CLOUD_GROUP:   'cloud-group',
  ROUTER_GROUP:  'router-group',
  SWITCH_GROUP:  'switch-group',
  SERVER_GROUP:  'server-group',
  LAPTOP_GROUP:  'laptop-group',
  DESKTOP_GROUP: 'desktop-group',

  // Level 1 – sub-group
  CLOUD_PROVIDER:    'cloud-provider',
  ROUTER_SUBGROUP:   'router-subgroup',
  SWITCH_SUBGROUP:   'switch-subgroup',
  SERVER_SUBGROUP:   'server-subgroup',
  REGION_GROUP:      'region-group',

  // Level 2 – leaf devices
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

// ─── Level 0 — top-level group nodes (Phase 1 visible) ────────────────────

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
        ip: '0.0.0.0/0',
        region: 'Global',
        lastUpdated: '2026-06-04T08:00:00Z',
        os: 'N/A',
        role: 'Gateway',
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
        ip: '10.0.0.0/8',
        region: 'Global',
        lastUpdated: '2026-06-04T07:30:00Z',
        os: 'Cisco IOS XE',
        role: 'Network Routing',
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
        ip: '10.1.0.0/16',
        region: 'Global',
        lastUpdated: '2026-06-04T07:35:00Z',
        os: 'Cisco NX-OS',
        role: 'Layer-2 Switching',
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
        ip: '10.2.0.0/16',
        region: 'Primary DC',
        lastUpdated: '2026-06-04T08:10:00Z',
        os: 'Linux / Windows Server',
        role: 'Application Hosting',
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
        ip: '10.10.0.0/16',
        region: 'Multi-Region',
        lastUpdated: '2026-06-04T06:00:00Z',
        os: 'macOS / Windows 11',
        role: 'End User Device',
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
        ip: '10.20.0.0/16',
        region: 'Multi-Region',
        lastUpdated: '2026-06-04T06:00:00Z',
        os: 'Windows 11',
        role: 'End User Device',
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

// ─── Level 1 — Expansion map (top-group → sub-groups) ─────────────────────

export const EXPANSION_MAP = {
  cloud: {
    nodes: [
      {
        data: {
          id: 'aws', label: 'AWS',
          type: NODE_TYPES.CLOUD_PROVIDER, parentGroup: 'cloud',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Amazon Web Services', deviceCount: 0, status: 'healthy', ip: '52.0.0.0/8', region: 'US East', lastUpdated: '2026-06-04T08:00:00Z', os: 'AWS Platform', role: 'Cloud Provider' },
        },
      },
      {
        data: {
          id: 'azure', label: 'Azure',
          type: NODE_TYPES.CLOUD_PROVIDER, parentGroup: 'cloud',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Microsoft Azure', deviceCount: 0, status: 'healthy', ip: '40.0.0.0/8', region: 'EU West', lastUpdated: '2026-06-04T08:00:00Z', os: 'Azure Platform', role: 'Cloud Provider' },
        },
      },
      {
        data: {
          id: 'internet', label: 'Internet',
          type: NODE_TYPES.CLOUD_PROVIDER, parentGroup: 'cloud',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Public internet gateway', deviceCount: 0, status: 'healthy', ip: '0.0.0.0/0', region: 'Global', lastUpdated: '2026-06-04T08:00:00Z', os: 'N/A', role: 'Internet Gateway' },
        },
      },
    ],
    edges: [
      { data: { id: 'e-cloud-aws',      source: 'cloud', target: 'aws',      edgeType: 'internal', bandwidth: '100 Gbps', protocol: 'AWS Direct Connect' } },
      { data: { id: 'e-cloud-azure',    source: 'cloud', target: 'azure',    edgeType: 'internal', bandwidth: '100 Gbps', protocol: 'Azure ExpressRoute' } },
      { data: { id: 'e-cloud-internet', source: 'cloud', target: 'internet', edgeType: 'internal', bandwidth: '10 Gbps',  protocol: 'BGP' } },
    ],
  },

  'router-group': {
    nodes: [
      {
        data: {
          id: 'core-routers', label: 'Core Routers',
          type: NODE_TYPES.ROUTER_SUBGROUP, parentGroup: 'router-group',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'High-capacity core routing layer', deviceCount: 2, status: 'healthy', ip: '10.0.0.0/24', region: 'Primary DC', lastUpdated: '2026-06-04T07:30:00Z', os: 'Cisco IOS XE 17.9', role: 'Core Routing' },
        },
      },
      {
        data: {
          id: 'branch-routers', label: 'Branch Routers',
          type: NODE_TYPES.ROUTER_SUBGROUP, parentGroup: 'router-group',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Branch office routers', deviceCount: 2, status: 'healthy', ip: '10.0.1.0/24', region: 'Multi-Region', lastUpdated: '2026-06-04T07:25:00Z', os: 'Cisco IOS XE 17.6', role: 'Branch Routing' },
        },
      },
    ],
    edges: [
      { data: { id: 'e-rg-core',   source: 'router-group', target: 'core-routers',   edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'OSPF' } },
      { data: { id: 'e-rg-branch', source: 'router-group', target: 'branch-routers', edgeType: 'internal', bandwidth: '1 Gbps',  protocol: 'OSPF' } },
    ],
  },

  'switch-group': {
    nodes: [
      {
        data: {
          id: 'core-switches', label: 'Core Switches',
          type: NODE_TYPES.SWITCH_SUBGROUP, parentGroup: 'switch-group',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Distribution layer switches', deviceCount: 3, status: 'healthy', ip: '10.1.0.0/24', region: 'Primary DC', lastUpdated: '2026-06-04T07:35:00Z', os: 'Cisco NX-OS 10.2', role: 'Core Switching' },
        },
      },
      {
        data: {
          id: 'access-switches', label: 'Access Switches',
          type: NODE_TYPES.SWITCH_SUBGROUP, parentGroup: 'switch-group',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Edge access switches', deviceCount: 5, status: 'healthy', ip: '10.1.1.0/24', region: 'Multi-Region', lastUpdated: '2026-06-04T07:40:00Z', os: 'Cisco IOS 15.2', role: 'Access Switching' },
        },
      },
    ],
    edges: [
      { data: { id: 'e-sg-core',   source: 'switch-group', target: 'core-switches',   edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'STP' } },
      { data: { id: 'e-sg-access', source: 'switch-group', target: 'access-switches', edgeType: 'internal', bandwidth: '1 Gbps',  protocol: 'STP' } },
    ],
  },

  'central-server': {
    nodes: [
      {
        data: {
          id: 'web-servers', label: 'Web Servers',
          type: NODE_TYPES.SERVER_SUBGROUP, parentGroup: 'central-server',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Frontend web servers (Nginx)', deviceCount: 3, status: 'healthy', ip: '10.2.0.0/24', region: 'Primary DC', lastUpdated: '2026-06-04T08:05:00Z', os: 'Ubuntu 24.04 LTS', role: 'Web Tier' },
        },
      },
      {
        data: {
          id: 'app-servers', label: 'App Servers',
          type: NODE_TYPES.SERVER_SUBGROUP, parentGroup: 'central-server',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Application servers (Node.js / Java)', deviceCount: 4, status: 'healthy', ip: '10.2.1.0/24', region: 'Primary DC', lastUpdated: '2026-06-04T08:10:00Z', os: 'Ubuntu 24.04 LTS', role: 'Application Tier' },
        },
      },
      {
        data: {
          id: 'db-servers', label: 'DB Servers',
          type: NODE_TYPES.SERVER_SUBGROUP, parentGroup: 'central-server',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Database servers (PostgreSQL)', deviceCount: 3, status: 'healthy', ip: '10.2.2.0/24', region: 'Primary DC', lastUpdated: '2026-06-04T08:15:00Z', os: 'RHEL 9.2', role: 'Data Tier' },
        },
      },
      {
        data: {
          id: 'file-servers', label: 'File Servers',
          type: NODE_TYPES.SERVER_SUBGROUP, parentGroup: 'central-server',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'File and NAS servers (Samba / NFS)', deviceCount: 2, status: 'healthy', ip: '10.2.3.0/24', region: 'Primary DC', lastUpdated: '2026-06-04T07:50:00Z', os: 'Ubuntu 22.04 LTS', role: 'Storage Tier' },
        },
      },
    ],
    edges: [
      { data: { id: 'e-cs-web',  source: 'central-server', target: 'web-servers',  edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-cs-app',  source: 'central-server', target: 'app-servers',  edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-cs-db',   source: 'central-server', target: 'db-servers',   edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-cs-file', source: 'central-server', target: 'file-servers', edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'laptop-group': {
    nodes: [
      {
        data: {
          id: 'lap-na', label: 'North America',
          type: NODE_TYPES.REGION_GROUP, parentGroup: 'laptop-group',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Laptops – North America', deviceCount: 18, status: 'healthy', ip: '10.10.1.0/24', region: 'North America', lastUpdated: '2026-06-04T06:00:00Z', os: 'Mixed', role: 'End User' },
        },
      },
      {
        data: {
          id: 'lap-eu', label: 'Europe',
          type: NODE_TYPES.REGION_GROUP, parentGroup: 'laptop-group',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Laptops – Europe', deviceCount: 16, status: 'healthy', ip: '10.10.2.0/24', region: 'Europe', lastUpdated: '2026-06-04T06:00:00Z', os: 'Mixed', role: 'End User' },
        },
      },
      {
        data: {
          id: 'lap-ap', label: 'Asia Pacific',
          type: NODE_TYPES.REGION_GROUP, parentGroup: 'laptop-group',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Laptops – Asia Pacific', deviceCount: 14, status: 'healthy', ip: '10.10.3.0/24', region: 'Asia Pacific', lastUpdated: '2026-06-04T06:00:00Z', os: 'Mixed', role: 'End User' },
        },
      },
    ],
    edges: [
      { data: { id: 'e-lg-na', source: 'laptop-group', target: 'lap-na', edgeType: 'internal', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-lg-eu', source: 'laptop-group', target: 'lap-eu', edgeType: 'internal', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-lg-ap', source: 'laptop-group', target: 'lap-ap', edgeType: 'internal', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'desktop-group': {
    nodes: [
      {
        data: {
          id: 'desk-na', label: 'North America',
          type: NODE_TYPES.REGION_GROUP, parentGroup: 'desktop-group',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Desktops – North America', deviceCount: 14, status: 'healthy', ip: '10.20.1.0/24', region: 'North America', lastUpdated: '2026-06-04T06:00:00Z', os: 'Windows 11', role: 'End User' },
        },
      },
      {
        data: {
          id: 'desk-eu', label: 'Europe',
          type: NODE_TYPES.REGION_GROUP, parentGroup: 'desktop-group',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Desktops – Europe', deviceCount: 12, status: 'healthy', ip: '10.20.2.0/24', region: 'Europe', lastUpdated: '2026-06-04T06:00:00Z', os: 'Windows 11', role: 'End User' },
        },
      },
      {
        data: {
          id: 'desk-ap', label: 'Asia Pacific',
          type: NODE_TYPES.REGION_GROUP, parentGroup: 'desktop-group',
          level: NODE_LEVELS.SUB_GROUP,
          meta: { description: 'Desktops – Asia Pacific', deviceCount: 8, status: 'healthy', ip: '10.20.3.0/24', region: 'Asia Pacific', lastUpdated: '2026-06-04T06:00:00Z', os: 'Windows 11', role: 'End User' },
        },
      },
    ],
    edges: [
      { data: { id: 'e-dg-na', source: 'desktop-group', target: 'desk-na', edgeType: 'internal', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-dg-eu', source: 'desktop-group', target: 'desk-eu', edgeType: 'internal', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-dg-ap', source: 'desktop-group', target: 'desk-ap', edgeType: 'internal', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },
};

// ─── Level 2 — Device expansion map (sub-group → leaf devices) ────────────

export const DEVICE_EXPANSION_MAP = {
  'core-routers': {
    nodes: [
      { data: { id: 'rtr-core-01', label: 'RTR-CORE-01', type: NODE_TYPES.ROUTER, parentGroup: 'core-routers', level: NODE_LEVELS.DEVICE, meta: { description: 'Primary core router', status: 'healthy', ip: '10.0.0.1', region: 'Primary DC', lastUpdated: '2026-06-04T07:30:00Z', os: 'Cisco IOS XE 17.9.3', role: 'Core Router' } } },
      { data: { id: 'rtr-core-02', label: 'RTR-CORE-02', type: NODE_TYPES.ROUTER, parentGroup: 'core-routers', level: NODE_LEVELS.DEVICE, meta: { description: 'Secondary core router (HA)', status: 'healthy', ip: '10.0.0.2', region: 'Primary DC', lastUpdated: '2026-06-04T07:28:00Z', os: 'Cisco IOS XE 17.9.3', role: 'Core Router' } } },
    ],
    edges: [
      { data: { id: 'e-cr-01', source: 'core-routers', target: 'rtr-core-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-cr-02', source: 'core-routers', target: 'rtr-core-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'branch-routers': {
    nodes: [
      { data: { id: 'rtr-br-01', label: 'RTR-BR-01', type: NODE_TYPES.ROUTER, parentGroup: 'branch-routers', level: NODE_LEVELS.DEVICE, meta: { description: 'North America branch router', status: 'healthy', ip: '10.0.1.1', region: 'North America', lastUpdated: '2026-06-04T07:20:00Z', os: 'Cisco IOS XE 17.6.4', role: 'Branch Router' } } },
      { data: { id: 'rtr-br-02', label: 'RTR-BR-02', type: NODE_TYPES.ROUTER, parentGroup: 'branch-routers', level: NODE_LEVELS.DEVICE, meta: { description: 'Europe branch router', status: 'healthy', ip: '10.0.1.2', region: 'Europe', lastUpdated: '2026-06-04T07:22:00Z', os: 'Cisco IOS XE 17.6.4', role: 'Branch Router' } } },
    ],
    edges: [
      { data: { id: 'e-br-01', source: 'branch-routers', target: 'rtr-br-01', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-br-02', source: 'branch-routers', target: 'rtr-br-02', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'core-switches': {
    nodes: [
      { data: { id: 'sw-core-01', label: 'SW-CORE-01', type: NODE_TYPES.SWITCH, parentGroup: 'core-switches', level: NODE_LEVELS.DEVICE, meta: { description: 'Primary core switch', status: 'healthy', ip: '10.1.0.1', region: 'Primary DC', lastUpdated: '2026-06-04T07:35:00Z', os: 'Cisco NX-OS 10.2.1', role: 'Core Switch' } } },
      { data: { id: 'sw-core-02', label: 'SW-CORE-02', type: NODE_TYPES.SWITCH, parentGroup: 'core-switches', level: NODE_LEVELS.DEVICE, meta: { description: 'Secondary core switch (HA)', status: 'healthy', ip: '10.1.0.2', region: 'Primary DC', lastUpdated: '2026-06-04T07:33:00Z', os: 'Cisco NX-OS 10.2.1', role: 'Core Switch' } } },
      { data: { id: 'sw-core-03', label: 'SW-CORE-03', type: NODE_TYPES.SWITCH, parentGroup: 'core-switches', level: NODE_LEVELS.DEVICE, meta: { description: 'Distribution switch', status: 'healthy', ip: '10.1.0.3', region: 'Primary DC', lastUpdated: '2026-06-04T07:31:00Z', os: 'Cisco NX-OS 10.1.4', role: 'Distribution Switch' } } },
    ],
    edges: [
      { data: { id: 'e-cs-01', source: 'core-switches', target: 'sw-core-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-cs-02', source: 'core-switches', target: 'sw-core-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-cs-03', source: 'core-switches', target: 'sw-core-03', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'access-switches': {
    nodes: [
      { data: { id: 'sw-acc-01', label: 'SW-ACC-01', type: NODE_TYPES.SWITCH, parentGroup: 'access-switches', level: NODE_LEVELS.DEVICE, meta: { description: 'Floor 1 access switch', status: 'healthy', ip: '10.1.1.1', region: 'Primary DC', lastUpdated: '2026-06-04T07:40:00Z', os: 'Cisco IOS 15.2.7', role: 'Access Switch' } } },
      { data: { id: 'sw-acc-02', label: 'SW-ACC-02', type: NODE_TYPES.SWITCH, parentGroup: 'access-switches', level: NODE_LEVELS.DEVICE, meta: { description: 'Floor 2 access switch', status: 'healthy', ip: '10.1.1.2', region: 'Primary DC', lastUpdated: '2026-06-04T07:38:00Z', os: 'Cisco IOS 15.2.7', role: 'Access Switch' } } },
      { data: { id: 'sw-acc-03', label: 'SW-ACC-03', type: NODE_TYPES.SWITCH, parentGroup: 'access-switches', level: NODE_LEVELS.DEVICE, meta: { description: 'Floor 3 access switch', status: 'warning', ip: '10.1.1.3', region: 'Primary DC', lastUpdated: '2026-06-04T07:36:00Z', os: 'Cisco IOS 15.2.5', role: 'Access Switch' } } },
      { data: { id: 'sw-acc-04', label: 'SW-ACC-04', type: NODE_TYPES.SWITCH, parentGroup: 'access-switches', level: NODE_LEVELS.DEVICE, meta: { description: 'Branch NA access switch', status: 'healthy', ip: '10.1.1.4', region: 'North America', lastUpdated: '2026-06-04T07:34:00Z', os: 'Cisco IOS 15.2.7', role: 'Access Switch' } } },
      { data: { id: 'sw-acc-05', label: 'SW-ACC-05', type: NODE_TYPES.SWITCH, parentGroup: 'access-switches', level: NODE_LEVELS.DEVICE, meta: { description: 'Branch EU access switch', status: 'healthy', ip: '10.1.1.5', region: 'Europe', lastUpdated: '2026-06-04T07:32:00Z', os: 'Cisco IOS 15.2.6', role: 'Access Switch' } } },
    ],
    edges: [
      { data: { id: 'e-as-01', source: 'access-switches', target: 'sw-acc-01', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-as-02', source: 'access-switches', target: 'sw-acc-02', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-as-03', source: 'access-switches', target: 'sw-acc-03', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-as-04', source: 'access-switches', target: 'sw-acc-04', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-as-05', source: 'access-switches', target: 'sw-acc-05', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'web-servers': {
    nodes: [
      { data: { id: 'web-01', label: 'WEB-01', type: NODE_TYPES.SERVER, parentGroup: 'web-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Primary web server (Nginx)', status: 'healthy', ip: '10.2.0.1', region: 'Primary DC', lastUpdated: '2026-06-04T08:05:00Z', os: 'Ubuntu 24.04 LTS', role: 'Web Server' } } },
      { data: { id: 'web-02', label: 'WEB-02', type: NODE_TYPES.SERVER, parentGroup: 'web-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Secondary web server', status: 'healthy', ip: '10.2.0.2', region: 'Primary DC', lastUpdated: '2026-06-04T08:03:00Z', os: 'Ubuntu 24.04 LTS', role: 'Web Server' } } },
      { data: { id: 'web-03', label: 'WEB-03', type: NODE_TYPES.SERVER, parentGroup: 'web-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Static content server (CDN origin)', status: 'healthy', ip: '10.2.0.3', region: 'Primary DC', lastUpdated: '2026-06-04T08:01:00Z', os: 'Ubuntu 22.04 LTS', role: 'CDN Origin' } } },
    ],
    edges: [
      { data: { id: 'e-ws-01', source: 'web-servers', target: 'web-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ws-02', source: 'web-servers', target: 'web-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ws-03', source: 'web-servers', target: 'web-03', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'app-servers': {
    nodes: [
      { data: { id: 'app-01', label: 'APP-01', type: NODE_TYPES.SERVER, parentGroup: 'app-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'API gateway server', status: 'healthy', ip: '10.2.1.1', region: 'Primary DC', lastUpdated: '2026-06-04T08:10:00Z', os: 'Ubuntu 24.04 LTS', role: 'API Gateway' } } },
      { data: { id: 'app-02', label: 'APP-02', type: NODE_TYPES.SERVER, parentGroup: 'app-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Business logic server (Java)', status: 'healthy', ip: '10.2.1.2', region: 'Primary DC', lastUpdated: '2026-06-04T08:08:00Z', os: 'Ubuntu 24.04 LTS', role: 'App Server' } } },
      { data: { id: 'app-03', label: 'APP-03', type: NODE_TYPES.SERVER, parentGroup: 'app-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Background job processor', status: 'healthy', ip: '10.2.1.3', region: 'Primary DC', lastUpdated: '2026-06-04T08:06:00Z', os: 'Ubuntu 24.04 LTS', role: 'Job Processor' } } },
      { data: { id: 'app-04', label: 'APP-04', type: NODE_TYPES.SERVER, parentGroup: 'app-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Auth and identity server', status: 'healthy', ip: '10.2.1.4', region: 'Primary DC', lastUpdated: '2026-06-04T08:04:00Z', os: 'RHEL 9.2', role: 'Auth Server' } } },
    ],
    edges: [
      { data: { id: 'e-ap-01', source: 'app-servers', target: 'app-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ap-02', source: 'app-servers', target: 'app-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ap-03', source: 'app-servers', target: 'app-03', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ap-04', source: 'app-servers', target: 'app-04', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'db-servers': {
    nodes: [
      { data: { id: 'db-01', label: 'DB-01', type: NODE_TYPES.SERVER, parentGroup: 'db-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Primary PostgreSQL database', status: 'healthy', ip: '10.2.2.1', region: 'Primary DC', lastUpdated: '2026-06-04T08:15:00Z', os: 'RHEL 9.2', role: 'Primary DB' } } },
      { data: { id: 'db-02', label: 'DB-02', type: NODE_TYPES.SERVER, parentGroup: 'db-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Replica PostgreSQL database', status: 'healthy', ip: '10.2.2.2', region: 'Primary DC', lastUpdated: '2026-06-04T08:13:00Z', os: 'RHEL 9.2', role: 'Replica DB' } } },
      { data: { id: 'db-03', label: 'DB-03', type: NODE_TYPES.SERVER, parentGroup: 'db-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Redis cache cluster', status: 'healthy', ip: '10.2.2.3', region: 'Primary DC', lastUpdated: '2026-06-04T08:11:00Z', os: 'Ubuntu 22.04 LTS', role: 'Cache Server' } } },
    ],
    edges: [
      { data: { id: 'e-db-01', source: 'db-servers', target: 'db-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-db-02', source: 'db-servers', target: 'db-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-db-03', source: 'db-servers', target: 'db-03', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'file-servers': {
    nodes: [
      { data: { id: 'file-01', label: 'FILE-01', type: NODE_TYPES.SERVER, parentGroup: 'file-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Network attached storage (Samba)', status: 'healthy', ip: '10.2.3.1', region: 'Primary DC', lastUpdated: '2026-06-04T07:50:00Z', os: 'Ubuntu 22.04 LTS', role: 'NAS Server' } } },
      { data: { id: 'file-02', label: 'FILE-02', type: NODE_TYPES.SERVER, parentGroup: 'file-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Backup and archive server', status: 'healthy', ip: '10.2.3.2', region: 'Primary DC', lastUpdated: '2026-06-04T07:48:00Z', os: 'Ubuntu 22.04 LTS', role: 'Backup Server' } } },
    ],
    edges: [
      { data: { id: 'e-fs-01', source: 'file-servers', target: 'file-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'NFS' } },
      { data: { id: 'e-fs-02', source: 'file-servers', target: 'file-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'NFS' } },
    ],
  },

  'lap-na': {
    nodes: [
      { data: { id: 'lap-na-01', label: 'LAP-NA-01', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Engineering laptop', status: 'healthy', ip: '10.10.1.1', region: 'North America', lastUpdated: '2026-06-04T05:00:00Z', os: 'macOS 15.2', role: 'Developer' } } },
      { data: { id: 'lap-na-02', label: 'LAP-NA-02', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Sales laptop', status: 'healthy', ip: '10.10.1.2', region: 'North America', lastUpdated: '2026-06-04T05:10:00Z', os: 'Windows 11 Pro', role: 'Sales' } } },
      { data: { id: 'lap-na-03', label: 'LAP-NA-03', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Management laptop', status: 'healthy', ip: '10.10.1.3', region: 'North America', lastUpdated: '2026-06-04T04:55:00Z', os: 'macOS 15.1', role: 'Management' } } },
      { data: { id: 'lap-na-04', label: 'LAP-NA-04', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Finance laptop', status: 'healthy', ip: '10.10.1.4', region: 'North America', lastUpdated: '2026-06-04T05:05:00Z', os: 'Windows 11 Pro', role: 'Finance' } } },
      { data: { id: 'lap-na-05', label: 'LAP-NA-05', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-na', level: NODE_LEVELS.DEVICE, meta: { description: 'HR laptop', status: 'warning', ip: '10.10.1.5', region: 'North America', lastUpdated: '2026-06-03T18:00:00Z', os: 'Windows 11 Pro', role: 'HR' } } },
    ],
    edges: [
      { data: { id: 'e-lna-01', source: 'lap-na', target: 'lap-na-01', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lna-02', source: 'lap-na', target: 'lap-na-02', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lna-03', source: 'lap-na', target: 'lap-na-03', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lna-04', source: 'lap-na', target: 'lap-na-04', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lna-05', source: 'lap-na', target: 'lap-na-05', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
    ],
  },

  'lap-eu': {
    nodes: [
      { data: { id: 'lap-eu-01', label: 'LAP-EU-01', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'Engineering laptop', status: 'healthy', ip: '10.10.2.1', region: 'Europe', lastUpdated: '2026-06-04T06:00:00Z', os: 'Ubuntu 24.04 LTS', role: 'Developer' } } },
      { data: { id: 'lap-eu-02', label: 'LAP-EU-02', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'Product laptop', status: 'healthy', ip: '10.10.2.2', region: 'Europe', lastUpdated: '2026-06-04T05:50:00Z', os: 'macOS 15.2', role: 'Product' } } },
      { data: { id: 'lap-eu-03', label: 'LAP-EU-03', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'Design laptop', status: 'healthy', ip: '10.10.2.3', region: 'Europe', lastUpdated: '2026-06-04T05:45:00Z', os: 'macOS 15.2', role: 'Design' } } },
      { data: { id: 'lap-eu-04', label: 'LAP-EU-04', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'Operations laptop', status: 'healthy', ip: '10.10.2.4', region: 'Europe', lastUpdated: '2026-06-04T05:40:00Z', os: 'Windows 11 Pro', role: 'Operations' } } },
    ],
    edges: [
      { data: { id: 'e-leu-01', source: 'lap-eu', target: 'lap-eu-01', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-leu-02', source: 'lap-eu', target: 'lap-eu-02', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-leu-03', source: 'lap-eu', target: 'lap-eu-03', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-leu-04', source: 'lap-eu', target: 'lap-eu-04', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
    ],
  },

  'lap-ap': {
    nodes: [
      { data: { id: 'lap-ap-01', label: 'LAP-AP-01', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-ap', level: NODE_LEVELS.DEVICE, meta: { description: 'Engineering laptop', status: 'healthy', ip: '10.10.3.1', region: 'Asia Pacific', lastUpdated: '2026-06-04T00:00:00Z', os: 'macOS 14.5', role: 'Developer' } } },
      { data: { id: 'lap-ap-02', label: 'LAP-AP-02', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-ap', level: NODE_LEVELS.DEVICE, meta: { description: 'Support laptop', status: 'healthy', ip: '10.10.3.2', region: 'Asia Pacific', lastUpdated: '2026-06-03T23:50:00Z', os: 'Windows 11 Pro', role: 'Support' } } },
      { data: { id: 'lap-ap-03', label: 'LAP-AP-03', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-ap', level: NODE_LEVELS.DEVICE, meta: { description: 'Sales laptop', status: 'healthy', ip: '10.10.3.3', region: 'Asia Pacific', lastUpdated: '2026-06-03T23:40:00Z', os: 'Windows 11 Pro', role: 'Sales' } } },
      { data: { id: 'lap-ap-04', label: 'LAP-AP-04', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-ap', level: NODE_LEVELS.DEVICE, meta: { description: 'Management laptop', status: 'healthy', ip: '10.10.3.4', region: 'Asia Pacific', lastUpdated: '2026-06-03T23:30:00Z', os: 'macOS 14.5', role: 'Management' } } },
    ],
    edges: [
      { data: { id: 'e-lap-01', source: 'lap-ap', target: 'lap-ap-01', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lap-02', source: 'lap-ap', target: 'lap-ap-02', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lap-03', source: 'lap-ap', target: 'lap-ap-03', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lap-04', source: 'lap-ap', target: 'lap-ap-04', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
    ],
  },

  'desk-na': {
    nodes: [
      { data: { id: 'desk-na-01', label: 'DESK-NA-01', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Engineering workstation', status: 'healthy', ip: '10.20.1.1', region: 'North America', lastUpdated: '2026-06-04T05:00:00Z', os: 'Windows 11 Pro', role: 'Workstation' } } },
      { data: { id: 'desk-na-02', label: 'DESK-NA-02', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Finance workstation', status: 'healthy', ip: '10.20.1.2', region: 'North America', lastUpdated: '2026-06-04T05:05:00Z', os: 'Windows 11 Pro', role: 'Finance Workstation' } } },
      { data: { id: 'desk-na-03', label: 'DESK-NA-03', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Reception workstation', status: 'healthy', ip: '10.20.1.3', region: 'North America', lastUpdated: '2026-06-04T04:50:00Z', os: 'Windows 11 Pro', role: 'Reception' } } },
      { data: { id: 'desk-na-04', label: 'DESK-NA-04', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Conference room workstation', status: 'healthy', ip: '10.20.1.4', region: 'North America', lastUpdated: '2026-06-04T04:45:00Z', os: 'Windows 11 Pro', role: 'Conference' } } },
    ],
    edges: [
      { data: { id: 'e-dna-01', source: 'desk-na', target: 'desk-na-01', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-dna-02', source: 'desk-na', target: 'desk-na-02', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-dna-03', source: 'desk-na', target: 'desk-na-03', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-dna-04', source: 'desk-na', target: 'desk-na-04', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'desk-eu': {
    nodes: [
      { data: { id: 'desk-eu-01', label: 'DESK-EU-01', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'Engineering workstation', status: 'healthy', ip: '10.20.2.1', region: 'Europe', lastUpdated: '2026-06-04T06:00:00Z', os: 'Ubuntu 24.04 LTS', role: 'Workstation' } } },
      { data: { id: 'desk-eu-02', label: 'DESK-EU-02', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'Finance workstation', status: 'healthy', ip: '10.20.2.2', region: 'Europe', lastUpdated: '2026-06-04T05:55:00Z', os: 'Windows 11 Pro', role: 'Finance Workstation' } } },
      { data: { id: 'desk-eu-03', label: 'DESK-EU-03', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'Shared workstation', status: 'healthy', ip: '10.20.2.3', region: 'Europe', lastUpdated: '2026-06-04T05:50:00Z', os: 'Windows 11 Pro', role: 'Shared' } } },
    ],
    edges: [
      { data: { id: 'e-deu-01', source: 'desk-eu', target: 'desk-eu-01', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-deu-02', source: 'desk-eu', target: 'desk-eu-02', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-deu-03', source: 'desk-eu', target: 'desk-eu-03', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'desk-ap': {
    nodes: [
      { data: { id: 'desk-ap-01', label: 'DESK-AP-01', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-ap', level: NODE_LEVELS.DEVICE, meta: { description: 'Engineering workstation', status: 'healthy', ip: '10.20.3.1', region: 'Asia Pacific', lastUpdated: '2026-06-03T23:00:00Z', os: 'Windows 11 Pro', role: 'Workstation' } } },
      { data: { id: 'desk-ap-02', label: 'DESK-AP-02', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-ap', level: NODE_LEVELS.DEVICE, meta: { description: 'Support workstation', status: 'healthy', ip: '10.20.3.2', region: 'Asia Pacific', lastUpdated: '2026-06-03T22:55:00Z', os: 'Windows 11 Pro', role: 'Support' } } },
      { data: { id: 'desk-ap-03', label: 'DESK-AP-03', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-ap', level: NODE_LEVELS.DEVICE, meta: { description: 'Finance workstation', status: 'healthy', ip: '10.20.3.3', region: 'Asia Pacific', lastUpdated: '2026-06-03T22:50:00Z', os: 'Windows 11 Pro', role: 'Finance Workstation' } } },
    ],
    edges: [
      { data: { id: 'e-dap-01', source: 'desk-ap', target: 'desk-ap-01', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-dap-02', source: 'desk-ap', target: 'desk-ap-02', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-dap-03', source: 'desk-ap', target: 'desk-ap-03', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },
};

// ─── Combined expansion map (all levels) ──────────────────────────────────

export const ALL_EXPANSION_MAP = {
  ...EXPANSION_MAP,
  ...DEVICE_EXPANSION_MAP,
};

/**
 * Set of all node IDs that have expansion data.
 * Used by UI to show visual "expandable" cue on a node.
 */
export const EXPANDABLE_IDS = new Set(Object.keys(ALL_EXPANSION_MAP));

// ─── Flat search index (all nodes across all levels) ──────────────────────

/**
 * Returns a flat array of all topology nodes across all three levels.
 * Used to build the search index and to power autocomplete.
 *
 * Args:
 *   None
 *
 * Returns:
 *   Array<Object>: Flat list of node data objects from all hierarchy levels.
 *
 * Raises:
 *   None
 */
export function ntpl_getAllNodes() {
  try {
    const level0 = TOP_LEVEL_NODES.map((n) => n.data);

    const level1 = Object.values(EXPANSION_MAP).flatMap((entry) =>
      entry.nodes.map((n) => n.data),
    );

    const level2 = Object.values(DEVICE_EXPANSION_MAP).flatMap((entry) =>
      entry.nodes.map((n) => n.data),
    );

    return [...level0, ...level1, ...level2];
  } catch (error) {
    console.error('[ntpl_getAllNodes] Failed to collect topology nodes:', error);
    return [];
  }
}

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
