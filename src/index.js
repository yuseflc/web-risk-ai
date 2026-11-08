// Arguments after "web-risk-ai": argv[0] is node, argv[1] is this file,
// so user input starts at index 2.
const url = process.argv[2];

if(!url) {
    console.log("Usage: web-risk-ai https://example.com");
    process.exit(1);
}

// Only accept http(s) URLs, so the tool can't be pointed at local files.
if (!/^https?:\/\//i.test(url)) {
  console.log("Error: the URL must start with http:// or https://");
  process.exit(1);
}

const CHECKS = [
  { header: "strict-transport-security", name: "HSTS" },
  { header: "content-security-policy", name: "CSP" },
  { header: "x-content-type-options", name: "X-Content-Type-Options" },
  { header: "x-frame-options", name: "X-Frame-Options" },
];

// One passive GET request, like a normal browser visit.
// We identify ourselves honestly and set a timeout so we never hang.
// `let` outside the try, because we use `res` after the block.
let res;
try {
  res = await fetch(url, {
    headers: { "User-Agent": "web-risk-ai/0.1 (passive security header check)" },
    signal: AbortSignal.timeout(10_000),
  });
} catch (err) {
  // fetch throws on network-level failures (no HTTP response at all).
  // Translate the common cases into a readable message instead of a stack trace.
  if (err.name === "TimeoutError") {
    console.log("Error: no response within 10 seconds.");
  } else if (err.cause?.code === "ENOTFOUND") {
    console.log("Error: domain not found (DNS lookup failed).");
  } else {
    console.log(`Error: request failed (${err.cause?.code ?? err.message}).`);
  }
  process.exit(1);
}
console.log(`Status: ${res.status}\n`);

for (const check of CHECKS) {
  const present = res.headers.has(check.header);
  console.log(`${present ? "OK     " : "MISSING"} ${check.name}`);
}