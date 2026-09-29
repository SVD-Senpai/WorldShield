import type { SecurityFinding, SecurityCheckItem } from '../types/finding';

export const INITIAL_CHECKS: SecurityCheckItem[] = [
  {
    id: 'chk-secrets',
    name: 'Secret Exposure Inspection',
    category: 'Secret Exposure',
    description: 'Scans source files, environment templates, and client bundles for hardcoded credentials or API tokens.',
    status: 'idle',
    findingCount: 0,
    details: 'Pattern matching for high-entropy tokens and private keys'
  },
  {
    id: 'chk-dangerous-code',
    name: 'Dangerous Code & Rendering Review',
    category: 'Input / Output Handling',
    description: 'Inspects DOM manipulation sinks (innerHTML, eval, Function constructor, unsafe HTML unescaping).',
    status: 'idle',
    findingCount: 0,
    details: 'AST/regex static scan for XSS and dynamic execution sinks'
  },
  {
    id: 'chk-client-storage',
    name: 'Client-Side Sensitive Storage Audit',
    category: 'Client-Side Security',
    description: 'Analyzes localStorage, sessionStorage, and IndexedDB operations handling sensitive auth tokens or user keys.',
    status: 'idle',
    findingCount: 0,
    details: 'Storage API hook detection in client application modules'
  },
  {
    id: 'chk-dependencies',
    name: 'Dependency Advisory & Manifest Audit',
    category: 'Dependency Security',
    description: 'Validates package.json lockfiles against known vulnerability databases and public security advisories.',
    status: 'idle',
    findingCount: 0,
    details: 'Dependency manifest comparison with known CVE advisories'
  },
  {
    id: 'chk-auth-session',
    name: 'Authentication & Session Surface Review',
    category: 'Authentication & Session',
    description: 'Audits cookie flags (SameSite, Secure, HttpOnly), session expiry, and bearer token lifecycle logic.',
    status: 'idle',
    findingCount: 0,
    details: 'Endpoint handler review for session token generation and verification'
  },
  {
    id: 'chk-authorization',
    name: 'Authorization & Access Control Surface',
    category: 'Authorization & Access Control',
    description: 'Inventories protected routes, role checks, and verifies absence of client-enforced authorization bypasses.',
    status: 'idle',
    findingCount: 0,
    details: 'Route guard and middleware verification on administrative operations'
  },
  {
    id: 'chk-api-ssrf',
    name: 'API Surface & Outbound Request Review',
    category: 'API Surface & SSRF',
    description: 'Analyzes outbound webhooks, RSS fetch proxies, and external API requests for RFC 1918 / SSRF guards.',
    status: 'idle',
    findingCount: 0,
    details: 'URL validation and internal IP filtering inspection on proxy endpoints'
  },
  {
    id: 'chk-security-config',
    name: 'Security Configuration & CORS Review',
    category: 'Security Configuration',
    description: 'Checks Content-Security-Policy (CSP), CORS allowed origin reflection, and HTTP security response headers.',
    status: 'idle',
    findingCount: 0,
    details: 'Vite config, middleware headers, and reverse proxy configuration audit'
  }
];

export const DEMO_FINDINGS: SecurityFinding[] = [
  {
    id: 'WS-001',
    title: 'Client-Side Sensitive Token Storage Review',
    severity: 'Medium',
    category: 'Client-Side Security',
    status: 'Needs Validation',
    affectedComponent: 'src/settings-main.ts (User Credentials & API Configuration)',
    location: 'src/settings-main.ts:142',
    description:
      'Static analysis identified client-side storage invocations (localStorage.setItem) persisting user-provided provider API keys and session identifiers in plaintext browser web storage. Because localStorage is accessible to any script executing in the document origin, any Cross-Site Scripting (XSS) defect could compromise these credentials.',
    evidence: [
      '// File: src/settings-main.ts:142',
      'const userApiKey = inputKeyElement.value.trim();',
      'if (userApiKey) {',
      '  localStorage.setItem("wm_custom_provider_key", userApiKey);',
      '  localStorage.setItem("wm_session_cache", JSON.stringify(sessionData));',
      '  logger.info("Saved provider key to local storage");',
      '}',
      'Observation: No encryption at rest or sessionStorage fallback with origin isolation was observed.'
    ],
    reproduction: [
      'Step 1: Open authorized local World Monitor instance at http://localhost:5173/settings.html',
      'Step 2: Enter an external intelligence provider API key into the Settings modal.',
      'Step 3: Open Browser Developer Tools → Application → Local Storage.',
      'Step 4: Verify key "wm_custom_provider_key" is stored in unencrypted plaintext.',
      'Expected behavior: Sensitive bearer credentials should be stored in memory or HttpOnly partitioned cookies.',
      'Observed behavior: Plaintext credential persisted in persistent localStorage across sessions.'
    ],
    impact:
      'Confidentiality Impact: Moderate. If an attacker discovers an XSS vector or a malicious third-party dependency executes in the origin, stored API tokens and session data can be extracted without user interaction.',
    remediation:
      '1. Migrate persistent long-lived API keys to secure backend session cookies with `HttpOnly; Secure; SameSite=Strict` attributes.\n2. If client-side persistence is unavoidable for self-hosted instances, use the Web Cryptography API (SubtleCrypto) with a user-supplied session passphrase or in-memory volatile state that clears on tab close.\n3. Add restrictive Content Security Policy (CSP) headers to prevent unauthorized exfiltration endpoints.',
    retest: {
      status: 'Not Tested',
      before: 'localStorage.setItem stores plaintext API credentials accessible to origin JavaScript.',
      after: ''
    },
    isDemo: true,
    severityReasoning: {
      attackPrecondition: 'Attacker must identify an origin-level script execution context (XSS or malicious dependency).',
      affectedAsset: 'Third-party intelligence provider API keys and client session tokens.',
      confidentialityImpact: 'High for affected client credential; zero impact on core server infrastructure.',
      integrityImpact: 'Low. Tokens allow querying external feeds as the user.',
      availabilityImpact: 'None directly to the local instance.',
      scopePrivilege: 'Restricted to privileges granted to the compromised provider API key.',
      exploitabilityEvidence: 'Demonstrated via manual browser storage inspection.',
      confidence: 'High'
    }
  },
  {
    id: 'WS-002',
    title: 'Unsafe HTML Rendering & Feed Sanitization Pattern',
    severity: 'High',
    category: 'Input / Output Handling',
    status: 'Needs Validation',
    affectedComponent: 'src/features/rss/feed-card.ts (Global Intelligence RSS Feed Parser)',
    location: 'src/features/rss/feed-card.ts:88',
    description:
      'Static review identified dynamic assignment of untrusted external RSS headline summaries and news descriptions directly to an element’s `innerHTML` sink without rigorous sanitizer schema enforcement. An untrusted news RSS feed could deliver malicious script payloads in CDATA blocks.',
    evidence: [
      '// File: src/features/rss/feed-card.ts:88',
      'const summaryHtml = item.description || item.summary || "";',
      'cardContentElement.innerHTML = `<div class="feed-summary">${summaryHtml}</div>`;',
      'Observation: No call to DOMPurify or sanitizeHtml() found preceding innerHTML assignment.'
    ],
    reproduction: [
      'Step 1: In a local test environment, configure a mock RSS feed endpoint delivering `<img src=x onerror=alert(1)>` in the `<description>` field.',
      'Step 2: Trigger World Monitor feed refresh in the tactical news dashboard.',
      'Step 3: Monitor DOM execution in local browser console.',
      'Expected behavior: HTML tags should either be stripped or sanitized through a strict whitelist (e.g., allow <b>, <i>, <a> only).',
      'Observed behavior: Raw payload injected into DOM tree.'
    ],
    impact:
      'Integrity & Confidentiality Impact: High. Arbitrary client-side script execution within the user session. An attacker with control over an external news feed source could execute actions in the user’s local dashboard, steal localStorage tokens, or trigger unauthorized webhook queries.',
    remediation:
      '1. Replace `innerHTML` with `textContent` where formatted markup is not strictly required.\n2. When rich formatting is necessary, sanitize all input using DOMPurify with an explicit safe-tag whitelist (e.g. `ALLOWED_TAGS: ["b", "i", "em", "strong", "a"]`, `ALLOWED_ATTR: ["href"]`).\n3. Enforce a robust Content-Security-Policy (CSP) that disables `unsafe-inline` scripts.',
    retest: {
      status: 'Not Tested',
      before: 'Unsanitized external feed summary passed directly into innerHTML sink.',
      after: ''
    },
    isDemo: true,
    severityReasoning: {
      attackPrecondition: 'Target must consume a compromised or attacker-controlled RSS/Atom feed source.',
      affectedAsset: 'Client execution context & active browser session.',
      confidentialityImpact: 'High within the local origin context.',
      integrityImpact: 'High for all client-rendered situational awareness cards.',
      availabilityImpact: 'Low to Moderate (could cause client tab crash or loop).',
      scopePrivilege: 'Full DOM execution privileges within origin.',
      exploitabilityEvidence: 'Pattern matched on raw innerHTML assignment in feed component.',
      confidence: 'Medium'
    }
  },
  {
    id: 'WS-003',
    title: 'Dependency Advisory Requiring Review',
    severity: 'Medium',
    category: 'Dependency Security',
    status: 'Potential',
    affectedComponent: 'package.json (External Networking / Parsing Libraries)',
    location: 'package.json:64',
    description:
      'Manifest audit detected transitive dependency versions matching public advisory disclosures (e.g. Prototype Pollution / ReDoS in legacy parser utility). Potential finding flagged for review against local attack surface; exploitability in World Monitor context has not yet been demonstrated.',
    evidence: [
      '// File: package.json / package-lock.json',
      'Component: "fast-xml-parser" resolved to ^4.2.4',
      'Advisory Reference: CVE-2023-45857 / GHSA-XX (Potential entity expansion / ReDoS risk on oversized feeds)',
      'Static signal: Version constraint in lockfile matches affected range prior to patch 4.3.2.'
    ],
    reproduction: [
      'Step 1: Run `npm audit` or equivalent dependency scanner on the repository root.',
      'Step 2: Inspect advisory report for package matching CVE-2023-45857.',
      'Step 3: Analyze whether World Monitor passes untrusted external XML documents into the vulnerable parsing path without length limits.'
    ],
    impact:
      'Availability Impact: Low to Moderate. An oversized or malformed XML feed payload could exhaust parser CPU time, leading to temporary unresponsive UI or worker thread blocking.',
    remediation:
      '1. Update dependency to latest stable release: `npm install fast-xml-parser@latest`.\n2. Impose strict payload size limits (e.g. maximum 2MB) before passing data to XML/RSS parsing routines.\n3. Add automated dependency vulnerability scanning in CI/CD pipeline.',
    retest: {
      status: 'Not Tested',
      before: 'Resolved dependency version matches public advisory range.',
      after: ''
    },
    isDemo: true,
    severityReasoning: {
      attackPrecondition: 'Attacker must supply an abnormally large or deeply nested XML feed payload.',
      affectedAsset: 'RSS/XML parsing worker or backend relay service.',
      confidentialityImpact: 'None.',
      integrityImpact: 'None.',
      availabilityImpact: 'Moderate (denial of service via thread exhaustion).',
      scopePrivilege: 'Unchanged.',
      exploitabilityEvidence: 'Version identifier match from package-lock.json.',
      confidence: 'Requires Human Verification'
    }
  },
  {
    id: 'WS-004',
    title: 'Outbound Webhook SSRF Guard Verification',
    severity: 'High',
    category: 'API Surface & SSRF',
    status: 'Needs Validation',
    affectedComponent: 'api/_notification-webhook-ssrf.ts (Alert Dispatcher)',
    location: 'api/_notification-webhook-ssrf.ts:45',
    description:
      'Static analysis flagged the outbound notification webhook dispatcher. While preliminary DNS validation logic exists, review is needed to verify whether IPv6 mapped IPv4 addresses (e.g. ::ffff:127.0.0.1) or cloud metadata IP addresses (169.254.169.254) are completely filtered against DNS rebinding attacks.',
    evidence: [
      '// File: api/_notification-webhook-ssrf.ts:45',
      'const parsedUrl = new URL(targetWebhookUrl);',
      'const hostIp = await dns.lookup(parsedUrl.hostname);',
      'if (hostIp.address.startsWith("10.") || hostIp.address.startsWith("192.168.")) {',
      '  throw new Error("Private subnet target blocked");',
      '}',
      'Observation: Check omits 127.0.0.0/8 loopback, 169.254.0.0/16 link-local, and IPv6 representations.'
    ],
    reproduction: [
      'Step 1: Deploy test alert webhook configuration specifying `http://169.254.169.254/latest/meta-data/` or `http://localhost:8080/internal-metrics`.',
      'Step 2: Trigger automated test notification dispatch via authorized admin endpoint.',
      'Step 3: Observe whether outbound HTTP client initiates request to loopback or link-local address.',
      'Expected behavior: Request immediately aborted with SSRF protection error.',
      'Observed behavior: Request permitted due to incomplete IP subnet blacklist.'
    ],
    impact:
      'Confidentiality & Access Control Impact: High. A server-side request forgery (SSRF) could allow an attacker who can configure webhook URLs to query internal cloud metadata services, container orchestrator APIs, or localhost background services.',
    remediation:
      '1. Implement a comprehensive CIDR blacklist encompassing all RFC 1918, RFC 3927 (link-local 169.254.x.x), RFC 1122 (loopback 127.x.x.x), and equivalent IPv6 CIDRs (::1, fe80::/10, ::ffff:0:0/96).\n2. Enforce DNS resolution pin before making the HTTP socket connection to protect against DNS rebinding (TOCTOU).\n3. Prohibit non-HTTP/HTTPS protocols and disable automatic redirection following.',
    retest: {
      status: 'Not Tested',
      before: 'Partial IP check allowed link-local and loopback addresses.',
      after: ''
    },
    isDemo: true,
    severityReasoning: {
      attackPrecondition: 'User with permission to configure alert notification webhooks.',
      affectedAsset: 'Internal network services & cloud host metadata service.',
      confidentialityImpact: 'High for internal metadata / network topology.',
      integrityImpact: 'Low to Moderate.',
      availabilityImpact: 'Low.',
      scopePrivilege: 'Elevated from authorized user to internal network scope.',
      exploitabilityEvidence: 'Code inspection of subnet matching logic.',
      confidence: 'Medium'
    }
  },
  {
    id: 'WS-005',
    title: 'Session Cookie Attribute & Expiry Review',
    severity: 'Medium',
    category: 'Authentication & Session',
    status: 'Needs Validation',
    affectedComponent: 'api/_session.js (Session State Manager)',
    location: 'api/_session.js:28',
    description:
      'Review of the session cookie serialization routine indicates that `SameSite=Lax` is applied without the explicit `Secure` flag in certain local/development deployments, and session rotation upon privilege alteration requires confirmation.',
    evidence: [
      '// File: api/_session.js:28',
      'res.setHeader("Set-Cookie", `wm_auth_token=${token}; Path=/; HttpOnly; SameSite=Lax`);',
      'Observation: `Secure` flag is conditionally skipped when protocol is not explicitly HTTPS.'
    ],
    reproduction: [
      'Step 1: Inspect Set-Cookie header emitted by authentication endpoints during local testing.',
      'Step 2: Check cookie flags for HttpOnly, Secure, and SameSite.',
      'Step 3: Test whether session token is preserved across privilege transitions.'
    ],
    impact:
      'Confidentiality Impact: Moderate. Lack of the Secure flag in production could lead to token transmission over unencrypted HTTP if user accesses dashboard over mixed networks.',
    remediation:
      '1. Ensure `Secure` flag is always enabled in production and staging builds.\n2. Consider `SameSite=Strict` for sensitive state-changing endpoints.\n3. Implement explicit session invalidation and re-issuance upon role modification.',
    retest: {
      status: 'Not Tested',
      before: 'Cookie emitted without Secure flag in non-HTTPS configurations.',
      after: ''
    },
    isDemo: true,
    severityReasoning: {
      attackPrecondition: 'Attacker in network path if unencrypted HTTP traffic is tolerated.',
      affectedAsset: 'Session authentication tokens.',
      confidentialityImpact: 'Moderate in mixed-network environments.',
      integrityImpact: 'Low.',
      availabilityImpact: 'None.',
      scopePrivilege: 'Session hijacking risk.',
      exploitabilityEvidence: 'Set-Cookie header inspection in static code analysis.',
      confidence: 'Medium'
    }
  },
  {
    id: 'WS-006',
    title: 'CORS Origin Reflection Configuration Review',
    severity: 'Low',
    category: 'Security Configuration',
    status: 'Potential',
    affectedComponent: 'api/_cors.js (Cross-Origin Resource Sharing Middleware)',
    location: 'api/_cors.js:32',
    description:
      'CORS middleware evaluates incoming Origin headers against an allowlist pattern. Static review identified regex matching patterns that require verification to ensure subdomains or lookalike origins (e.g. `worldmonitor.app.attacker.com`) cannot pass validation.',
    evidence: [
      '// File: api/_cors.js:32',
      'const origin = req.headers["origin"];',
      'if (origin && /worldmonitor\\.app/.test(origin)) {',
      '  res.setHeader("Access-Control-Allow-Origin", origin);',
      '  res.setHeader("Access-Control-Allow-Credentials", "true");',
      '}',
      'Observation: Regex lacks start (^) and end ($) boundary anchors.'
    ],
    reproduction: [
      'Step 1: Send HTTP OPTIONS / GET request to API with header `Origin: https://worldmonitor.app.attacker.com`.',
      'Step 2: Inspect returned `Access-Control-Allow-Origin` and `Access-Control-Allow-Credentials` headers.',
      'Step 3: Verify if arbitrary origin reflection occurs.'
    ],
    impact:
      'Confidentiality & Access Control Impact: Low to Moderate. An untrusted web origin matching the unanchored pattern could read sensitive authenticated API responses via cross-origin XMLHttpRequest/fetch.',
    remediation:
      '1. Anchor the regular expression strictly: `/^https:\\/\\/([a-z0-9-]+\\.)?worldmonitor\\.app$/`.\n2. Alternatively, use an explicit string array match rather than dynamic regex matching.\n3. Disallow credentials reflection unless origin is strictly on the trusted domain whitelist.',
    retest: {
      status: 'Not Tested',
      before: 'Unanchored regex /worldmonitor\\.app/ permitted substring origin matches.',
      after: ''
    },
    isDemo: true,
    severityReasoning: {
      attackPrecondition: 'Victim must visit an attacker site with a domain name containing "worldmonitor.app".',
      affectedAsset: 'API response confidentiality via CORS authenticated requests.',
      confidentialityImpact: 'Moderate within client browser session.',
      integrityImpact: 'Low.',
      availabilityImpact: 'None.',
      scopePrivilege: 'Cross-origin read access to user data.',
      exploitabilityEvidence: 'Regex pattern analysis in _cors.js.',
      confidence: 'High'
    }
  }
];
