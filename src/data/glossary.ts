export const glossary: Record<string, string> = {
  'shared-services-account':
    'Provider/hub AWS account accessed via the `shared-services` CLI profile — owns shared apps, endpoint services, TGW, Lattice networks, and the Cloud WAN core network.',
  'dev-account':
    'Consumer/spoke AWS account accessed via the `dev` CLI profile — hosts consumer VPCs, test EC2, endpoints, and attachments.',
  'primary-region':
    '`ap-southeast-2` — default deployment region for VPC Peering, PrivateLink, VPC Lattice, and Transit Gateway.',
  'cloud-wan-regions':
    'Workload regions for Cloud WAN attachments: `ap-southeast-2`, `ap-southeast-6`, and `ap-southeast-1` — distinct from RAM_Region.',
  'ram-region':
    '`us-east-1` — required for creating and accepting RAM shares of global resources such as the Cloud WAN core network; not a workload region.',
  ram: 'AWS Resource Access Manager — shares Lattice service networks, Transit Gateways, and Cloud WAN core networks across accounts.',
  'core-network':
    'Global Cloud WAN backbone that connects regional edges. Segment policies apply at the core network; it is a global resource shared via RAM.',
  segment:
    'Logical Cloud WAN partition with its own route policy. This demo uses shared, workloads (mutual allow), and sandbox (isolated).',
  privatelink:
    'AWS PrivateLink — L4 private connectivity via interface VPC endpoints to a provider endpoint service, without shared CIDR routing.',
  'vpc-peering':
    'L3 point-to-point connection between two VPCs. Requires non-overlapping CIDRs, acceptance, and optional DNS resolution enablement.',
  'vpc-lattice':
    'AWS VPC Lattice — L7 service networking with service networks, discovery, routing, and auth policies shared across accounts via RAM.',
  'transit-gateway':
    'AWS Transit Gateway — regional L3 hub connecting many VPCs. Cross-account use needs RAM share, attachment acceptance, and routes.',
  'cloud-wan':
    'AWS Cloud WAN — managed global L3 network with multi-region edges and segment-based isolation policies.',
  'session-manager':
    'AWS Systems Manager Session Manager — interactive shell on private EC2 without SSH or bastions; used for curl verification in this walkthrough.',
  'placeholder-id':
    'Synthetic AWS identifier used in docs (e.g. `123456789012`, ARNs ending in EXAMPLE) instead of real account IDs or hostnames.',
  'upstream-demo-repo':
    'jajera/aws-private-connectivity-patterns-demo — Terraform for all five patterns; this site is the documentation companion only.',
  attachment:
    'Connection of a VPC (or similar) to a TGW or Cloud WAN edge. Cross-account attachments often need acceptance and route setup.',
  'endpoint-service':
    'PrivateLink provider resource (NLB-backed) that consumers reach through interface VPC endpoints over the AWS private network.',
  'service-network':
    'VPC Lattice resource that groups services and L7 policies; shared to consumer accounts via RAM before VPC association.',
  eni: 'Elastic Network Interface — virtual NIC; PrivateLink interface endpoints create ENIs in consumer subnets.',
  cidr: 'Classless Inter-Domain Routing — IP range notation such as `10.10.0.0/16`. Peering and TGW need non-overlapping CIDRs; PrivateLink and Lattice do not.',
  sso: 'AWS IAM Identity Center (SSO) — federated login used by the `shared-services` and `dev` CLI profiles in this walkthrough.',
};
