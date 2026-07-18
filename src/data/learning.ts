export const roadmap = [
  {
    stage: "Foundations",
    weeks: "Weeks 1-2",
    topics: ["Cloud concepts", "AWS global infrastructure (Regions/AZs/Edge)", "IAM basics", "AWS CLI & Console", "Billing & Support plans"],
  },
  {
    stage: "Core Services",
    weeks: "Weeks 3-6",
    topics: ["EC2 + EBS + AMIs", "VPC networking deep-dive", "S3 storage classes", "RDS & Aurora", "Route 53 + CloudFront"],
  },
  {
    stage: "Modern Apps",
    weeks: "Weeks 7-10",
    topics: ["Lambda & API Gateway", "DynamoDB single-table design", "ECS/EKS containers", "SNS/SQS event patterns", "Step Functions"],
  },
  {
    stage: "Operations & Security",
    weeks: "Weeks 11-13",
    topics: ["CloudWatch + X-Ray observability", "CloudTrail audit", "KMS + Secrets Manager", "WAF + Shield", "Config + Security Hub"],
  },
  {
    stage: "Architecture",
    weeks: "Weeks 14-16",
    topics: ["Well-Architected Framework", "Multi-account with Control Tower", "Disaster recovery patterns", "Cost optimization", "Migration strategies (6Rs)"],
  },
];

export const flashcards = [
  { front: "What are the 6 Rs of migration?", back: "Rehost, Replatform, Repurchase, Refactor, Retire, Retain." },
  { front: "RTO vs RPO?", back: "RTO = how quickly you must recover. RPO = how much data loss is acceptable." },
  { front: "S3 durability?", back: "99.999999999% (11 nines) across ≥3 AZs." },
  { front: "Max Lambda duration?", back: "15 minutes." },
  { front: "Availability Zone?", back: "One or more discrete data centers with redundant power/network, isolated from other AZs in the same region." },
  { front: "What does SCP stand for?", back: "Service Control Policy — org-level guardrails that limit what member accounts can do." },
  { front: "How many copies does Aurora store?", back: "6 across 3 AZs." },
  { front: "Default VPC CIDR?", back: "172.31.0.0/16." },
];

export const quiz = [
  {
    q: "You need a single-digit-ms key-value store that scales to millions of req/s with no server management. Which service?",
    options: ["RDS", "DynamoDB", "ElastiCache", "Neptune"],
    answer: 1,
    explain: "DynamoDB is serverless NoSQL with predictable single-digit ms latency and virtually unlimited scale.",
  },
  {
    q: "Which service provides Layer 7 load balancing with path-based routing?",
    options: ["NLB", "GWLB", "ALB", "Route 53"],
    answer: 2,
    explain: "Application Load Balancer operates at L7 (HTTP/HTTPS) and supports host- and path-based routing.",
  },
  {
    q: "Cheapest S3 tier for data accessed once a year?",
    options: ["Standard", "Standard-IA", "Glacier Instant Retrieval", "Glacier Deep Archive"],
    answer: 3,
    explain: "Glacier Deep Archive is $0.00099/GB for long-term archival with 12-hour retrieval.",
  },
  {
    q: "Which pattern decouples a producer from N consumers?",
    options: ["SQS queue", "SNS → SQS fan-out", "EventBridge to Lambda", "Kinesis"],
    answer: 1,
    explain: "SNS fans out to multiple SQS queues, each independently consumed — classic decoupling pattern.",
  },
  {
    q: "Fastest way to give an EC2 instance access to S3?",
    options: ["Store keys in ~/.aws/credentials", "Use an IAM role via instance profile", "Hardcode keys in code", "Use root credentials"],
    answer: 1,
    explain: "IAM roles attached via instance profile give short-lived, auto-rotated credentials — no secrets to manage.",
  },
];

export const labs = [
  { title: "Deploy a 3-tier web app", desc: "ALB + EC2 ASG + RDS Multi-AZ across 2 AZs. Terraform or CDK." },
  { title: "Serverless URL shortener", desc: "API Gateway + Lambda + DynamoDB with custom domain and CloudFront." },
  { title: "Static site + CI/CD", desc: "S3 + CloudFront + Route 53 + GitHub Actions OIDC to AWS." },
  { title: "Event-driven image processing", desc: "S3 upload → Lambda → resize → S3 + DynamoDB metadata." },
  { title: "Multi-account org", desc: "AWS Organizations + Control Tower with SCPs and a log archive account." },
];

export const interviewCategories = [
  {
    category: "Networking",
    items: [
      { q: "Walk me through how a request from a user in Tokyo reaches an EC2 instance in us-east-1.", a: "DNS via Route 53 → CloudFront edge (Tokyo) → origin fetch over AWS backbone → ALB in us-east-1 → target EC2 in a private subnet. Return path is reverse; TLS terminated at CloudFront and re-encrypted to origin." },
      { q: "How would you design a hybrid network between on-prem and AWS?", a: "Direct Connect (dedicated) for consistent bandwidth + VPN as backup. Attach to Transit Gateway with BGP; use route tables and SCPs to segment prod/non-prod." },
      { q: "What is PrivateLink and when do you use it?", a: "PrivateLink exposes a service across VPCs/accounts via ENIs, avoiding public IPs. Use for SaaS-style service consumption or exposing internal services." },
    ],
  },
  {
    category: "Security",
    items: [
      { q: "Design least privilege for a Lambda that writes to one DynamoDB table.", a: "Create an IAM role with a policy allowing only dynamodb:PutItem/UpdateItem on that exact table ARN. Attach via function execution role; forbid iam:PassRole broadly." },
      { q: "How would you rotate a database password with zero downtime?", a: "Use Secrets Manager with a rotation Lambda; app fetches secret on cold start and caches with a short TTL. Rotation creates a new user, dual-writes, then flips." },
    ],
  },
  {
    category: "Reliability",
    items: [
      { q: "Design a multi-region active-passive failover.", a: "Deploy identical stacks in 2 regions. Aurora Global Database or DynamoDB Global Tables for data. Route 53 health-checked failover records with TTL 60. Automate promotion via runbook or Step Functions." },
      { q: "What's your DR strategy taxonomy?", a: "Backup & restore (hours RTO), Pilot Light (minimal warm infra), Warm Standby (scaled-down live), Active-Active (near-zero RTO/RPO)." },
    ],
  },
  {
    category: "Cost",
    items: [
      { q: "You inherit a $200k/month AWS bill. Where do you start?", a: "Cost Explorer by service and tag → Compute Optimizer for right-sizing → Savings Plans for steady baseline → Spot for stateless workloads → S3 lifecycle + Intelligent-Tiering → kill idle NAT gateways and unattached EBS/EIPs." },
    ],
  },
  {
    category: "Behavioral",
    items: [
      { q: "Tell me about a production incident you led.", a: "Use STAR: Situation (impact/scope), Task (your role), Action (what you did — comms, mitigation, RCA), Result (metrics + prevention work). Emphasize customer obsession and ownership." },
    ],
  },
];