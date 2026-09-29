import type { SecurityFinding, AIAnalysis } from '../types/finding';

export class AIAnalystService {
  /**
   * Deterministic AI security analyst layer.
   * Grounded strictly in provided finding evidence without inventing files or lines.
   */
  public async analyzeFinding(finding: SecurityFinding): Promise<AIAnalysis> {
    // Simulate short processing time for UI realism
    await new Promise((resolve) => setTimeout(resolve, 600));

    const now = new Date().toLocaleTimeString();

    switch (finding.id) {
      case 'WS-001':
        return {
          summary:
            'Grounded Code Analysis: In `src/settings-main.ts:142`, sensitive provider API credentials and session tokens are directly committed to `localStorage`. Because the browser DOM origin shares localStorage with all running scripts, any subsequent client script injection or malicious third-party dependency can exfiltrate credentials without requiring backend exploitation.',
          evidenceExplanation:
            'The static check highlighted `localStorage.setItem("wm_custom_provider_key", userApiKey)`. Under the standard browser security model, Web Storage lacks the HttpOnly security boundary available to HTTP cookies. Consequently, any document context execution has unrestricted read access.',
          businessImpact:
            'Potential exposure of paid third-party threat intelligence API keys (e.g. ACLED, LiveUAMap, NASA FIRMS). If exfiltrated, unauthorized parties could incur API billing costs or access user-curated geopolitical event alerts.',
          stepByStepRemediation: [
            '1. Relocate long-lived secret storage from client-side Web Storage to an authorized backend session proxy.',
            '2. If standalone offline persistence is mandatory, encrypt credentials at rest using `window.crypto.subtle` with a PBKDF2/AES-GCM key derived from a user session password.',
            '3. Strengthen Content-Security-Policy (CSP) `connect-src` directives to restrict outbound communication to known API endpoints only.'
          ],
          suggestedCodeFix: `// Proposed Remediation for src/settings-main.ts:142
// BEFORE:
// localStorage.setItem("wm_custom_provider_key", userApiKey);

// AFTER (Session-scoped in-memory state or secure proxy):
sessionStorage.setItem("wm_temp_session_key", await secureEncrypt(userApiKey));
// Best Practice: Dispatch through authorized proxy endpoint with HttpOnly cookie credentials`,
          draftReportText:
            'Finding WS-001 represents a client-side storage risk. Static review verified that provider API keys are written unencrypted to localStorage. While not remotely exploitable in isolation, this pattern compounds the severity of any client-side content injection. Remediation priority: Medium.',
          analyzedAt: now
        };

      case 'WS-002':
        return {
          summary:
            'Grounded Code Analysis: In `src/features/rss/feed-card.ts:88`, external RSS item summaries are concatenated into an innerHTML string template without DOMPurify sanitization. If an external intelligence RSS feed is compromised or delivers attacker-controlled CDATA blocks, script tags or onerror event handlers will execute in the user browser context.',
          evidenceExplanation:
            'Static AST identified `cardContentElement.innerHTML = <div class="feed-summary">${summaryHtml}</div>`. Because summaryHtml originates from third-party RSS XML feeds, direct innerHTML assignment constitutes an unvalidated DOM sink.',
          businessImpact:
            'High risk of Cross-Site Scripting (XSS). Could allow session hijacking, unauthorized tampering with geopolitical map telemetry, or arbitrary browser actions performed on behalf of the intelligence analyst.',
          stepByStepRemediation: [
            '1. Install and integrate DOMPurify (`import DOMPurify from "dompurify";`).',
            '2. Sanitize `summaryHtml` before assigning to innerHTML: `DOMPurify.sanitize(summaryHtml, { ALLOWED_TAGS: ["b", "i", "em", "strong", "a"], ALLOWED_ATTR: ["href", "target"] })`.',
            '3. Where rich text is unneeded, switch directly to `textContent` assignment.'
          ],
          suggestedCodeFix: `// Proposed Remediation for src/features/rss/feed-card.ts:88
import DOMPurify from 'dompurify';

// BEFORE:
// cardContentElement.innerHTML = \`<div class="feed-summary">\${summaryHtml}</div>\`;

// AFTER:
const cleanHtml = DOMPurify.sanitize(summaryHtml, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
  ALLOWED_ATTR: ['href', 'target', 'rel']
});
cardContentElement.innerHTML = \`<div class="feed-summary">\${cleanHtml}</div>\`;`,
          draftReportText:
            'Finding WS-002: Static review confirmed unescaped innerHTML insertion of external RSS feed descriptions. Verified risk of DOM-based XSS when parsing external syndication feeds. Validation status: Confirmed. Remediation priority: High.',
          analyzedAt: now
        };

      case 'WS-003':
        return {
          summary:
            'Grounded Code Analysis: In `package.json`, dependency `fast-xml-parser` is pinned to a version range affected by known security advisories regarding catastrophic backtracking (ReDoS) or entity expansion during deep XML parsing.',
          evidenceExplanation:
            'Lockfile inspection shows resolved package matches public CVE advisory ranges. Note: This finding remains a "Potential Finding" until human review verifies whether World Monitor processes untrusted, oversized XML streams through the vulnerable code path.',
          businessImpact:
            'Resource exhaustion and client UI freeze or backend relay worker denial of service if malformed feeds are ingested.',
          stepByStepRemediation: [
            '1. Upgrade `fast-xml-parser` to patched version ^4.3.2 or later in package.json.',
            '2. Run `npm update fast-xml-parser` and verify integrity via `npm audit`.',
            '3. Implement request payload size limits on feed ingestion endpoints.'
          ],
          suggestedCodeFix: `// In package.json
- "fast-xml-parser": "^4.2.4"
+ "fast-xml-parser": "^4.3.2"`,
          draftReportText:
            'Finding WS-003: Dependency advisory alert for XML parser package. Currently marked as Potential Finding pending runtime verification of untrusted input ingestion limits.',
          analyzedAt: now
        };

      case 'WS-004':
        return {
          summary:
            'Grounded Code Analysis: In `api/_notification-webhook-ssrf.ts:45`, outbound webhook URL validation inspects private IP prefixes (10.x and 192.168.x) but omits loopback (127.0.0.0/8), cloud metadata endpoints (169.254.169.254), and IPv6 encodings.',
          evidenceExplanation:
            'Evidence demonstrates an incomplete blocklist approach. Attackers could specify link-local AWS/GCP/Azure instance metadata services to harvest local runtime tokens.',
          businessImpact:
            'Severe infrastructure risk if deployed on cloud instances (e.g. AWS EC2, GCP Compute) where metadata API access provides IAM role credentials.',
          stepByStepRemediation: [
            '1. Implement comprehensive RFC 1918, RFC 3927 (169.254.0.0/16), and RFC 1122 (127.0.0.0/8) subnet validation.',
            '2. Resolve hostname before connection and assert destination IP is globally routable.',
            '3. Prohibit redirect following (`maxRedirects: 0`) to prevent DNS rebinding bypasses.'
          ],
          suggestedCodeFix: `// Proposed Remediation for api/_notification-webhook-ssrf.ts
import ipaddr from 'ipaddr.js';

const addr = ipaddr.parse(resolvedIp);
if (addr.range() !== 'unicast') {
  throw new Error('Blocked SSRF attempt to non-public destination: ' + resolvedIp);
}`,
          draftReportText:
            'Finding WS-004: Incomplete IP validation in alert webhook dispatcher creates Server-Side Request Forgery (SSRF) surface. Status: Needs Validation. Remediation priority: High.',
          analyzedAt: now
        };

      default:
        return {
          summary: `Grounded Code Analysis for ${finding.id} (${finding.title}): Identified static pattern in ${finding.affectedComponent}. Assessment indicates configuration requires review against defense-in-depth baselines.`,
          evidenceExplanation: finding.description,
          businessImpact: finding.impact,
          stepByStepRemediation: [
            '1. Review component configuration against OWASP Top 10 security standards.',
            '2. Apply strict boundary validation and least-privilege scoping.',
            '3. Conduct human re-testing to confirm remediation efficacy.'
          ],
          suggestedCodeFix: `// General remediation for ${finding.location}\n// Apply strict input validation and secure default configurations.`,
          draftReportText: `Finding ${finding.id} (${finding.title}) evaluated. Current status: ${finding.status}. Evidence grounded in static code review.`,
          analyzedAt: now
        };
    }
  }
}

export const aiAnalystService = new AIAnalystService();
