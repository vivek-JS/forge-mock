// Demo/sample data for the Log Forge concept prototype.
// Every number and vendor reference here is synthetic sample data.

export type Category =
  | "Endpoint"
  | "Network"
  | "IoT"
  | "SecOps"
  | "Platform Suite"
  | "Risk & Compliance"
  | "Access Management"
  | "Cloud Security"
  | "Threat Intel"
  | "AppSec";

export type Platform = {
  id: string;
  name: string;
  kind: string;
  category: Category;
  endpoints: number;
  auth: string;
  mock: boolean;
  liveLab: boolean;
  /** synthetic baseline requests-per-second used by the live grid */
  baseRps: number;
};

const P = (
  id: string,
  name: string,
  category: Category,
  kind: string,
  endpoints: number,
  auth: string,
  mock = true,
  liveLab = false,
): Platform => ({ id, name, kind, category, endpoints, auth, mock, liveLab, baseRps: 4 + (endpoints % 17) });

export const PLATFORMS: Platform[] = [
  P("crowdstrike", "CrowdStrike", "Endpoint", "EDR / XDR", 148, "OAuth2 client credentials", true, true),
  P("sentinelone", "SentinelOne", "Endpoint", "EDR / XDR", 88, "API token", true, true),
  P("defender", "Microsoft Defender", "Endpoint", "EDR / XDR", 121, "Entra ID / OAuth2", true, true),
  P("tanium", "Tanium", "Endpoint", "Endpoint Management", 67, "API token"),
  P("trendmicro", "Trend Micro", "Endpoint", "Endpoint Protection", 59, "API key"),
  P("cybereason", "Cybereason", "Endpoint", "EDR", 44, "Session auth"),

  P("paloalto", "Palo Alto Networks", "Network", "NGFW / Platform", 74, "API key", true, true),
  P("zscaler", "Zscaler", "Network", "SASE / Proxy", 58, "API key + session"),
  P("fortinet", "Fortinet", "Network", "NGFW / Fabric", 91, "API token"),
  P("cisco", "Cisco", "Network", "Network Security", 132, "OAuth2"),
  P("f5", "F5 Networks", "Network", "App Delivery", 47, "Basic + token"),
  P("aruba", "Aruba Networks", "Network", "NAC / Wireless", 39, "API key"),
  P("extrahop", "ExtraHop", "Network", "NDR", 41, "API key"),
  P("darktrace", "DarkTrace", "Network", "NDR / AI", 53, "API token"),
  P("vectra", "Vectra", "Network", "NDR", 36, "API token"),

  P("armis", "Armis", "IoT", "OT / IoT Visibility", 33, "API secret"),
  P("cylus", "Cylus", "IoT", "Rail OT Security", 21, "API key"),
  P("claroty", "Claroty", "IoT", "OT / ICS", 29, "API token"),

  P("servicenow", "ServiceNow", "SecOps", "ITSM / SecOps", 118, "OAuth2", true, true),
  P("torq", "Torq", "SecOps", "SOAR / Automation", 38, "API key"),
  P("xsoar", "Cortex XSOAR", "SecOps", "SOAR", 45, "API key"),
  P("devo", "Devo", "SecOps", "Log Analytics", 51, "Bearer token"),
  P("mandiant", "Mandiant", "SecOps", "IR / Intel", 34, "API key"),

  P("splunk", "Splunk", "Platform Suite", "SIEM / Observability", 112, "Bearer token", true, true),
  P("sentinel", "Microsoft Sentinel", "Platform Suite", "SIEM", 96, "Entra ID / OAuth2", true, true),
  P("qradar", "IBM QRadar", "Platform Suite", "SIEM", 83, "SEC token"),
  P("exabeam", "Exabeam", "Platform Suite", "UEBA / SIEM", 62, "API token"),
  P("logrhythm", "LogRhythm", "Platform Suite", "SIEM", 57, "API key"),
  P("elastic", "Elastic Security", "Platform Suite", "SIEM / Search", 104, "API key", true, true),
  P("trellix", "Trellix", "Platform Suite", "XDR", 71, "OAuth2"),
  P("rapid7", "Rapid7", "Platform Suite", "VM / SIEM", 66, "API key"),
  P("tenable", "Tenable", "Platform Suite", "Vulnerability Mgmt", 73, "Access + secret key"),
  P("qualys", "Qualys", "Platform Suite", "Vulnerability Mgmt", 69, "Basic auth"),

  P("attackiq", "AttackIQ", "Risk & Compliance", "Breach Simulation", 27, "API token"),
  P("safebreach", "SafeBreach", "Risk & Compliance", "Breach Simulation", 24, "API key"),
  P("jupiterone", "JupiterOne", "Risk & Compliance", "Asset Graph", 42, "API key"),
  P("cycognito", "CyCognito", "Risk & Compliance", "EASM", 31, "API token"),

  P("okta", "Okta", "Access Management", "Identity", 64, "SSWS / OAuth2", true, true),
  P("entra", "Entra ID", "Access Management", "Identity", 91, "OAuth2", true, true),
  P("auth0", "Auth0", "Access Management", "CIAM", 58, "OAuth2"),
  P("beyondtrust", "BeyondTrust", "Access Management", "PAM", 43, "OAuth2"),
  P("cyberark", "CyberArk", "Access Management", "PAM", 61, "API token"),
  P("silverfort", "SilverFort", "Access Management", "MFA / ITDR", 26, "API key"),

  P("wiz", "Wiz", "Cloud Security", "CNAPP", 52, "OAuth2", true, true),
  P("orca", "Orca Security", "Cloud Security", "CNAPP", 46, "API token"),
  P("lacework", "LaceWork", "Cloud Security", "CNAPP", 44, "API key + secret"),
  P("gcpscc", "Google Security Center", "Cloud Security", "CSPM", 40, "Service account"),
  P("zerofox", "ZeroFox", "Cloud Security", "Digital Risk", 22, "API token"),

  P("threatq", "ThreatQuotient", "Threat Intel", "TIP", 35, "OAuth2"),
  P("anomali", "Anomali", "Threat Intel", "TIP", 32, "API key"),
  P("flashpoint", "FlashPoint", "Threat Intel", "Intel Feed", 19, "API token"),
  P("recordedfuture", "Recorded Future", "Threat Intel", "Intel Feed", 37, "API token"),

  P("snyk", "Snyk", "AppSec", "SCA / SAST", 49, "API token", true, true),
  P("hackerone", "HackerOne", "AppSec", "Bug Bounty", 23, "Basic auth"),
  P("veracode", "Veracode", "AppSec", "SAST / DAST", 38, "HMAC"),
];

export const CATEGORIES: Array<"All" | Category> = [
  "All",
  "Endpoint",
  "Network",
  "IoT",
  "SecOps",
  "Platform Suite",
  "Risk & Compliance",
  "Access Management",
  "Cloud Security",
  "Threat Intel",
  "AppSec",
];

/** Category tint tokens defined in src/styles.css */
export const CATEGORY_TINT: Record<Category, string> = {
  Endpoint: "var(--cat-endpoint)",
  Network: "var(--cat-network)",
  IoT: "var(--cat-iot)",
  SecOps: "var(--cat-secops)",
  "Platform Suite": "var(--cat-suite)",
  "Risk & Compliance": "var(--cat-risk)",
  "Access Management": "var(--cat-access)",
  "Cloud Security": "var(--cat-cloud)",
  "Threat Intel": "var(--cat-intel)",
  AppSec: "var(--cat-appsec)",
};

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
  const pick = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)] ?? ENDPOINTS[0]!;
  const [method, endpoint] = pick;
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
  "Your competitor already shipped the integration you are still waiting on credentials for.",
  "The bug is already in your code. Simulation just decides who finds it first — you or your customer.",
];

export function statusTone(status: number) {
  if (status >= 500) return "text-error";
  if (status === 429) return "text-warning";
  if (status >= 400) return "text-error";
  if (status >= 200 && status < 300) return "text-success";
  return "text-info";
}
