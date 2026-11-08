# web-risk-ai

web-risk-ai is a learning project that combines passive web security checks with risk management. Given a public URL, it inspects publicly visible security signals (HTTP security headers, cookie flags and third-party scripts), maps each finding to NIST CSF 2.0 controls, and produces a risk register with likelihood, impact, risk level and a recommended treatment (mitigate, accept, transfer or avoid). An LLM assists with the mapping and the wording, but the final decision always belongs to a human.

## Status

Work in progress. Currently implemented:

- Security header check: `Strict-Transport-Security`, `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options` (reports whether each header is present or missing).

Planned: risk register entries per finding, cookie flags, third-party scripts, LLM-assisted control mapping, Markdown report.

## Usage

Requires Node.js 18+ (uses the built-in `fetch`).

```bash
node src/index.js https://example.com
```

Example output:

```
Status: 200

MISSING HSTS
MISSING CSP
MISSING X-Content-Type-Options
MISSING X-Frame-Options
```

## Responsible use

- **Passive only.** The tool sends a single normal `GET` request, the same as a browser visit. No exploitation, brute force, fuzzing or credential testing.
- **Honest identification.** Requests use the User-Agent `web-risk-ai/0.1 (passive security header check)` and a 10-second timeout.
- **http(s) only.** Other schemes are rejected.
- **Indicators, not proof.** A present header can still be misconfigured, and a missing one may be compensated by other controls. Results need human review.
- **No secrets in prompts.** Never send secrets or real user data to the LLM.

## License

MIT
