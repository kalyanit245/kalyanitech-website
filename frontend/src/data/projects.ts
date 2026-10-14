export interface ProjectResult {
  value: string;
  label: string;
}

export interface Project {
  slug: string;
  name: string;
  category: string;
  desc: string;
  year: string;
  image: string;
  client: string;
  tagline: string;
  overview: string;
  challenge: string;
  solution: string;
  stack: string[];
  results: ProjectResult[];
}

export const PROJECTS: Project[] = [
  {
    slug: "nexus-erp",
    name: "Nexus ERP",
    category: "Enterprise SaaS",
    desc: "Multi-tenant operations suite serving 40k daily users across 3 continents.",
    year: "2025",
    image: "https://images.unsplash.com/photo-1536148935331-408321065b18?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHw0fHxzb2Z0d2FyZSUyMGVuZ2luZWVyaW5nJTIwdGVhbSUyMHRlY2h8ZW58MHx8fHwxNzkxMTU3MzI4fDA&ixlib=rb-4.1.0&q=85",
    client: "Nexus Logistics Group",
    tagline: "One operations backbone for 40,000 people who never stop moving.",
    overview:
      "Nexus Logistics ran its operations across fourteen disconnected tools — spreadsheets for fleet, email for approvals, a legacy ERP for finance. We designed and built Nexus ERP: a single multi-tenant platform unifying fleet, warehousing, HR, and finance with realtime dashboards for every region.",
    challenge:
      "The platform had to serve three continents with strict data-residency rules, survive warehouse-floor connectivity drops, and migrate twelve years of legacy data without a single day of halted operations. Offline-first sync with conflict resolution was non-negotiable.",
    solution:
      "We built an event-sourced core with region-pinned PostgreSQL clusters, an offline-first PWA for floor staff with CRDT-based sync, and a strangler-fig migration that moved modules live, one at a time. Every tenant gets isolated encryption keys and audit trails.",
    stack: ["React", "TypeScript", "FastAPI", "PostgreSQL", "Kafka", "Kubernetes"],
    results: [
      { value: "40k+", label: "Daily active users" },
      { value: "14 → 1", label: "Tools consolidated" },
      { value: "0", label: "Downtime during migration" },
    ],
  },
  {
    slug: "vaultpay",
    name: "VaultPay",
    category: "FinTech",
    desc: "PCI-DSS compliant payment rails settling ₹200Cr+ monthly with zero downtime.",
    year: "2025",
    image: "https://images.unsplash.com/photo-1709377195538-5522ed0f9e10?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHw0fHxmaW50ZWNoJTIwcGF5bWVudCUyMGRhcmslMjBhYnN0cmFjdHxlbnwwfHx8fDE3OTExNTgyODZ8MA&ixlib=rb-4.1.0&q=85",
    client: "VaultPay Financial Services",
    tagline: "Payment rails that treat every rupee like it's the only one.",
    overview:
      "VaultPay needed to move from a third-party payment aggregator to its own rails — owning settlement, reconciliation, and fraud checks end to end. We engineered the core ledger, settlement engine, and merchant dashboard that now process over ₹200 crore every month.",
    challenge:
      "Money movement tolerates zero ambiguity: every transaction must be exactly-once, fully auditable, and reconciled to the paisa. The system had to pass PCI-DSS Level 1 audit while settling across four banking partners with wildly different APIs.",
    solution:
      "A double-entry ledger with SERIALIZABLE isolation and idempotent settlement batches, an outbox pattern guaranteeing exactly-once delivery to banking partners, and a reconciliation engine that auto-flags mismatches within 90 seconds. Full HSM-backed key management for card data.",
    stack: ["Python", "FastAPI", "PostgreSQL", "Redis", "AWS", "Terraform"],
    results: [
      { value: "₹200Cr+", label: "Monthly settlement volume" },
      { value: "99.99%", label: "Uptime since launch" },
      { value: "90s", label: "Mismatch detection time" },
    ],
  },
  {
    slug: "sentinel-ai",
    name: "Sentinel AI",
    category: "AI Engines",
    desc: "Realtime anomaly-detection engine flagging fraud across 2M events per second.",
    year: "2026",
    image: "https://images.unsplash.com/photo-1637946175559-22c4fe13fc54?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwyfHxmaW50ZWNoJTIwcGF5bWVudCUyMGRhcmslMjBhYnN0cmFjdHxlbnwwfHx8fDE3OTExNTgyODZ8MA&ixlib=rb-4.1.0&q=85",
    client: "Sentinel Security Labs",
    tagline: "Finding the one bad actor in two million events per second.",
    overview:
      "Sentinel's fraud team was drowning in false positives — 94% of flagged events were noise. We built a streaming anomaly-detection engine that scores every event in under 8 milliseconds and learns from analyst feedback in near-realtime.",
    challenge:
      "The model had to run inside the transaction path — any latency above 10ms would cascade into checkout failures. Fraud patterns also drift weekly, so a model trained last month is already stale. And every flag needed a human-readable explanation for auditors.",
    solution:
      "A feature store fed by Kafka streams, an ensemble of gradient-boosted models with a distilled fast-path scorer, and online learning that incorporates analyst verdicts within minutes. SHAP-based reason codes accompany every flag, and shadow-mode deployments validate new models against live traffic before cutover.",
    stack: ["Python", "Kafka", "Feature Store", "XGBoost", "ONNX", "Kubernetes"],
    results: [
      { value: "2M/sec", label: "Events scored in realtime" },
      { value: "8ms", label: "P99 scoring latency" },
      { value: "-71%", label: "False positives reduced" },
    ],
  },
  {
    slug: "helios-cloud",
    name: "Helios Cloud",
    category: "Cloud Native",
    desc: "Internal developer platform cutting deploy time from 45 minutes to 38 seconds.",
    year: "2026",
    image: "https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwyfHxjbG91ZCUyMGRhdGFjZW50ZXIlMjBzZXJ2ZXJzJTIwZGFya3xlbnwwfHx8fDE3OTExNTgyODZ8MA&ixlib=rb-4.1.0&q=85",
    client: "Helios Technologies",
    tagline: "An internal platform that made 200 engineers forget DevOps tickets existed.",
    overview:
      "Helios had 200 engineers and a DevOps team of four — every deployment queued behind a ticket. We built Helios Cloud, an internal developer platform where any engineer ships to production with one command, guardrails included.",
    challenge:
      "Self-service deployment usually means chaos: snowflake configs, untracked resources, security exceptions nobody remembers. The platform had to be genuinely easier than filing a ticket, or nobody would adopt it — while enforcing compliance invisibly.",
    solution:
      "A GitOps control plane on Kubernetes with golden-path templates, policy-as-code admission checks, and ephemeral preview environments for every pull request. Developers see a single CLI and dashboard; the platform handles secrets, certificates, autoscaling, and rollback automatically.",
    stack: ["Go", "Kubernetes", "ArgoCD", "Crossplane", "React", "gRPC"],
    results: [
      { value: "38s", label: "Median deploy time" },
      { value: "63/wk", label: "Production deploys" },
      { value: "0", label: "DevOps tickets per sprint" },
    ],
  },
];
