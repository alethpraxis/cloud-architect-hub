export interface AppPattern {
  id: string;
  name: string;
  description: string;
  services: string[];
  diagram: { layer: string; nodes: string[] }[];
  security: string[];
  cost: string[];
  scalability: string[];
}

export const patterns: AppPattern[] = [
  {
    id: "ecommerce",
    name: "E-commerce Platform",
    description: "Global storefront with product catalog, cart, checkout, and order fulfillment.",
    services: ["CloudFront", "S3", "ALB", "ECS Fargate", "Aurora Serverless v2", "ElastiCache", "SQS", "Lambda", "Cognito", "WAF"],
    diagram: [
      { layer: "Edge", nodes: ["Route 53", "CloudFront", "WAF"] },
      { layer: "Frontend", nodes: ["S3 static site"] },
      { layer: "API", nodes: ["ALB", "ECS Fargate"] },
      { layer: "Async", nodes: ["SQS", "Lambda workers"] },
      { layer: "Data", nodes: ["Aurora Serverless v2", "ElastiCache Redis", "OpenSearch"] },
    ],
    security: ["Cognito user pools for auth", "WAF managed rules against OWASP Top 10", "Secrets Manager for DB creds", "PCI scope isolation with dedicated VPC"],
    cost: ["Aurora Serverless v2 to scale to zero off-peak", "S3 + CloudFront for static assets", "Fargate Spot for stateless workers"],
    scalability: ["ECS service auto scaling on ALB RequestCountPerTarget", "Aurora read replicas for catalog reads", "SQS decouples checkout from fulfillment"],
  },
  {
    id: "blog",
    name: "Content Site / Blog",
    description: "SEO-friendly content platform with a CMS and global delivery.",
    services: ["Route 53", "CloudFront", "S3", "Lambda@Edge", "DynamoDB", "Cognito"],
    diagram: [
      { layer: "Edge", nodes: ["Route 53", "CloudFront"] },
      { layer: "Static", nodes: ["S3 static site (Next SSG)"] },
      { layer: "Dynamic", nodes: ["Lambda@Edge for A/B & auth"] },
      { layer: "Data", nodes: ["DynamoDB for comments"] },
    ],
    security: ["OAC to lock S3 to CloudFront", "Cognito for authors", "WAF bot control"],
    cost: ["Static-first architecture keeps 99% traffic on CDN", "DynamoDB on-demand for spiky comment traffic"],
    scalability: ["CloudFront absorbs traffic bursts", "Static rebuilds via CodeBuild + S3 sync"],
  },
  {
    id: "api",
    name: "Serverless REST API",
    description: "Multi-tenant JSON API with auth, throttling and per-tenant metering.",
    services: ["API Gateway", "Lambda", "DynamoDB", "Cognito", "CloudWatch", "X-Ray"],
    diagram: [
      { layer: "Client", nodes: ["Web/Mobile"] },
      { layer: "API", nodes: ["API Gateway HTTP API", "Cognito JWT authorizer"] },
      { layer: "Compute", nodes: ["Lambda (Node.js 20)"] },
      { layer: "Data", nodes: ["DynamoDB single-table", "Streams → Lambda"] },
    ],
    security: ["JWT authorizer on every route", "Least-privilege IAM per function", "AWS WAF on API Gateway"],
    cost: ["Pay-per-request all the way down", "HTTP API over REST API saves ~70%"],
    scalability: ["Both API Gateway and Lambda scale automatically", "DynamoDB on-demand or auto-scaling provisioned"],
  },
  {
    id: "analytics",
    name: "Data Analytics Pipeline",
    description: "Ingest events, transform, and serve dashboards.",
    services: ["Kinesis Data Streams", "Kinesis Firehose", "S3", "Glue", "Athena", "QuickSight"],
    diagram: [
      { layer: "Ingest", nodes: ["Kinesis Data Streams", "API Gateway"] },
      { layer: "Delivery", nodes: ["Firehose", "Lambda transform"] },
      { layer: "Lake", nodes: ["S3 raw", "S3 curated (Parquet)"] },
      { layer: "Query", nodes: ["Glue Catalog", "Athena", "QuickSight"] },
    ],
    security: ["KMS-encrypted buckets", "Lake Formation fine-grained access", "VPC endpoints for Athena"],
    cost: ["Parquet + partitioning slashes Athena scan costs", "S3 lifecycle to Glacier"],
    scalability: ["Kinesis shards scale to millions of events/sec", "Athena is serverless"],
  },
  {
    id: "realtime",
    name: "Real-time Chat / IoT",
    description: "Bi-directional messaging with device presence.",
    services: ["IoT Core / API Gateway WebSocket", "Lambda", "DynamoDB", "ElastiCache", "SNS"],
    diagram: [
      { layer: "Client", nodes: ["Web/Mobile/IoT device"] },
      { layer: "Edge", nodes: ["API Gateway WebSocket / IoT Core MQTT"] },
      { layer: "Compute", nodes: ["Lambda", "Fargate presence service"] },
      { layer: "Data", nodes: ["DynamoDB (connections)", "ElastiCache Redis"] },
    ],
    security: ["mTLS on IoT Core", "Fine-grained IoT policies per device", "IAM auth for WebSocket"],
    cost: ["WebSocket $1/million msgs", "Connection state in DynamoDB with TTL"],
    scalability: ["Managed services handle millions of concurrent connections", "Shard by user for fan-out"],
  },
];