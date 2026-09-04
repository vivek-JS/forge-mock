// Demo/sample data for the Log Forge concept prototype.
// Every number and vendor reference here is synthetic sample data.

export type Category = "EDR" | "SIEM" | "SOAR" | "Identity" | "Cloud" | "Network";

export type Platform = {
  id: string;
  name: string;
  kind: string;
  category: Category;
  endpoints: number;
  auth: string;
  mock: boolean;
  liveLab: boolean;
};

export const PLATFORMS: Platform[] = [
  { id: "crowdstrike", name: "CrowdStrike", kind: "EDR / XDR", category: "EDR", endpoints: 148, auth: "OAuth2 client credentials", mock: true, liveLab: true },
  { id: "sentinel", name: "Microsoft Sentinel", kind: "SIEM", category: "SIEM", endpoints: 96, auth: "Entra ID / OAuth2", mock: true, liveLab: false },
  { id: "splunk", name: "Splunk", kind: "SIEM / Observability", category: "SIEM", endpoints: 112, auth: "Bearer token", mock: true, liveLab: true },
  { id: "paloalto", name: "Palo Alto Networks", kind: "Network Security", category: "Network", endpoints: 74, auth: "API key", mock: true, liveLab: false },
  { id: "sentinelone", name: "SentinelOne", kind: "EDR / XDR", category: "EDR", endpoints: 88, auth: "API token", mock: true, liveLab: true },
  { id: "okta", name: "Okta", kind: "Identity", category: "Identity", endpoints: 64, auth: "SSWS / OAuth2", mock: true, liveLab: false },
  { id: "wiz", name: "Wiz", kind: "Cloud Security", category: "Cloud", endpoints: 52, auth: "OAuth2", mock: true, liveLab: false },
  { id: "torq", name: "Torq", kind: "SOAR / Automation", category: "SOAR", endpoints: 38, auth: "API key", mock: true, liveLab: false },
  { id: "defender", name: "Microsoft Defender", kind: "EDR / XDR", category: "EDR", endpoints: 121, auth: "Entra ID / OAuth2", mock: true, liveLab: true },
  { id: "zscaler", name: "Zscaler", kind: "Network / SASE", category: "Network", endpoints: 58, auth: "API key + session", mock: true, liveLab: false },
  { id: "qradar", name: "IBM QRadar", kind: "SIEM", category: "SIEM", endpoints: 83, auth: "SEC token", mock: true, liveLab: false },
  { id: "entra", name: "Entra ID", kind: "Identity", category: "Identity", endpoints: 91, auth: "OAuth2", mock: true, liveLab: true },
  { id: "xsoar", name: "Cortex XSOAR", kind: "SOAR", category: "SOAR", endpoints: 45, auth: "API key", mock: true, liveLab: false },
  { id: "gcpscc", name: "Google Security Center", kind: "Cloud Security", category: "Cloud", endpoints: 40, auth: "Service account", mock: true, liveLab: false },
];

export const CATEGORIES: Array<"All" | Category> = ["All", "EDR", "SIEM", "SOAR", "Identity", "Cloud", "Network"];

export type Fault = "none" | "429" | "500" | "latency" | "token";

export const FAULTS: Array<{ id: Fault; label: string }> = [
  { id: "429", label: "429 Rate Limit" },
  { id: "500", label: "500 Server Error" },
  { id: "latency", label: "2s Latency" },
  { id: "token", label: "Expired Token" },
];

export type ApiResult = {
  status: number;
  statusText: string;
  latency: number;
  body: unknown;
};

export const DEVICE_BODY = {
  device_id: "DEV-2941",
  hostname: "FIN-LAPTOP-203",
  platform: "windows",
  os_version: "11 23H2",
  status: "online",
  agent_version: "7.14.18406",
  last_seen: "2026-09-04T10:42:01Z",
  tags: ["fintech", "finance-ops", "managed"],
};

export function simulateRequest(fault: Fault): ApiResult {
  switch (fault) {
    case "429":
      return {
        status: 429,
        statusText: "TOO MANY REQUESTS",
        latency: 18,
        body: { errors: [{ code: 429, message: "rate limit exceeded" }], retry_after: 5 },
      };
    case "500":
      return {
        status: 500,
        statusText: "INTERNAL SERVER ERROR",
        latency: 61,
        body: { errors: [{ code: 500, message: "upstream mock fault injected" }] },
      };
    case "token":
      return {
        status: 401,
        statusText: "UNAUTHORIZED",
        latency: 24,
        body: { errors: [{ code: 401, message: "access token expired" }] },
      };
    case "latency":
      return { status: 200, statusText: "OK", latency: 2043, body: DEVICE_BODY };
    default:
      return { status: 200, statusText: "OK", latency: 84, body: DEVICE_BODY };
  }
}

export const FAULT_EXPLANATION: Record<Exclude<Fault, "none">, string> = {
  "429": "The mock returned 429 with `retry_after: 5`. Your client issued no retry and surfaced the error straight to the caller. Production integrations must back off exponentially and honour Retry-After, otherwise a burst of syncs will drop events silently.",
  "500": "A 5xx is transient by contract. Your client treated it as terminal and abandoned the page cursor, so the sync resumes from the beginning next run — duplicating events downstream.",
  latency: "The request took 2043 ms. Your HTTP timeout is lower than the vendor's p99, so slow-but-successful responses are being cancelled and counted as failures.",
  token: "Access token expired mid-sync. Your client did not refresh the credential and re-issue the request, so every subsequent call in the batch fails with 401.",
};

export type LogRow = {
  id: string;
  time: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  endpoint: string;
  status: number;
  latency: number;
};

const ENDPOINTS: Array<[LogRow["method"], string]> = [
  ["GET", "/devices"],
  ["GET", "/devices/DEV-2941"],
  ["GET", "/alerts"],
  ["POST", "/incidents"],
  ["GET", "/detections"],
  ["PATCH", "/devices/DEV-2941/contain"],
  ["GET", "/threats"],
  ["GET", "/users"],
];

let seq = 0;
export function makeRow(chaos = false, now = new Date()): LogRow {
  const [method, endpoint] = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
  const r = Math.random();
  let status = 200;
  if (chaos) {
    if (r < 0.22) status = 429;
    else if (r < 0.34) status = 500;
    else if (r < 0.4) status = 401;
  } else if (r < 0.06) status = 401;
  seq += 1;
  return {
    id: `${now.getTime()}-${seq}`,
    time: now.toTimeString().slice(0, 8),
    method,
    endpoint,
    status,
    latency: status === 429 ? 18 : Math.round(40 + Math.random() * (chaos ? 900 : 140)),
  };
}

export const READINESS_METRICS = [
  { label: "Authentication", before: 100, after: 100 },
  { label: "API Coverage", before: 88, after: 96 },
  { label: "Error Handling", before: 74, after: 91 },
  { label: "Rate Limit Handling", before: 52, after: 88 },
  { label: "Performance", before: 90, after: 95 },
  { label: "Schema Compatibility", before: 93, after: 97 },
  { label: "Failure Resilience", before: 61, after: 89 },
];

export const SCENARIO_STEPS = [
  { time: "09:00", title: "Employee Login", detail: "okta.session.start · user 0041", severity: "info", call: { method: "GET" as const, endpoint: "/users/0041/sessions", status: 200 } },
  { time: "09:03", title: "Suspicious Process", detail: "powershell.exe -enc …", severity: "warning", call: { method: "GET" as const, endpoint: "/detections", status: 200 } },
  { time: "09:04", title: "Malware Detected", detail: "Trojan:Win32/Forge.gen!A", severity: "error", call: { method: "GET" as const, endpoint: "/threats", status: 200 } },
  { time: "09:05", title: "High Severity Alert", detail: "alert AL-88213 · severity 90", severity: "error", call: { method: "GET" as const, endpoint: "/alerts", status: 200 } },
  { time: "09:07", title: "Endpoint Isolated", detail: "DEV-2941 network contained", severity: "warning", call: { method: "PATCH" as const, endpoint: "/devices/DEV-2941/contain", status: 202 } },
  { time: "09:10", title: "Incident Created", detail: "INC-2841 assigned to SOC tier 2", severity: "info", call: { method: "POST" as const, endpoint: "/incidents", status: 201 } },
];

export const FOMO = [
  "Your integration passed normal testing. It hasn't survived failure testing yet.",
  "3 production risks haven't been tested.",
  "API schema changed since your last validation.",
  "Your integration handles 200 responses. What happens at 429?",
  "Competent integrations work in the happy path. Production-ready integrations survive the unhappy path.",
  "12 minutes of simulation can expose failures that otherwise appear in production.",
];

export function statusTone(status: number) {
  if (status >= 500) return "text-error";
  if (status === 429) return "text-warning";
  if (status >= 400) return "text-error";
  if (status >= 200 && status < 300) return "text-success";
  return "text-info";
}
