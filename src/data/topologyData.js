/**
 * Enterprise Network Topology Data — QWERTY Corporation
 *
 * Three-level hierarchy:
 *   Level 0 — TOP_LEVEL_NODES        (10 backbone groups, visible on load)
 *   Level 1 — EXPANSION_MAP          (sub-groups revealed on first double-click)
 *   Level 2 — DEVICE_EXPANSION_MAP   (leaf devices revealed on second double-click)
 *
 * QWERTY Corporation: 500 employees, 6 global regions.
 * IP scheme: 10.0.x.x infra, 10.1.x.x servers, 10.10-40.x.x endpoints
 */

// ─── Node type constants ────────────────────────────────────────────────────

export const NODE_TYPES = {
  // Level 0 – backbone groups
  CLOUD_GROUP:     'cloud-group',
  VPN_GROUP:       'vpn-group',
  FIREWALL_GROUP:  'firewall-group',
  ROUTER_GROUP:    'router-group',
  SWITCH_GROUP:    'switch-group',
  SERVER_GROUP:    'server-group',
  LAPTOP_GROUP:    'laptop-group',
  DESKTOP_GROUP:   'desktop-group',
  MOBILE_GROUP:    'mobile-group',
  GUEST_GROUP:     'guest-group',

  // Level 1 – sub-groups (cloud)
  CLOUD_PROVIDER:  'cloud-provider',

  // Level 1 – sub-groups (infra)
  VPN_SUBGROUP:    'vpn-subgroup',
  FIREWALL_SUBGROUP: 'firewall-subgroup',
  ROUTER_SUBGROUP: 'router-subgroup',
  SWITCH_SUBGROUP: 'switch-subgroup',

  // Level 1 – sub-groups (servers)
  WEB_SERVER_GROUP:       'web-server-group',
  APP_SERVER_GROUP:       'app-server-group',
  DB_SERVER_GROUP:        'db-server-group',
  AD_SERVER_GROUP:        'ad-server-group',
  MAIL_SERVER_GROUP:      'mail-server-group',
  FILE_SERVER_GROUP:      'file-server-group',
  MONITORING_GROUP:       'monitoring-group',
  BACKUP_GROUP:           'backup-group',

  // Level 1 – sub-groups (endpoints)
  REGION_GROUP:    'region-group',

  // Level 2 – leaf devices
  VPN_DEVICE:      'vpn-device',
  FIREWALL:        'firewall',
  ROUTER:          'router',
  SWITCH:          'switch',
  WEB_SERVER:      'web-server',
  APP_SERVER:      'app-server',
  DB_SERVER:       'db-server',
  AD_SERVER:       'ad-server',
  MAIL_SERVER:     'mail-server',
  FILE_SERVER:     'file-server',
  MONITORING_SERVER: 'monitoring-server',
  BACKUP_SERVER:   'backup-server',
  LAPTOP:          'laptop',
  DESKTOP:         'desktop',
  MOBILE:          'mobile',
  GUEST_DEVICE:    'guest-device',
};

export const NODE_LEVELS = {
  TOP_GROUP: 0,
  SUB_GROUP: 1,
  DEVICE:    2,
};

// ─── Network-level statistics ───────────────────────────────────────────────

export const NETWORK_STATS = {
  companyName:       'QWERTY Corporation',
  totalEmployees:    500,
  totalEndpoints:    892,
  totalServers:      27,
  totalRouters:      7,
  totalSwitches:     14,
  totalFirewalls:    6,
  totalVPNGateways:  2,
  totalRegions:      6,
  totalSites:        9,
};

// ─── Level 0 — backbone group nodes ─────────────────────────────────────────

export const TOP_LEVEL_NODES = [
  {
    data: {
      id: 'cloud',
      label: 'Cloud / Internet',
      displayLabel: 'Cloud / Internet\n3 providers',
      type: NODE_TYPES.CLOUD_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'External cloud providers and internet connectivity',
        deviceCount: 3,
        status: 'healthy',
        ip: '0.0.0.0/0',
        region: 'Global',
        lastUpdated: '2026-06-09T08:00:00Z',
        os: 'N/A',
        role: 'External Connectivity',
      },
    },
  },
  {
    data: {
      id: 'vpn-gateway',
      label: 'VPN Gateway',
      displayLabel: 'VPN Gateway\n2 appliances',
      type: NODE_TYPES.VPN_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'IPSec / SSL VPN gateway cluster for remote access',
        deviceCount: 2,
        status: 'healthy',
        ip: '172.16.0.0/24',
        region: 'HQ',
        lastUpdated: '2026-06-09T07:50:00Z',
        os: 'Palo Alto PAN-OS 11.1',
        role: 'Remote Access VPN',
      },
    },
  },
  {
    data: {
      id: 'firewall-group',
      label: 'Firewall Layer',
      displayLabel: 'Firewall Layer\n6 appliances',
      type: NODE_TYPES.FIREWALL_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'Perimeter, internal, and DMZ firewall appliances',
        deviceCount: 6,
        status: 'healthy',
        ip: '10.0.0.0/24',
        region: 'HQ',
        lastUpdated: '2026-06-09T07:45:00Z',
        os: 'Palo Alto PAN-OS / Cisco ASA',
        role: 'Network Security',
      },
    },
  },
  {
    data: {
      id: 'router-group',
      label: 'Core Router Layer',
      displayLabel: 'Core Router Layer\n7 routers',
      type: NODE_TYPES.ROUTER_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'Core WAN/LAN routers and branch office routers',
        deviceCount: 7,
        status: 'healthy',
        ip: '10.0.1.0/24',
        region: 'Global',
        lastUpdated: '2026-06-09T07:30:00Z',
        os: 'Cisco IOS XE 17.9',
        role: 'Network Routing',
      },
    },
  },
  {
    data: {
      id: 'switch-group',
      label: 'Core Switch Layer',
      displayLabel: 'Core Switch Layer\n14 switches',
      type: NODE_TYPES.SWITCH_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'Distribution and access layer switches across all sites',
        deviceCount: 14,
        status: 'healthy',
        ip: '10.0.2.0/24',
        region: 'Global',
        lastUpdated: '2026-06-09T07:35:00Z',
        os: 'Cisco NX-OS / IOS',
        role: 'Layer-2 Switching',
      },
    },
  },
  {
    data: {
      id: 'server-group',
      label: 'Server Network',
      displayLabel: 'Server Network\n27 servers',
      type: NODE_TYPES.SERVER_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'All server infrastructure: web, app, DB, AD, mail, file, monitoring, backup',
        deviceCount: 27,
        status: 'healthy',
        ip: '10.1.0.0/20',
        region: 'Primary DC',
        lastUpdated: '2026-06-09T08:10:00Z',
        os: 'Linux / Windows Server',
        role: 'Application Hosting',
      },
    },
  },
  {
    data: {
      id: 'laptop-group',
      label: 'Laptop Network',
      displayLabel: 'Laptop Network\n312 devices',
      type: NODE_TYPES.LAPTOP_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'Enterprise laptops across 6 global regions',
        deviceCount: 312,
        status: 'healthy',
        ip: '10.10.0.0/16',
        region: 'Multi-Region',
        lastUpdated: '2026-06-09T06:00:00Z',
        os: 'macOS 15 / Windows 11',
        role: 'End User Device',
      },
    },
  },
  {
    data: {
      id: 'desktop-group',
      label: 'Desktop Network',
      displayLabel: 'Desktop Network\n148 devices',
      type: NODE_TYPES.DESKTOP_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'Fixed workstations across 4 global regions',
        deviceCount: 148,
        status: 'healthy',
        ip: '10.20.0.0/16',
        region: 'Multi-Region',
        lastUpdated: '2026-06-09T06:00:00Z',
        os: 'Windows 11 Pro',
        role: 'End User Device',
      },
    },
  },
  {
    data: {
      id: 'mobile-group',
      label: 'Mobile Network',
      displayLabel: 'Mobile Network\n287 devices',
      type: NODE_TYPES.MOBILE_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'iOS and Android managed mobile devices (MDM enrolled)',
        deviceCount: 287,
        status: 'healthy',
        ip: '10.30.0.0/16',
        region: 'Multi-Region',
        lastUpdated: '2026-06-09T06:30:00Z',
        os: 'iOS 17 / Android 14',
        role: 'Mobile Device',
      },
    },
  },
  {
    data: {
      id: 'guest-group',
      label: 'Guest Network',
      displayLabel: 'Guest Network\n24 active',
      type: NODE_TYPES.GUEST_GROUP,
      isGroup: true,
      level: NODE_LEVELS.TOP_GROUP,
      meta: {
        description: 'Isolated guest WiFi VLAN — no internal access',
        deviceCount: 24,
        status: 'healthy',
        ip: '10.40.0.0/16',
        region: 'Multi-Site',
        lastUpdated: '2026-06-09T07:00:00Z',
        os: 'N/A',
        role: 'Guest Isolation',
      },
    },
  },
];

// ─── Backbone edges ──────────────────────────────────────────────────────────

export const BACKBONE_EDGES = [
  { data: { id: 'e-cloud-vpn',      source: 'cloud',          target: 'vpn-gateway',   edgeType: 'backbone', bandwidth: '10 Gbps', protocol: 'BGP / IPSec' } },
  { data: { id: 'e-vpn-fw',         source: 'vpn-gateway',    target: 'firewall-group',edgeType: 'backbone', bandwidth: '10 Gbps', protocol: 'IPSec' } },
  { data: { id: 'e-fw-router',      source: 'firewall-group', target: 'router-group',  edgeType: 'backbone', bandwidth: '10 Gbps', protocol: 'OSPF' } },
  { data: { id: 'e-router-switch',  source: 'router-group',   target: 'switch-group',  edgeType: 'backbone', bandwidth: '10 Gbps', protocol: 'OSPF' } },
  { data: { id: 'e-switch-server',  source: 'switch-group',   target: 'server-group',  edgeType: 'backbone', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
  { data: { id: 'e-switch-laptop',  source: 'switch-group',   target: 'laptop-group',  edgeType: 'backbone', bandwidth: '1 Gbps',  protocol: 'Ethernet / Wi-Fi 6' } },
  { data: { id: 'e-switch-desktop', source: 'switch-group',   target: 'desktop-group', edgeType: 'backbone', bandwidth: '1 Gbps',  protocol: 'Ethernet' } },
  { data: { id: 'e-switch-mobile',  source: 'switch-group',   target: 'mobile-group',  edgeType: 'backbone', bandwidth: '600 Mbps',protocol: 'Wi-Fi 6' } },
  { data: { id: 'e-switch-guest',   source: 'switch-group',   target: 'guest-group',   edgeType: 'backbone', bandwidth: '100 Mbps',protocol: 'Wi-Fi 6 (isolated)' } },
];

export const PHASE1_ELEMENTS = [...TOP_LEVEL_NODES, ...BACKBONE_EDGES];

// ─── Level 1 — expansion map ─────────────────────────────────────────────────

export const EXPANSION_MAP = {

  cloud: {
    nodes: [
      { data: { id: 'aws',         label: 'AWS',           displayLabel: 'AWS\nus-east-1', type: NODE_TYPES.CLOUD_PROVIDER, parentGroup: 'cloud', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Amazon Web Services — primary cloud', deviceCount: 0, status: 'healthy', ip: '52.0.0.0/8',  region: 'US East',  lastUpdated: '2026-06-09T08:00:00Z', os: 'AWS Platform', role: 'Cloud IaaS' } } },
      { data: { id: 'azure',       label: 'Azure',         displayLabel: 'Azure\nnortheurope', type: NODE_TYPES.CLOUD_PROVIDER, parentGroup: 'cloud', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Microsoft Azure — DR / hybrid', deviceCount: 0, status: 'healthy', ip: '40.0.0.0/8',  region: 'EU North', lastUpdated: '2026-06-09T08:00:00Z', os: 'Azure Platform', role: 'Cloud IaaS' } } },
      { data: { id: 'internet-gw', label: 'Internet',      displayLabel: 'Internet\nPublic WAN', type: NODE_TYPES.CLOUD_PROVIDER, parentGroup: 'cloud', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Public internet uplink via ISP', deviceCount: 0, status: 'healthy', ip: '0.0.0.0/0',   region: 'Global',   lastUpdated: '2026-06-09T08:00:00Z', os: 'N/A', role: 'Internet Uplink' } } },
    ],
    edges: [
      { data: { id: 'e-cloud-aws',     source: 'cloud', target: 'aws',         edgeType: 'internal', bandwidth: '10 Gbps',  protocol: 'AWS Direct Connect' } },
      { data: { id: 'e-cloud-azure',   source: 'cloud', target: 'azure',       edgeType: 'internal', bandwidth: '10 Gbps',  protocol: 'Azure ExpressRoute' } },
      { data: { id: 'e-cloud-inet',    source: 'cloud', target: 'internet-gw', edgeType: 'internal', bandwidth: '1 Gbps',   protocol: 'BGP' } },
    ],
  },

  'vpn-gateway': {
    nodes: [
      { data: { id: 'vpn-gw-01', label: 'VPN-GW-01', displayLabel: 'VPN-GW-01\nPrimary', type: NODE_TYPES.VPN_SUBGROUP, parentGroup: 'vpn-gateway', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Primary VPN gateway (active)', deviceCount: 1, status: 'healthy', ip: '172.16.0.1/24', region: 'HQ', lastUpdated: '2026-06-09T07:50:00Z', os: 'PAN-OS 11.1.2', role: 'Primary VPN GW' } } },
      { data: { id: 'vpn-gw-02', label: 'VPN-GW-02', displayLabel: 'VPN-GW-02\nStandby', type: NODE_TYPES.VPN_SUBGROUP, parentGroup: 'vpn-gateway', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'HA standby VPN gateway', deviceCount: 1, status: 'healthy', ip: '172.16.0.2/24', region: 'HQ', lastUpdated: '2026-06-09T07:48:00Z', os: 'PAN-OS 11.1.2', role: 'Standby VPN GW' } } },
    ],
    edges: [
      { data: { id: 'e-vpn-gw1', source: 'vpn-gateway', target: 'vpn-gw-01', edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'HSRP' } },
      { data: { id: 'e-vpn-gw2', source: 'vpn-gateway', target: 'vpn-gw-02', edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'HSRP' } },
    ],
  },

  'firewall-group': {
    nodes: [
      { data: { id: 'fw-perimeter', label: 'Perimeter FW',     displayLabel: 'Perimeter FW\nInternet edge', type: NODE_TYPES.FIREWALL_SUBGROUP, parentGroup: 'firewall-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Perimeter firewall — internet-facing', deviceCount: 2, status: 'healthy', ip: '10.0.0.0/28', region: 'HQ', lastUpdated: '2026-06-09T07:45:00Z', os: 'Cisco ASA 9.20', role: 'Perimeter Security' } } },
      { data: { id: 'fw-internal',  label: 'Internal FW',      displayLabel: 'Internal FW\nEast-West', type: NODE_TYPES.FIREWALL_SUBGROUP, parentGroup: 'firewall-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Internal segmentation firewall', deviceCount: 2, status: 'healthy', ip: '10.0.0.16/28', region: 'HQ', lastUpdated: '2026-06-09T07:43:00Z', os: 'Palo Alto PAN-OS 11.1', role: 'Internal Segmentation' } } },
      { data: { id: 'fw-dmz',       label: 'DMZ Firewall',     displayLabel: 'DMZ Firewall\nServer zone', type: NODE_TYPES.FIREWALL_SUBGROUP, parentGroup: 'firewall-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'DMZ firewall protecting server VLAN', deviceCount: 2, status: 'healthy', ip: '10.0.0.32/28', region: 'HQ', lastUpdated: '2026-06-09T07:41:00Z', os: 'Palo Alto PAN-OS 11.1', role: 'DMZ Protection' } } },
    ],
    edges: [
      { data: { id: 'e-fg-perim',    source: 'firewall-group', target: 'fw-perimeter', edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'OSPF' } },
      { data: { id: 'e-fg-internal', source: 'firewall-group', target: 'fw-internal',  edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'OSPF' } },
      { data: { id: 'e-fg-dmz',      source: 'firewall-group', target: 'fw-dmz',       edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'OSPF' } },
    ],
  },

  'router-group': {
    nodes: [
      { data: { id: 'core-routers',     label: 'Core Routers',     displayLabel: 'Core Routers\n2 devices',    type: NODE_TYPES.ROUTER_SUBGROUP, parentGroup: 'router-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Redundant core routing pair (HSRP)', deviceCount: 2, status: 'healthy', ip: '10.0.1.0/29', region: 'HQ',           lastUpdated: '2026-06-09T07:30:00Z', os: 'Cisco IOS XE 17.9.3', role: 'Core Routing' } } },
      { data: { id: 'branch-routers-na',label: 'Branch NA',        displayLabel: 'Branch NA\n3 sites',        type: NODE_TYPES.ROUTER_SUBGROUP, parentGroup: 'router-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'North America branch office routers', deviceCount: 3, status: 'healthy', ip: '10.0.1.16/29', region: 'North America', lastUpdated: '2026-06-09T07:25:00Z', os: 'Cisco IOS XE 17.6', role: 'Branch Routing' } } },
      { data: { id: 'branch-routers-eu',label: 'Branch EU',        displayLabel: 'Branch EU\n2 sites',        type: NODE_TYPES.ROUTER_SUBGROUP, parentGroup: 'router-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Europe branch office routers', deviceCount: 2, status: 'healthy', ip: '10.0.1.32/29', region: 'Europe',        lastUpdated: '2026-06-09T07:22:00Z', os: 'Cisco IOS XE 17.6', role: 'Branch Routing' } } },
    ],
    edges: [
      { data: { id: 'e-rg-core',   source: 'router-group', target: 'core-routers',      edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'OSPF' } },
      { data: { id: 'e-rg-bna',    source: 'router-group', target: 'branch-routers-na', edgeType: 'internal', bandwidth: '1 Gbps',  protocol: 'OSPF' } },
      { data: { id: 'e-rg-beu',    source: 'router-group', target: 'branch-routers-eu', edgeType: 'internal', bandwidth: '1 Gbps',  protocol: 'OSPF' } },
    ],
  },

  'switch-group': {
    nodes: [
      { data: { id: 'distribution-sw',   label: 'Distribution',   displayLabel: 'Distribution\n4 switches',  type: NODE_TYPES.SWITCH_SUBGROUP, parentGroup: 'switch-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Distribution layer switches (HQ)', deviceCount: 4, status: 'healthy', ip: '10.0.2.0/28',  region: 'HQ',           lastUpdated: '2026-06-09T07:35:00Z', os: 'Cisco NX-OS 10.2', role: 'Distribution Layer' } } },
      { data: { id: 'access-sw-hq',      label: 'Access HQ',      displayLabel: 'Access HQ\n5 switches',    type: NODE_TYPES.SWITCH_SUBGROUP, parentGroup: 'switch-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'HQ floor access switches', deviceCount: 5, status: 'healthy', ip: '10.0.2.16/28', region: 'HQ',           lastUpdated: '2026-06-09T07:40:00Z', os: 'Cisco IOS 15.2',   role: 'Access Layer' } } },
      { data: { id: 'access-sw-branch',  label: 'Access Branch',  displayLabel: 'Access Branch\n5 switches', type: NODE_TYPES.SWITCH_SUBGROUP, parentGroup: 'switch-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Branch access switches (multi-site)', deviceCount: 5, status: 'warning', ip: '10.0.2.32/28', region: 'Multi-Region', lastUpdated: '2026-06-09T07:38:00Z', os: 'Cisco IOS 15.2',   role: 'Branch Access' } } },
    ],
    edges: [
      { data: { id: 'e-sg-dist',   source: 'switch-group', target: 'distribution-sw',  edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'STP' } },
      { data: { id: 'e-sg-achq',   source: 'switch-group', target: 'access-sw-hq',     edgeType: 'internal', bandwidth: '1 Gbps',  protocol: 'STP' } },
      { data: { id: 'e-sg-acbr',   source: 'switch-group', target: 'access-sw-branch', edgeType: 'internal', bandwidth: '1 Gbps',  protocol: 'STP' } },
    ],
  },

  'server-group': {
    nodes: [
      { data: { id: 'web-servers',        label: 'Web Servers',        displayLabel: 'Web Servers\n3 nodes',       type: NODE_TYPES.WEB_SERVER_GROUP,       parentGroup: 'server-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Nginx reverse proxy + web frontend', deviceCount: 3, status: 'healthy', ip: '10.1.0.0/28',   region: 'Primary DC', lastUpdated: '2026-06-09T08:05:00Z', os: 'Ubuntu 24.04', role: 'Web Tier' } } },
      { data: { id: 'app-servers',        label: 'App Servers',        displayLabel: 'App Servers\n5 nodes',       type: NODE_TYPES.APP_SERVER_GROUP,       parentGroup: 'server-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Node.js / Java application servers', deviceCount: 5, status: 'healthy', ip: '10.1.0.16/28',  region: 'Primary DC', lastUpdated: '2026-06-09T08:10:00Z', os: 'Ubuntu 24.04', role: 'Application Tier' } } },
      { data: { id: 'db-servers',         label: 'DB Servers',         displayLabel: 'DB Servers\n4 nodes',        type: NODE_TYPES.DB_SERVER_GROUP,        parentGroup: 'server-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'PostgreSQL primary + replica + cache', deviceCount: 4, status: 'healthy', ip: '10.1.0.32/28',  region: 'Primary DC', lastUpdated: '2026-06-09T08:15:00Z', os: 'RHEL 9.2', role: 'Data Tier' } } },
      { data: { id: 'ad-servers',         label: 'Active Directory',   displayLabel: 'Active Directory\n3 nodes',  type: NODE_TYPES.AD_SERVER_GROUP,        parentGroup: 'server-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Active Directory domain controllers', deviceCount: 3, status: 'healthy', ip: '10.1.0.48/28',  region: 'Primary DC', lastUpdated: '2026-06-09T07:55:00Z', os: 'Windows Server 2022', role: 'Identity' } } },
      { data: { id: 'mail-servers',       label: 'Mail Servers',       displayLabel: 'Mail Servers\n4 nodes',      type: NODE_TYPES.MAIL_SERVER_GROUP,      parentGroup: 'server-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Exchange Online hybrid + SMTP relay', deviceCount: 4, status: 'healthy', ip: '10.1.0.64/28',  region: 'Primary DC', lastUpdated: '2026-06-09T07:50:00Z', os: 'Windows Server 2022', role: 'Email' } } },
      { data: { id: 'file-servers',       label: 'File Servers',       displayLabel: 'File Servers\n3 nodes',      type: NODE_TYPES.FILE_SERVER_GROUP,      parentGroup: 'server-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'NAS / Samba / DFS file shares', deviceCount: 3, status: 'healthy', ip: '10.1.0.80/28',  region: 'Primary DC', lastUpdated: '2026-06-09T07:45:00Z', os: 'Ubuntu 22.04', role: 'Storage' } } },
      { data: { id: 'monitoring-servers', label: 'Monitoring',         displayLabel: 'Monitoring\n3 nodes',        type: NODE_TYPES.MONITORING_GROUP,       parentGroup: 'server-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Prometheus / Grafana / SIEM stack', deviceCount: 3, status: 'healthy', ip: '10.1.0.96/28',  region: 'Primary DC', lastUpdated: '2026-06-09T08:00:00Z', os: 'Ubuntu 24.04', role: 'Observability' } } },
      { data: { id: 'backup-servers',     label: 'Backup Servers',     displayLabel: 'Backup Servers\n2 nodes',    type: NODE_TYPES.BACKUP_GROUP,           parentGroup: 'server-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Veeam backup + Tape DR offload', deviceCount: 2, status: 'healthy', ip: '10.1.0.112/28', region: 'Primary DC', lastUpdated: '2026-06-09T07:40:00Z', os: 'Windows Server 2022', role: 'Data Protection' } } },
    ],
    edges: [
      { data: { id: 'e-sg-web',  source: 'server-group', target: 'web-servers',        edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-sg-app',  source: 'server-group', target: 'app-servers',        edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-sg-db',   source: 'server-group', target: 'db-servers',         edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-sg-ad',   source: 'server-group', target: 'ad-servers',         edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-sg-mail', source: 'server-group', target: 'mail-servers',       edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-sg-file', source: 'server-group', target: 'file-servers',       edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-sg-mon',  source: 'server-group', target: 'monitoring-servers', edgeType: 'internal', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-sg-bak',  source: 'server-group', target: 'backup-servers',     edgeType: 'internal', bandwidth: '1 Gbps',  protocol: 'Ethernet' } },
    ],
  },

  'laptop-group': {
    nodes: [
      { data: { id: 'lap-na',   label: 'North America', displayLabel: 'North America\n115 laptops', type: NODE_TYPES.REGION_GROUP, parentGroup: 'laptop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Laptops — NA (HQ + NY, Chicago, Austin)', deviceCount: 115, status: 'healthy', ip: '10.10.1.0/24', region: 'North America', lastUpdated: '2026-06-09T06:00:00Z', os: 'macOS 15 / Win 11', role: 'End User' } } },
      { data: { id: 'lap-eu',   label: 'Europe',        displayLabel: 'Europe\n82 laptops',         type: NODE_TYPES.REGION_GROUP, parentGroup: 'laptop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Laptops — EU (London, Amsterdam, Berlin)', deviceCount: 82,  status: 'healthy', ip: '10.10.2.0/24', region: 'Europe',        lastUpdated: '2026-06-09T06:00:00Z', os: 'macOS 15 / Win 11', role: 'End User' } } },
      { data: { id: 'lap-apac', label: 'Asia Pacific',  displayLabel: 'Asia Pacific\n58 laptops',   type: NODE_TYPES.REGION_GROUP, parentGroup: 'laptop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Laptops — APAC (Singapore, Tokyo, Sydney)', deviceCount: 58, status: 'healthy', ip: '10.10.3.0/24', region: 'Asia Pacific',  lastUpdated: '2026-06-09T00:00:00Z', os: 'macOS 15 / Win 11', role: 'End User' } } },
      { data: { id: 'lap-me',   label: 'Middle East',   displayLabel: 'Middle East\n22 laptops',    type: NODE_TYPES.REGION_GROUP, parentGroup: 'laptop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Laptops — ME (Dubai, Riyadh)', deviceCount: 22, status: 'healthy', ip: '10.10.4.0/24', region: 'Middle East',   lastUpdated: '2026-06-09T05:00:00Z', os: 'Win 11 Pro', role: 'End User' } } },
      { data: { id: 'lap-in',   label: 'India',         displayLabel: 'India\n28 laptops',          type: NODE_TYPES.REGION_GROUP, parentGroup: 'laptop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Laptops — India (Bangalore, Hyderabad)', deviceCount: 28,  status: 'healthy', ip: '10.10.5.0/24', region: 'India',         lastUpdated: '2026-06-09T02:30:00Z', os: 'Win 11 Pro', role: 'End User' } } },
      { data: { id: 'lap-sa',   label: 'South America', displayLabel: 'South America\n7 laptops',   type: NODE_TYPES.REGION_GROUP, parentGroup: 'laptop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Laptops — SA (São Paulo, Bogotá)', deviceCount: 7,   status: 'healthy', ip: '10.10.6.0/24', region: 'South America', lastUpdated: '2026-06-08T22:00:00Z', os: 'Win 11 Pro', role: 'End User' } } },
    ],
    edges: [
      { data: { id: 'e-lg-na',   source: 'laptop-group', target: 'lap-na',   edgeType: 'internal', bandwidth: '1 Gbps',   protocol: 'Ethernet / Wi-Fi 6' } },
      { data: { id: 'e-lg-eu',   source: 'laptop-group', target: 'lap-eu',   edgeType: 'internal', bandwidth: '1 Gbps',   protocol: 'Ethernet / Wi-Fi 6' } },
      { data: { id: 'e-lg-apac', source: 'laptop-group', target: 'lap-apac', edgeType: 'internal', bandwidth: '600 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lg-me',   source: 'laptop-group', target: 'lap-me',   edgeType: 'internal', bandwidth: '600 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lg-in',   source: 'laptop-group', target: 'lap-in',   edgeType: 'internal', bandwidth: '600 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lg-sa',   source: 'laptop-group', target: 'lap-sa',   edgeType: 'internal', bandwidth: '300 Mbps', protocol: 'Wi-Fi 6' } },
    ],
  },

  'desktop-group': {
    nodes: [
      { data: { id: 'desk-na',   label: 'North America', displayLabel: 'North America\n68 desktops', type: NODE_TYPES.REGION_GROUP, parentGroup: 'desktop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Desktops — NA HQ + branch offices', deviceCount: 68, status: 'healthy', ip: '10.20.1.0/24', region: 'North America', lastUpdated: '2026-06-09T06:00:00Z', os: 'Windows 11 Pro', role: 'End User' } } },
      { data: { id: 'desk-eu',   label: 'Europe',        displayLabel: 'Europe\n48 desktops',        type: NODE_TYPES.REGION_GROUP, parentGroup: 'desktop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Desktops — EU London + Amsterdam', deviceCount: 48, status: 'healthy', ip: '10.20.2.0/24', region: 'Europe',        lastUpdated: '2026-06-09T06:00:00Z', os: 'Windows 11 Pro', role: 'End User' } } },
      { data: { id: 'desk-apac', label: 'Asia Pacific',  displayLabel: 'Asia Pacific\n22 desktops',  type: NODE_TYPES.REGION_GROUP, parentGroup: 'desktop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Desktops — APAC Singapore + Tokyo', deviceCount: 22, status: 'healthy', ip: '10.20.3.0/24', region: 'Asia Pacific',  lastUpdated: '2026-06-09T00:00:00Z', os: 'Windows 11 Pro', role: 'End User' } } },
      { data: { id: 'desk-in',   label: 'India',         displayLabel: 'India\n10 desktops',         type: NODE_TYPES.REGION_GROUP, parentGroup: 'desktop-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Desktops — India Bangalore office', deviceCount: 10, status: 'healthy', ip: '10.20.4.0/24', region: 'India',         lastUpdated: '2026-06-09T02:30:00Z', os: 'Windows 11 Pro', role: 'End User' } } },
    ],
    edges: [
      { data: { id: 'e-dg-na',   source: 'desktop-group', target: 'desk-na',   edgeType: 'internal', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-dg-eu',   source: 'desktop-group', target: 'desk-eu',   edgeType: 'internal', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-dg-apac', source: 'desktop-group', target: 'desk-apac', edgeType: 'internal', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-dg-in',   source: 'desktop-group', target: 'desk-in',   edgeType: 'internal', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'mobile-group': {
    nodes: [
      { data: { id: 'mob-na',   label: 'North America', displayLabel: 'North America\n108 devices', type: NODE_TYPES.REGION_GROUP, parentGroup: 'mobile-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'MDM-enrolled iOS/Android — North America', deviceCount: 108, status: 'healthy', ip: '10.30.1.0/24', region: 'North America', lastUpdated: '2026-06-09T06:30:00Z', os: 'iOS 17 / Android 14', role: 'Mobile' } } },
      { data: { id: 'mob-eu',   label: 'Europe',        displayLabel: 'Europe\n84 devices',         type: NODE_TYPES.REGION_GROUP, parentGroup: 'mobile-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'MDM-enrolled iOS/Android — Europe', deviceCount: 84, status: 'healthy', ip: '10.30.2.0/24', region: 'Europe',        lastUpdated: '2026-06-09T06:30:00Z', os: 'iOS 17 / Android 14', role: 'Mobile' } } },
      { data: { id: 'mob-apac', label: 'Asia Pacific',  displayLabel: 'Asia Pacific\n63 devices',   type: NODE_TYPES.REGION_GROUP, parentGroup: 'mobile-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'MDM-enrolled iOS/Android — APAC', deviceCount: 63, status: 'healthy', ip: '10.30.3.0/24', region: 'Asia Pacific',  lastUpdated: '2026-06-09T00:30:00Z', os: 'iOS 17 / Android 14', role: 'Mobile' } } },
      { data: { id: 'mob-in',   label: 'India',         displayLabel: 'India\n32 devices',          type: NODE_TYPES.REGION_GROUP, parentGroup: 'mobile-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'MDM-enrolled iOS/Android — India', deviceCount: 32, status: 'healthy', ip: '10.30.4.0/24', region: 'India',         lastUpdated: '2026-06-09T02:30:00Z', os: 'iOS 17 / Android 14', role: 'Mobile' } } },
    ],
    edges: [
      { data: { id: 'e-mg-na',   source: 'mobile-group', target: 'mob-na',   edgeType: 'internal', bandwidth: '600 Mbps', protocol: 'Wi-Fi 6 / 5G' } },
      { data: { id: 'e-mg-eu',   source: 'mobile-group', target: 'mob-eu',   edgeType: 'internal', bandwidth: '600 Mbps', protocol: 'Wi-Fi 6 / 5G' } },
      { data: { id: 'e-mg-apac', source: 'mobile-group', target: 'mob-apac', edgeType: 'internal', bandwidth: '300 Mbps', protocol: 'Wi-Fi 6 / 4G' } },
      { data: { id: 'e-mg-in',   source: 'mobile-group', target: 'mob-in',   edgeType: 'internal', bandwidth: '300 Mbps', protocol: 'Wi-Fi 6 / 4G' } },
    ],
  },

  'guest-group': {
    nodes: [
      { data: { id: 'guest-hq',  label: 'HQ Guest',       displayLabel: 'HQ Guest\nVLAN 100', type: NODE_TYPES.REGION_GROUP, parentGroup: 'guest-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Guest WiFi at HQ — isolated VLAN', deviceCount: 12, status: 'healthy', ip: '10.40.0.0/24', region: 'HQ',           lastUpdated: '2026-06-09T07:00:00Z', os: 'N/A', role: 'Guest Access' } } },
      { data: { id: 'guest-na',  label: 'Branch NA Guest', displayLabel: 'Branch NA\nVLAN 100', type: NODE_TYPES.REGION_GROUP, parentGroup: 'guest-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Guest WiFi at NA branch offices', deviceCount: 8,  status: 'healthy', ip: '10.40.1.0/24', region: 'North America', lastUpdated: '2026-06-09T06:00:00Z', os: 'N/A', role: 'Guest Access' } } },
      { data: { id: 'guest-eu',  label: 'Branch EU Guest', displayLabel: 'Branch EU\nVLAN 100', type: NODE_TYPES.REGION_GROUP, parentGroup: 'guest-group', level: NODE_LEVELS.SUB_GROUP, meta: { description: 'Guest WiFi at EU branch offices', deviceCount: 4,  status: 'healthy', ip: '10.40.2.0/24', region: 'Europe',        lastUpdated: '2026-06-09T06:00:00Z', os: 'N/A', role: 'Guest Access' } } },
    ],
    edges: [
      { data: { id: 'e-gg-hq', source: 'guest-group', target: 'guest-hq', edgeType: 'internal', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6 (isolated)' } },
      { data: { id: 'e-gg-na', source: 'guest-group', target: 'guest-na', edgeType: 'internal', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6 (isolated)' } },
      { data: { id: 'e-gg-eu', source: 'guest-group', target: 'guest-eu', edgeType: 'internal', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6 (isolated)' } },
    ],
  },
};

// ─── Level 2 — device expansion map ─────────────────────────────────────────

export const DEVICE_EXPANSION_MAP = {

  'vpn-gw-01': {
    nodes: [
      { data: { id: 'vpn-pa-01', label: 'VPN-PA-01', type: NODE_TYPES.VPN_DEVICE, parentGroup: 'vpn-gw-01', level: NODE_LEVELS.DEVICE, meta: { description: 'Primary VPN gateway appliance', status: 'healthy', ip: '172.16.0.1', region: 'HQ', lastUpdated: '2026-06-09T07:50:00Z', os: 'PAN-OS 11.1.2', role: 'VPN Gateway' } } },
    ],
    edges: [
      { data: { id: 'e-vpn01-dev', source: 'vpn-gw-01', target: 'vpn-pa-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'IPSec' } },
    ],
  },

  'vpn-gw-02': {
    nodes: [
      { data: { id: 'vpn-pa-02', label: 'VPN-PA-02', type: NODE_TYPES.VPN_DEVICE, parentGroup: 'vpn-gw-02', level: NODE_LEVELS.DEVICE, meta: { description: 'HA standby VPN gateway appliance', status: 'healthy', ip: '172.16.0.2', region: 'HQ', lastUpdated: '2026-06-09T07:48:00Z', os: 'PAN-OS 11.1.2', role: 'VPN Gateway (HA)' } } },
    ],
    edges: [
      { data: { id: 'e-vpn02-dev', source: 'vpn-gw-02', target: 'vpn-pa-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'HSRP' } },
    ],
  },

  'fw-perimeter': {
    nodes: [
      { data: { id: 'fw-perim-01', label: 'FW-PERIM-01', type: NODE_TYPES.FIREWALL, parentGroup: 'fw-perimeter', level: NODE_LEVELS.DEVICE, meta: { description: 'Primary perimeter firewall (active)', status: 'healthy', ip: '10.0.0.1', region: 'HQ', lastUpdated: '2026-06-09T07:45:00Z', os: 'Cisco ASA 9.20.1', role: 'Perimeter FW' } } },
      { data: { id: 'fw-perim-02', label: 'FW-PERIM-02', type: NODE_TYPES.FIREWALL, parentGroup: 'fw-perimeter', level: NODE_LEVELS.DEVICE, meta: { description: 'Secondary perimeter firewall (standby)', status: 'healthy', ip: '10.0.0.2', region: 'HQ', lastUpdated: '2026-06-09T07:43:00Z', os: 'Cisco ASA 9.20.1', role: 'Perimeter FW (HA)' } } },
    ],
    edges: [
      { data: { id: 'e-fp-01', source: 'fw-perimeter', target: 'fw-perim-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-fp-02', source: 'fw-perimeter', target: 'fw-perim-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'fw-internal': {
    nodes: [
      { data: { id: 'fw-int-01', label: 'FW-INT-01', type: NODE_TYPES.FIREWALL, parentGroup: 'fw-internal', level: NODE_LEVELS.DEVICE, meta: { description: 'Internal east-west segmentation FW', status: 'healthy', ip: '10.0.0.17', region: 'HQ', lastUpdated: '2026-06-09T07:43:00Z', os: 'PAN-OS 11.1.2', role: 'Internal FW' } } },
      { data: { id: 'fw-int-02', label: 'FW-INT-02', type: NODE_TYPES.FIREWALL, parentGroup: 'fw-internal', level: NODE_LEVELS.DEVICE, meta: { description: 'Internal east-west FW (HA pair)', status: 'healthy', ip: '10.0.0.18', region: 'HQ', lastUpdated: '2026-06-09T07:41:00Z', os: 'PAN-OS 11.1.2', role: 'Internal FW (HA)' } } },
    ],
    edges: [
      { data: { id: 'e-fi-01', source: 'fw-internal', target: 'fw-int-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-fi-02', source: 'fw-internal', target: 'fw-int-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'fw-dmz': {
    nodes: [
      { data: { id: 'fw-dmz-01', label: 'FW-DMZ-01', type: NODE_TYPES.FIREWALL, parentGroup: 'fw-dmz', level: NODE_LEVELS.DEVICE, meta: { description: 'Primary DMZ firewall', status: 'healthy', ip: '10.0.0.33', region: 'HQ', lastUpdated: '2026-06-09T07:41:00Z', os: 'PAN-OS 11.1.2', role: 'DMZ FW' } } },
      { data: { id: 'fw-dmz-02', label: 'FW-DMZ-02', type: NODE_TYPES.FIREWALL, parentGroup: 'fw-dmz', level: NODE_LEVELS.DEVICE, meta: { description: 'Secondary DMZ firewall (HA)', status: 'healthy', ip: '10.0.0.34', region: 'HQ', lastUpdated: '2026-06-09T07:39:00Z', os: 'PAN-OS 11.1.2', role: 'DMZ FW (HA)' } } },
    ],
    edges: [
      { data: { id: 'e-fd-01', source: 'fw-dmz', target: 'fw-dmz-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-fd-02', source: 'fw-dmz', target: 'fw-dmz-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'core-routers': {
    nodes: [
      { data: { id: 'rtr-core-01', label: 'RTR-CORE-01', type: NODE_TYPES.ROUTER, parentGroup: 'core-routers', level: NODE_LEVELS.DEVICE, meta: { description: 'Primary core router (active)', status: 'healthy', ip: '10.0.1.1', region: 'HQ', lastUpdated: '2026-06-09T07:30:00Z', os: 'Cisco IOS XE 17.9.3', role: 'Core Router' } } },
      { data: { id: 'rtr-core-02', label: 'RTR-CORE-02', type: NODE_TYPES.ROUTER, parentGroup: 'core-routers', level: NODE_LEVELS.DEVICE, meta: { description: 'Secondary core router (HSRP standby)', status: 'healthy', ip: '10.0.1.2', region: 'HQ', lastUpdated: '2026-06-09T07:28:00Z', os: 'Cisco IOS XE 17.9.3', role: 'Core Router (HA)' } } },
    ],
    edges: [
      { data: { id: 'e-rc-01', source: 'core-routers', target: 'rtr-core-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-rc-02', source: 'core-routers', target: 'rtr-core-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'branch-routers-na': {
    nodes: [
      { data: { id: 'rtr-br-ny',  label: 'RTR-BR-NY',  type: NODE_TYPES.ROUTER, parentGroup: 'branch-routers-na', level: NODE_LEVELS.DEVICE, meta: { description: 'New York branch router', status: 'healthy', ip: '10.0.1.17', region: 'North America', lastUpdated: '2026-06-09T07:25:00Z', os: 'Cisco IOS XE 17.6.5', role: 'Branch Router' } } },
      { data: { id: 'rtr-br-chi', label: 'RTR-BR-CHI', type: NODE_TYPES.ROUTER, parentGroup: 'branch-routers-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Chicago branch router', status: 'healthy', ip: '10.0.1.18', region: 'North America', lastUpdated: '2026-06-09T07:23:00Z', os: 'Cisco IOS XE 17.6.5', role: 'Branch Router' } } },
      { data: { id: 'rtr-br-aus', label: 'RTR-BR-AUS', type: NODE_TYPES.ROUTER, parentGroup: 'branch-routers-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Austin branch router', status: 'healthy', ip: '10.0.1.19', region: 'North America', lastUpdated: '2026-06-09T07:21:00Z', os: 'Cisco IOS XE 17.6.5', role: 'Branch Router' } } },
    ],
    edges: [
      { data: { id: 'e-brna-ny',  source: 'branch-routers-na', target: 'rtr-br-ny',  edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-brna-chi', source: 'branch-routers-na', target: 'rtr-br-chi', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-brna-aus', source: 'branch-routers-na', target: 'rtr-br-aus', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'branch-routers-eu': {
    nodes: [
      { data: { id: 'rtr-br-lon', label: 'RTR-BR-LON', type: NODE_TYPES.ROUTER, parentGroup: 'branch-routers-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'London branch router', status: 'healthy', ip: '10.0.1.33', region: 'Europe', lastUpdated: '2026-06-09T07:22:00Z', os: 'Cisco IOS XE 17.6.4', role: 'Branch Router' } } },
      { data: { id: 'rtr-br-ams', label: 'RTR-BR-AMS', type: NODE_TYPES.ROUTER, parentGroup: 'branch-routers-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'Amsterdam branch router', status: 'healthy', ip: '10.0.1.34', region: 'Europe', lastUpdated: '2026-06-09T07:20:00Z', os: 'Cisco IOS XE 17.6.4', role: 'Branch Router' } } },
    ],
    edges: [
      { data: { id: 'e-breu-lon', source: 'branch-routers-eu', target: 'rtr-br-lon', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-breu-ams', source: 'branch-routers-eu', target: 'rtr-br-ams', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'distribution-sw': {
    nodes: [
      { data: { id: 'sw-dist-01', label: 'SW-DIST-01', type: NODE_TYPES.SWITCH, parentGroup: 'distribution-sw', level: NODE_LEVELS.DEVICE, meta: { description: 'Distribution switch A (active)', status: 'healthy', ip: '10.0.2.1', region: 'HQ', lastUpdated: '2026-06-09T07:35:00Z', os: 'Cisco NX-OS 10.2.1', role: 'Distribution Switch' } } },
      { data: { id: 'sw-dist-02', label: 'SW-DIST-02', type: NODE_TYPES.SWITCH, parentGroup: 'distribution-sw', level: NODE_LEVELS.DEVICE, meta: { description: 'Distribution switch B (active)', status: 'healthy', ip: '10.0.2.2', region: 'HQ', lastUpdated: '2026-06-09T07:33:00Z', os: 'Cisco NX-OS 10.2.1', role: 'Distribution Switch' } } },
      { data: { id: 'sw-dist-03', label: 'SW-DIST-03', type: NODE_TYPES.SWITCH, parentGroup: 'distribution-sw', level: NODE_LEVELS.DEVICE, meta: { description: 'Server VLAN distribution switch', status: 'healthy', ip: '10.0.2.3', region: 'HQ', lastUpdated: '2026-06-09T07:31:00Z', os: 'Cisco NX-OS 10.1.4', role: 'Server Distribution' } } },
      { data: { id: 'sw-dist-04', label: 'SW-DIST-04', type: NODE_TYPES.SWITCH, parentGroup: 'distribution-sw', level: NODE_LEVELS.DEVICE, meta: { description: 'Voice and UC distribution switch', status: 'healthy', ip: '10.0.2.4', region: 'HQ', lastUpdated: '2026-06-09T07:29:00Z', os: 'Cisco NX-OS 10.1.4', role: 'UC Distribution' } } },
    ],
    edges: [
      { data: { id: 'e-ds-01', source: 'distribution-sw', target: 'sw-dist-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ds-02', source: 'distribution-sw', target: 'sw-dist-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ds-03', source: 'distribution-sw', target: 'sw-dist-03', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ds-04', source: 'distribution-sw', target: 'sw-dist-04', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'access-sw-hq': {
    nodes: [
      { data: { id: 'sw-acc-f1', label: 'SW-ACC-F1', type: NODE_TYPES.SWITCH, parentGroup: 'access-sw-hq', level: NODE_LEVELS.DEVICE, meta: { description: 'Floor 1 access switch (HQ)', status: 'healthy', ip: '10.0.2.17', region: 'HQ', lastUpdated: '2026-06-09T07:40:00Z', os: 'Cisco IOS 15.2.7', role: 'Access Switch' } } },
      { data: { id: 'sw-acc-f2', label: 'SW-ACC-F2', type: NODE_TYPES.SWITCH, parentGroup: 'access-sw-hq', level: NODE_LEVELS.DEVICE, meta: { description: 'Floor 2 access switch (HQ)', status: 'healthy', ip: '10.0.2.18', region: 'HQ', lastUpdated: '2026-06-09T07:38:00Z', os: 'Cisco IOS 15.2.7', role: 'Access Switch' } } },
      { data: { id: 'sw-acc-f3', label: 'SW-ACC-F3', type: NODE_TYPES.SWITCH, parentGroup: 'access-sw-hq', level: NODE_LEVELS.DEVICE, meta: { description: 'Floor 3 access switch (HQ)', status: 'healthy', ip: '10.0.2.19', region: 'HQ', lastUpdated: '2026-06-09T07:36:00Z', os: 'Cisco IOS 15.2.7', role: 'Access Switch' } } },
      { data: { id: 'sw-acc-f4', label: 'SW-ACC-F4', type: NODE_TYPES.SWITCH, parentGroup: 'access-sw-hq', level: NODE_LEVELS.DEVICE, meta: { description: 'Floor 4 / Datacenter access', status: 'healthy', ip: '10.0.2.20', region: 'HQ', lastUpdated: '2026-06-09T07:34:00Z', os: 'Cisco IOS 15.2.7', role: 'DC Access Switch' } } },
      { data: { id: 'sw-acc-wh', label: 'SW-ACC-WH',  type: NODE_TYPES.SWITCH, parentGroup: 'access-sw-hq', level: NODE_LEVELS.DEVICE, meta: { description: 'Warehouse / loading dock access switch', status: 'healthy', ip: '10.0.2.21', region: 'HQ', lastUpdated: '2026-06-09T07:32:00Z', os: 'Cisco IOS 15.2.5', role: 'Warehouse Access' } } },
    ],
    edges: [
      { data: { id: 'e-ahq-f1', source: 'access-sw-hq', target: 'sw-acc-f1', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ahq-f2', source: 'access-sw-hq', target: 'sw-acc-f2', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ahq-f3', source: 'access-sw-hq', target: 'sw-acc-f3', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ahq-f4', source: 'access-sw-hq', target: 'sw-acc-f4', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ahq-wh', source: 'access-sw-hq', target: 'sw-acc-wh', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'access-sw-branch': {
    nodes: [
      { data: { id: 'sw-br-ny',  label: 'SW-BR-NY',  type: NODE_TYPES.SWITCH, parentGroup: 'access-sw-branch', level: NODE_LEVELS.DEVICE, meta: { description: 'New York branch access switch', status: 'healthy', ip: '10.0.2.33', region: 'North America', lastUpdated: '2026-06-09T07:40:00Z', os: 'Cisco IOS 15.2.7', role: 'Branch Access' } } },
      { data: { id: 'sw-br-lon', label: 'SW-BR-LON', type: NODE_TYPES.SWITCH, parentGroup: 'access-sw-branch', level: NODE_LEVELS.DEVICE, meta: { description: 'London branch access switch', status: 'healthy', ip: '10.0.2.34', region: 'Europe',        lastUpdated: '2026-06-09T07:38:00Z', os: 'Cisco IOS 15.2.7', role: 'Branch Access' } } },
      { data: { id: 'sw-br-sgp', label: 'SW-BR-SGP', type: NODE_TYPES.SWITCH, parentGroup: 'access-sw-branch', level: NODE_LEVELS.DEVICE, meta: { description: 'Singapore office access switch', status: 'warning', ip: '10.0.2.35', region: 'Asia Pacific',  lastUpdated: '2026-06-09T01:00:00Z', os: 'Cisco IOS 15.2.5', role: 'Branch Access' } } },
      { data: { id: 'sw-br-ams', label: 'SW-BR-AMS', type: NODE_TYPES.SWITCH, parentGroup: 'access-sw-branch', level: NODE_LEVELS.DEVICE, meta: { description: 'Amsterdam branch access switch', status: 'healthy', ip: '10.0.2.36', region: 'Europe',        lastUpdated: '2026-06-09T07:35:00Z', os: 'Cisco IOS 15.2.7', role: 'Branch Access' } } },
      { data: { id: 'sw-br-blr', label: 'SW-BR-BLR', type: NODE_TYPES.SWITCH, parentGroup: 'access-sw-branch', level: NODE_LEVELS.DEVICE, meta: { description: 'Bangalore office access switch', status: 'healthy', ip: '10.0.2.37', region: 'India',         lastUpdated: '2026-06-09T02:30:00Z', os: 'Cisco IOS 15.2.7', role: 'Branch Access' } } },
    ],
    edges: [
      { data: { id: 'e-abr-ny',  source: 'access-sw-branch', target: 'sw-br-ny',  edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-abr-lon', source: 'access-sw-branch', target: 'sw-br-lon', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-abr-sgp', source: 'access-sw-branch', target: 'sw-br-sgp', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-abr-ams', source: 'access-sw-branch', target: 'sw-br-ams', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-abr-blr', source: 'access-sw-branch', target: 'sw-br-blr', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'web-servers': {
    nodes: [
      { data: { id: 'web-01', label: 'WEB-01', type: NODE_TYPES.WEB_SERVER, parentGroup: 'web-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Primary Nginx reverse proxy', status: 'healthy', ip: '10.1.0.1', region: 'Primary DC', lastUpdated: '2026-06-09T08:05:00Z', os: 'Ubuntu 24.04 LTS', role: 'Web Server' } } },
      { data: { id: 'web-02', label: 'WEB-02', type: NODE_TYPES.WEB_SERVER, parentGroup: 'web-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Secondary Nginx reverse proxy', status: 'healthy', ip: '10.1.0.2', region: 'Primary DC', lastUpdated: '2026-06-09T08:03:00Z', os: 'Ubuntu 24.04 LTS', role: 'Web Server' } } },
      { data: { id: 'web-03', label: 'WEB-03', type: NODE_TYPES.WEB_SERVER, parentGroup: 'web-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'CDN origin / static assets', status: 'healthy', ip: '10.1.0.3', region: 'Primary DC', lastUpdated: '2026-06-09T08:01:00Z', os: 'Ubuntu 22.04 LTS', role: 'CDN Origin' } } },
    ],
    edges: [
      { data: { id: 'e-ws-01', source: 'web-servers', target: 'web-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ws-02', source: 'web-servers', target: 'web-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ws-03', source: 'web-servers', target: 'web-03', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'app-servers': {
    nodes: [
      { data: { id: 'app-01', label: 'APP-01', type: NODE_TYPES.APP_SERVER, parentGroup: 'app-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'API Gateway (Kong)', status: 'healthy', ip: '10.1.0.17', region: 'Primary DC', lastUpdated: '2026-06-09T08:10:00Z', os: 'Ubuntu 24.04 LTS', role: 'API Gateway' } } },
      { data: { id: 'app-02', label: 'APP-02', type: NODE_TYPES.APP_SERVER, parentGroup: 'app-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Business logic tier (Java Spring)', status: 'healthy', ip: '10.1.0.18', region: 'Primary DC', lastUpdated: '2026-06-09T08:08:00Z', os: 'Ubuntu 24.04 LTS', role: 'App Server' } } },
      { data: { id: 'app-03', label: 'APP-03', type: NODE_TYPES.APP_SERVER, parentGroup: 'app-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Background jobs (Node.js workers)', status: 'healthy', ip: '10.1.0.19', region: 'Primary DC', lastUpdated: '2026-06-09T08:06:00Z', os: 'Ubuntu 24.04 LTS', role: 'Job Processor' } } },
      { data: { id: 'app-04', label: 'APP-04', type: NODE_TYPES.APP_SERVER, parentGroup: 'app-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Auth / Identity server (Keycloak)', status: 'healthy', ip: '10.1.0.20', region: 'Primary DC', lastUpdated: '2026-06-09T08:04:00Z', os: 'RHEL 9.2', role: 'Auth Server' } } },
      { data: { id: 'app-05', label: 'APP-05', type: NODE_TYPES.APP_SERVER, parentGroup: 'app-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Reporting and analytics service', status: 'healthy', ip: '10.1.0.21', region: 'Primary DC', lastUpdated: '2026-06-09T08:02:00Z', os: 'Ubuntu 22.04 LTS', role: 'Analytics Server' } } },
    ],
    edges: [
      { data: { id: 'e-ap-01', source: 'app-servers', target: 'app-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ap-02', source: 'app-servers', target: 'app-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ap-03', source: 'app-servers', target: 'app-03', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ap-04', source: 'app-servers', target: 'app-04', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ap-05', source: 'app-servers', target: 'app-05', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'db-servers': {
    nodes: [
      { data: { id: 'db-01', label: 'DB-01', type: NODE_TYPES.DB_SERVER, parentGroup: 'db-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'PostgreSQL primary (write master)', status: 'healthy', ip: '10.1.0.33', region: 'Primary DC', lastUpdated: '2026-06-09T08:15:00Z', os: 'RHEL 9.2', role: 'Primary DB' } } },
      { data: { id: 'db-02', label: 'DB-02', type: NODE_TYPES.DB_SERVER, parentGroup: 'db-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'PostgreSQL replica 1 (read)', status: 'healthy', ip: '10.1.0.34', region: 'Primary DC', lastUpdated: '2026-06-09T08:13:00Z', os: 'RHEL 9.2', role: 'Replica DB' } } },
      { data: { id: 'db-03', label: 'DB-03', type: NODE_TYPES.DB_SERVER, parentGroup: 'db-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Redis cache cluster node', status: 'healthy', ip: '10.1.0.35', region: 'Primary DC', lastUpdated: '2026-06-09T08:11:00Z', os: 'Ubuntu 22.04 LTS', role: 'Cache (Redis)' } } },
      { data: { id: 'db-04', label: 'DB-04', type: NODE_TYPES.DB_SERVER, parentGroup: 'db-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'DR replica (async replication)', status: 'healthy', ip: '10.1.0.36', region: 'Primary DC', lastUpdated: '2026-06-09T08:09:00Z', os: 'RHEL 9.2', role: 'DR Replica DB' } } },
    ],
    edges: [
      { data: { id: 'e-db-01', source: 'db-servers', target: 'db-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-db-02', source: 'db-servers', target: 'db-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-db-03', source: 'db-servers', target: 'db-03', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-db-04', source: 'db-servers', target: 'db-04', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'ad-servers': {
    nodes: [
      { data: { id: 'ad-dc-01', label: 'AD-DC-01', type: NODE_TYPES.AD_SERVER, parentGroup: 'ad-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Primary domain controller (PDC Emulator)', status: 'healthy', ip: '10.1.0.49', region: 'Primary DC', lastUpdated: '2026-06-09T07:55:00Z', os: 'Windows Server 2022 DC', role: 'Primary DC' } } },
      { data: { id: 'ad-dc-02', label: 'AD-DC-02', type: NODE_TYPES.AD_SERVER, parentGroup: 'ad-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Secondary domain controller', status: 'healthy', ip: '10.1.0.50', region: 'Primary DC', lastUpdated: '2026-06-09T07:53:00Z', os: 'Windows Server 2022 DC', role: 'Secondary DC' } } },
      { data: { id: 'ad-rodc-01', label: 'AD-RODC-01', type: NODE_TYPES.AD_SERVER, parentGroup: 'ad-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Read-only DC (branch failover)', status: 'healthy', ip: '10.1.0.51', region: 'Primary DC', lastUpdated: '2026-06-09T07:51:00Z', os: 'Windows Server 2022 DC', role: 'Read-Only DC' } } },
    ],
    edges: [
      { data: { id: 'e-ad-01', source: 'ad-servers', target: 'ad-dc-01',  edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ad-02', source: 'ad-servers', target: 'ad-dc-02',  edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ad-03', source: 'ad-servers', target: 'ad-rodc-01',edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'mail-servers': {
    nodes: [
      { data: { id: 'mail-exch-01', label: 'MAIL-EXCH-01', type: NODE_TYPES.MAIL_SERVER, parentGroup: 'mail-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Exchange hybrid server (primary)', status: 'healthy', ip: '10.1.0.65', region: 'Primary DC', lastUpdated: '2026-06-09T07:50:00Z', os: 'Windows Server 2022', role: 'Exchange Server' } } },
      { data: { id: 'mail-exch-02', label: 'MAIL-EXCH-02', type: NODE_TYPES.MAIL_SERVER, parentGroup: 'mail-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Exchange hybrid server (secondary)', status: 'healthy', ip: '10.1.0.66', region: 'Primary DC', lastUpdated: '2026-06-09T07:48:00Z', os: 'Windows Server 2022', role: 'Exchange Server' } } },
      { data: { id: 'mail-relay-01', label: 'MAIL-RELAY-01', type: NODE_TYPES.MAIL_SERVER, parentGroup: 'mail-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'SMTP relay / spam filter', status: 'healthy', ip: '10.1.0.67', region: 'Primary DC', lastUpdated: '2026-06-09T07:46:00Z', os: 'Ubuntu 22.04 LTS', role: 'SMTP Relay' } } },
      { data: { id: 'mail-relay-02', label: 'MAIL-RELAY-02', type: NODE_TYPES.MAIL_SERVER, parentGroup: 'mail-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Outbound SMTP relay (secondary)', status: 'healthy', ip: '10.1.0.68', region: 'Primary DC', lastUpdated: '2026-06-09T07:44:00Z', os: 'Ubuntu 22.04 LTS', role: 'SMTP Relay' } } },
    ],
    edges: [
      { data: { id: 'e-ml-01', source: 'mail-servers', target: 'mail-exch-01',  edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ml-02', source: 'mail-servers', target: 'mail-exch-02',  edgeType: 'device', bandwidth: '10 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-ml-03', source: 'mail-servers', target: 'mail-relay-01', edgeType: 'device', bandwidth: '1 Gbps',  protocol: 'Ethernet' } },
      { data: { id: 'e-ml-04', source: 'mail-servers', target: 'mail-relay-02', edgeType: 'device', bandwidth: '1 Gbps',  protocol: 'Ethernet' } },
    ],
  },

  'file-servers': {
    nodes: [
      { data: { id: 'file-nas-01', label: 'FILE-NAS-01', type: NODE_TYPES.FILE_SERVER, parentGroup: 'file-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Primary NAS (NetApp, Samba shares)', status: 'healthy', ip: '10.1.0.81', region: 'Primary DC', lastUpdated: '2026-06-09T07:45:00Z', os: 'NetApp ONTAP 9.14', role: 'NAS Server' } } },
      { data: { id: 'file-nas-02', label: 'FILE-NAS-02', type: NODE_TYPES.FILE_SERVER, parentGroup: 'file-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Secondary NAS (replica target)', status: 'healthy', ip: '10.1.0.82', region: 'Primary DC', lastUpdated: '2026-06-09T07:43:00Z', os: 'NetApp ONTAP 9.14', role: 'NAS Replica' } } },
      { data: { id: 'file-dfs-01', label: 'FILE-DFS-01', type: NODE_TYPES.FILE_SERVER, parentGroup: 'file-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'DFS namespace server', status: 'healthy', ip: '10.1.0.83', region: 'Primary DC', lastUpdated: '2026-06-09T07:41:00Z', os: 'Windows Server 2022', role: 'DFS Server' } } },
    ],
    edges: [
      { data: { id: 'e-fs-01', source: 'file-servers', target: 'file-nas-01', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'NFS / SMB' } },
      { data: { id: 'e-fs-02', source: 'file-servers', target: 'file-nas-02', edgeType: 'device', bandwidth: '10 Gbps', protocol: 'NFS / SMB' } },
      { data: { id: 'e-fs-03', source: 'file-servers', target: 'file-dfs-01', edgeType: 'device', bandwidth: '1 Gbps',  protocol: 'SMB' } },
    ],
  },

  'monitoring-servers': {
    nodes: [
      { data: { id: 'mon-prometheus', label: 'MON-PROM-01', type: NODE_TYPES.MONITORING_SERVER, parentGroup: 'monitoring-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Prometheus metrics server', status: 'healthy', ip: '10.1.0.97', region: 'Primary DC', lastUpdated: '2026-06-09T08:00:00Z', os: 'Ubuntu 24.04 LTS', role: 'Metrics Collection' } } },
      { data: { id: 'mon-grafana',    label: 'MON-GRAF-01', type: NODE_TYPES.MONITORING_SERVER, parentGroup: 'monitoring-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Grafana dashboards + alerting', status: 'healthy', ip: '10.1.0.98', region: 'Primary DC', lastUpdated: '2026-06-09T08:00:00Z', os: 'Ubuntu 24.04 LTS', role: 'Visualization' } } },
      { data: { id: 'mon-siem',       label: 'MON-SIEM-01', type: NODE_TYPES.MONITORING_SERVER, parentGroup: 'monitoring-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'SIEM / log aggregation (Splunk)', status: 'healthy', ip: '10.1.0.99', region: 'Primary DC', lastUpdated: '2026-06-09T08:00:00Z', os: 'RHEL 9.2', role: 'SIEM' } } },
    ],
    edges: [
      { data: { id: 'e-mn-01', source: 'monitoring-servers', target: 'mon-prometheus', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-mn-02', source: 'monitoring-servers', target: 'mon-grafana',    edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-mn-03', source: 'monitoring-servers', target: 'mon-siem',       edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'backup-servers': {
    nodes: [
      { data: { id: 'bak-veeam-01', label: 'BAK-VEEAM-01', type: NODE_TYPES.BACKUP_SERVER, parentGroup: 'backup-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Veeam backup repository (primary)', status: 'healthy', ip: '10.1.0.113', region: 'Primary DC', lastUpdated: '2026-06-09T07:40:00Z', os: 'Windows Server 2022', role: 'Backup Repository' } } },
      { data: { id: 'bak-tape-01',  label: 'BAK-TAPE-01',  type: NODE_TYPES.BACKUP_SERVER, parentGroup: 'backup-servers', level: NODE_LEVELS.DEVICE, meta: { description: 'Tape library gateway / offsite DR', status: 'healthy', ip: '10.1.0.114', region: 'Primary DC', lastUpdated: '2026-06-09T07:38:00Z', os: 'Windows Server 2022', role: 'Tape Gateway' } } },
    ],
    edges: [
      { data: { id: 'e-bk-01', source: 'backup-servers', target: 'bak-veeam-01', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-bk-02', source: 'backup-servers', target: 'bak-tape-01',  edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },

  // ── Regional endpoint device samples ────────────────────────────────────

  'lap-na': {
    nodes: [
      { data: { id: 'lap-na-001', label: 'LAP-NA-001', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Engineering MacBook Pro', status: 'healthy', ip: '10.10.1.1', region: 'North America', lastUpdated: '2026-06-09T05:00:00Z', os: 'macOS 15.2 Sequoia', role: 'Developer' } } },
      { data: { id: 'lap-na-002', label: 'LAP-NA-002', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Sales team laptop', status: 'healthy', ip: '10.10.1.2', region: 'North America', lastUpdated: '2026-06-09T05:10:00Z', os: 'Windows 11 Pro 23H2', role: 'Sales' } } },
      { data: { id: 'lap-na-003', label: 'LAP-NA-003', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Finance department laptop', status: 'healthy', ip: '10.10.1.3', region: 'North America', lastUpdated: '2026-06-09T05:05:00Z', os: 'Windows 11 Pro 23H2', role: 'Finance' } } },
      { data: { id: 'lap-na-004', label: 'LAP-NA-004', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Management laptop', status: 'healthy', ip: '10.10.1.4', region: 'North America', lastUpdated: '2026-06-09T04:55:00Z', os: 'macOS 15.1 Sequoia', role: 'Management' } } },
      { data: { id: 'lap-na-005', label: 'LAP-NA-005', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-na', level: NODE_LEVELS.DEVICE, meta: { description: 'HR department laptop', status: 'warning', ip: '10.10.1.5', region: 'North America', lastUpdated: '2026-06-08T18:00:00Z', os: 'Windows 11 Pro 22H2', role: 'HR' } } },
    ],
    edges: [
      { data: { id: 'e-lna-001', source: 'lap-na', target: 'lap-na-001', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lna-002', source: 'lap-na', target: 'lap-na-002', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lna-003', source: 'lap-na', target: 'lap-na-003', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lna-004', source: 'lap-na', target: 'lap-na-004', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lna-005', source: 'lap-na', target: 'lap-na-005', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
    ],
  },

  'lap-eu': {
    nodes: [
      { data: { id: 'lap-eu-001', label: 'LAP-EU-001', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'London engineering laptop', status: 'healthy', ip: '10.10.2.1', region: 'Europe', lastUpdated: '2026-06-09T06:00:00Z', os: 'Ubuntu 24.04 LTS', role: 'Developer' } } },
      { data: { id: 'lap-eu-002', label: 'LAP-EU-002', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'Amsterdam product laptop', status: 'healthy', ip: '10.10.2.2', region: 'Europe', lastUpdated: '2026-06-09T05:50:00Z', os: 'macOS 15.2 Sequoia', role: 'Product Manager' } } },
      { data: { id: 'lap-eu-003', label: 'LAP-EU-003', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'Berlin design team laptop', status: 'healthy', ip: '10.10.2.3', region: 'Europe', lastUpdated: '2026-06-09T05:45:00Z', os: 'macOS 15.2 Sequoia', role: 'Designer' } } },
      { data: { id: 'lap-eu-004', label: 'LAP-EU-004', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'Paris operations laptop', status: 'healthy', ip: '10.10.2.4', region: 'Europe', lastUpdated: '2026-06-09T05:40:00Z', os: 'Windows 11 Pro 23H2', role: 'Operations' } } },
    ],
    edges: [
      { data: { id: 'e-leu-001', source: 'lap-eu', target: 'lap-eu-001', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-leu-002', source: 'lap-eu', target: 'lap-eu-002', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-leu-003', source: 'lap-eu', target: 'lap-eu-003', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-leu-004', source: 'lap-eu', target: 'lap-eu-004', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
    ],
  },

  'lap-apac': {
    nodes: [
      { data: { id: 'lap-apac-001', label: 'LAP-APAC-001', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-apac', level: NODE_LEVELS.DEVICE, meta: { description: 'Singapore engineering laptop', status: 'healthy', ip: '10.10.3.1', region: 'Asia Pacific', lastUpdated: '2026-06-09T00:00:00Z', os: 'macOS 14.5 Sonoma', role: 'Developer' } } },
      { data: { id: 'lap-apac-002', label: 'LAP-APAC-002', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-apac', level: NODE_LEVELS.DEVICE, meta: { description: 'Tokyo support laptop', status: 'healthy', ip: '10.10.3.2', region: 'Asia Pacific', lastUpdated: '2026-06-08T23:50:00Z', os: 'Windows 11 Pro 23H2', role: 'Support' } } },
      { data: { id: 'lap-apac-003', label: 'LAP-APAC-003', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-apac', level: NODE_LEVELS.DEVICE, meta: { description: 'Sydney sales laptop', status: 'healthy', ip: '10.10.3.3', region: 'Asia Pacific', lastUpdated: '2026-06-08T23:40:00Z', os: 'Windows 11 Pro 23H2', role: 'Sales' } } },
      { data: { id: 'lap-apac-004', label: 'LAP-APAC-004', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-apac', level: NODE_LEVELS.DEVICE, meta: { description: 'Singapore management laptop', status: 'healthy', ip: '10.10.3.4', region: 'Asia Pacific', lastUpdated: '2026-06-08T23:30:00Z', os: 'macOS 14.5 Sonoma', role: 'Management' } } },
    ],
    edges: [
      { data: { id: 'e-lapac-001', source: 'lap-apac', target: 'lap-apac-001', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lapac-002', source: 'lap-apac', target: 'lap-apac-002', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lapac-003', source: 'lap-apac', target: 'lap-apac-003', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lapac-004', source: 'lap-apac', target: 'lap-apac-004', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
    ],
  },

  'lap-in': {
    nodes: [
      { data: { id: 'lap-in-001', label: 'LAP-IN-001', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-in', level: NODE_LEVELS.DEVICE, meta: { description: 'Bangalore developer laptop', status: 'healthy', ip: '10.10.5.1', region: 'India', lastUpdated: '2026-06-09T02:30:00Z', os: 'Ubuntu 24.04 LTS', role: 'Developer' } } },
      { data: { id: 'lap-in-002', label: 'LAP-IN-002', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-in', level: NODE_LEVELS.DEVICE, meta: { description: 'Hyderabad QA laptop', status: 'healthy', ip: '10.10.5.2', region: 'India', lastUpdated: '2026-06-09T02:20:00Z', os: 'Windows 11 Pro 23H2', role: 'QA Engineer' } } },
      { data: { id: 'lap-in-003', label: 'LAP-IN-003', type: NODE_TYPES.LAPTOP, parentGroup: 'lap-in', level: NODE_LEVELS.DEVICE, meta: { description: 'Bangalore support laptop', status: 'healthy', ip: '10.10.5.3', region: 'India', lastUpdated: '2026-06-09T02:10:00Z', os: 'Windows 11 Pro 23H2', role: 'Support' } } },
    ],
    edges: [
      { data: { id: 'e-lin-001', source: 'lap-in', target: 'lap-in-001', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lin-002', source: 'lap-in', target: 'lap-in-002', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-lin-003', source: 'lap-in', target: 'lap-in-003', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6' } },
    ],
  },

  'desk-na': {
    nodes: [
      { data: { id: 'desk-na-001', label: 'DESK-NA-001', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-na', level: NODE_LEVELS.DEVICE, meta: { description: 'HQ engineering workstation', status: 'healthy', ip: '10.20.1.1', region: 'North America', lastUpdated: '2026-06-09T05:00:00Z', os: 'Windows 11 Pro 23H2', role: 'Workstation' } } },
      { data: { id: 'desk-na-002', label: 'DESK-NA-002', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Finance department workstation', status: 'healthy', ip: '10.20.1.2', region: 'North America', lastUpdated: '2026-06-09T05:05:00Z', os: 'Windows 11 Pro 23H2', role: 'Finance' } } },
      { data: { id: 'desk-na-003', label: 'DESK-NA-003', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Reception desk workstation', status: 'healthy', ip: '10.20.1.3', region: 'North America', lastUpdated: '2026-06-09T04:50:00Z', os: 'Windows 11 Pro 23H2', role: 'Reception' } } },
      { data: { id: 'desk-na-004', label: 'DESK-NA-004', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Conference room workstation', status: 'healthy', ip: '10.20.1.4', region: 'North America', lastUpdated: '2026-06-09T04:45:00Z', os: 'Windows 11 Pro 23H2', role: 'Conference' } } },
    ],
    edges: [
      { data: { id: 'e-dna-001', source: 'desk-na', target: 'desk-na-001', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-dna-002', source: 'desk-na', target: 'desk-na-002', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-dna-003', source: 'desk-na', target: 'desk-na-003', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-dna-004', source: 'desk-na', target: 'desk-na-004', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'desk-eu': {
    nodes: [
      { data: { id: 'desk-eu-001', label: 'DESK-EU-001', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'London engineering workstation', status: 'healthy', ip: '10.20.2.1', region: 'Europe', lastUpdated: '2026-06-09T06:00:00Z', os: 'Ubuntu 24.04 LTS', role: 'Workstation' } } },
      { data: { id: 'desk-eu-002', label: 'DESK-EU-002', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'Amsterdam finance workstation', status: 'healthy', ip: '10.20.2.2', region: 'Europe', lastUpdated: '2026-06-09T05:55:00Z', os: 'Windows 11 Pro 23H2', role: 'Finance' } } },
      { data: { id: 'desk-eu-003', label: 'DESK-EU-003', type: NODE_TYPES.DESKTOP, parentGroup: 'desk-eu', level: NODE_LEVELS.DEVICE, meta: { description: 'Shared hotdesk workstation', status: 'healthy', ip: '10.20.2.3', region: 'Europe', lastUpdated: '2026-06-09T05:50:00Z', os: 'Windows 11 Pro 23H2', role: 'Shared' } } },
    ],
    edges: [
      { data: { id: 'e-deu-001', source: 'desk-eu', target: 'desk-eu-001', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-deu-002', source: 'desk-eu', target: 'desk-eu-002', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
      { data: { id: 'e-deu-003', source: 'desk-eu', target: 'desk-eu-003', edgeType: 'device', bandwidth: '1 Gbps', protocol: 'Ethernet' } },
    ],
  },

  'mob-na': {
    nodes: [
      { data: { id: 'mob-na-001', label: 'MOB-NA-001', type: NODE_TYPES.MOBILE, parentGroup: 'mob-na', level: NODE_LEVELS.DEVICE, meta: { description: 'iPhone 15 Pro — executive', status: 'healthy', ip: '10.30.1.1', region: 'North America', lastUpdated: '2026-06-09T06:30:00Z', os: 'iOS 17.5', role: 'Executive Mobile' } } },
      { data: { id: 'mob-na-002', label: 'MOB-NA-002', type: NODE_TYPES.MOBILE, parentGroup: 'mob-na', level: NODE_LEVELS.DEVICE, meta: { description: 'Samsung Galaxy S24 — sales', status: 'healthy', ip: '10.30.1.2', region: 'North America', lastUpdated: '2026-06-09T06:20:00Z', os: 'Android 14', role: 'Sales Mobile' } } },
      { data: { id: 'mob-na-003', label: 'MOB-NA-003', type: NODE_TYPES.MOBILE, parentGroup: 'mob-na', level: NODE_LEVELS.DEVICE, meta: { description: 'iPhone 14 — field engineer', status: 'healthy', ip: '10.30.1.3', region: 'North America', lastUpdated: '2026-06-09T06:10:00Z', os: 'iOS 17.4', role: 'Field Engineer' } } },
    ],
    edges: [
      { data: { id: 'e-mna-001', source: 'mob-na', target: 'mob-na-001', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6 / 5G' } },
      { data: { id: 'e-mna-002', source: 'mob-na', target: 'mob-na-002', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6 / 5G' } },
      { data: { id: 'e-mna-003', source: 'mob-na', target: 'mob-na-003', edgeType: 'device', bandwidth: '100 Mbps', protocol: 'Wi-Fi 6 / 5G' } },
    ],
  },

  'guest-hq': {
    nodes: [
      { data: { id: 'guest-hq-001', label: 'GUEST-HQ-001', type: NODE_TYPES.GUEST_DEVICE, parentGroup: 'guest-hq', level: NODE_LEVELS.DEVICE, meta: { description: 'Visitor laptop (VLAN 100)', status: 'healthy', ip: '10.40.0.101', region: 'HQ', lastUpdated: '2026-06-09T07:00:00Z', os: 'Unknown', role: 'Guest' } } },
      { data: { id: 'guest-hq-002', label: 'GUEST-HQ-002', type: NODE_TYPES.GUEST_DEVICE, parentGroup: 'guest-hq', level: NODE_LEVELS.DEVICE, meta: { description: 'Contractor device (VLAN 100)', status: 'healthy', ip: '10.40.0.102', region: 'HQ', lastUpdated: '2026-06-09T06:50:00Z', os: 'Unknown', role: 'Contractor' } } },
      { data: { id: 'guest-hq-003', label: 'GUEST-HQ-003', type: NODE_TYPES.GUEST_DEVICE, parentGroup: 'guest-hq', level: NODE_LEVELS.DEVICE, meta: { description: 'Personal phone on guest WiFi', status: 'healthy', ip: '10.40.0.103', region: 'HQ', lastUpdated: '2026-06-09T06:45:00Z', os: 'iOS 17', role: 'Guest Mobile' } } },
    ],
    edges: [
      { data: { id: 'e-ghq-001', source: 'guest-hq', target: 'guest-hq-001', edgeType: 'device', bandwidth: '50 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-ghq-002', source: 'guest-hq', target: 'guest-hq-002', edgeType: 'device', bandwidth: '50 Mbps', protocol: 'Wi-Fi 6' } },
      { data: { id: 'e-ghq-003', source: 'guest-hq', target: 'guest-hq-003', edgeType: 'device', bandwidth: '50 Mbps', protocol: 'Wi-Fi 6' } },
    ],
  },
};

// ─── Combined expansion map ───────────────────────────────────────────────────

export const ALL_EXPANSION_MAP = {
  ...EXPANSION_MAP,
  ...DEVICE_EXPANSION_MAP,
};

/**
 * Set of all node IDs that have expansion data.
 * Used by UI to show visual "expandable" cue on a node.
 */
export const EXPANDABLE_IDS = new Set(Object.keys(ALL_EXPANSION_MAP));

// ─── Flat search index ────────────────────────────────────────────────────────

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

// ─── Node type display labels ─────────────────────────────────────────────────

export const TYPE_LABELS = {
  [NODE_TYPES.CLOUD_GROUP]:          'Cloud / Internet',
  [NODE_TYPES.VPN_GROUP]:            'VPN Gateway',
  [NODE_TYPES.FIREWALL_GROUP]:       'Firewall Group',
  [NODE_TYPES.ROUTER_GROUP]:         'Router Group',
  [NODE_TYPES.SWITCH_GROUP]:         'Switch Group',
  [NODE_TYPES.SERVER_GROUP]:         'Server Network',
  [NODE_TYPES.LAPTOP_GROUP]:         'Laptop Network',
  [NODE_TYPES.DESKTOP_GROUP]:        'Desktop Network',
  [NODE_TYPES.MOBILE_GROUP]:         'Mobile Network',
  [NODE_TYPES.GUEST_GROUP]:          'Guest Network',
  [NODE_TYPES.CLOUD_PROVIDER]:       'Cloud Provider',
  [NODE_TYPES.VPN_SUBGROUP]:         'VPN Sub-group',
  [NODE_TYPES.FIREWALL_SUBGROUP]:    'Firewall Sub-group',
  [NODE_TYPES.ROUTER_SUBGROUP]:      'Router Sub-group',
  [NODE_TYPES.SWITCH_SUBGROUP]:      'Switch Sub-group',
  [NODE_TYPES.WEB_SERVER_GROUP]:     'Web Server Group',
  [NODE_TYPES.APP_SERVER_GROUP]:     'App Server Group',
  [NODE_TYPES.DB_SERVER_GROUP]:      'DB Server Group',
  [NODE_TYPES.AD_SERVER_GROUP]:      'Active Directory Group',
  [NODE_TYPES.MAIL_SERVER_GROUP]:    'Mail Server Group',
  [NODE_TYPES.FILE_SERVER_GROUP]:    'File Server Group',
  [NODE_TYPES.MONITORING_GROUP]:     'Monitoring Group',
  [NODE_TYPES.BACKUP_GROUP]:         'Backup Server Group',
  [NODE_TYPES.REGION_GROUP]:         'Regional Group',
  [NODE_TYPES.VPN_DEVICE]:           'VPN Appliance',
  [NODE_TYPES.FIREWALL]:             'Firewall',
  [NODE_TYPES.ROUTER]:               'Router',
  [NODE_TYPES.SWITCH]:               'Switch',
  [NODE_TYPES.WEB_SERVER]:           'Web Server',
  [NODE_TYPES.APP_SERVER]:           'Application Server',
  [NODE_TYPES.DB_SERVER]:            'Database Server',
  [NODE_TYPES.AD_SERVER]:            'Active Directory Server',
  [NODE_TYPES.MAIL_SERVER]:          'Mail Server',
  [NODE_TYPES.FILE_SERVER]:          'File Server',
  [NODE_TYPES.MONITORING_SERVER]:    'Monitoring Server',
  [NODE_TYPES.BACKUP_SERVER]:        'Backup Server',
  [NODE_TYPES.LAPTOP]:               'Laptop',
  [NODE_TYPES.DESKTOP]:              'Desktop',
  [NODE_TYPES.MOBILE]:               'Mobile Device',
  [NODE_TYPES.GUEST_DEVICE]:         'Guest Device',
};
