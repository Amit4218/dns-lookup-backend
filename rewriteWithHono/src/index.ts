import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dns from "dns/promises";

const RECORD_TYPES = [
  "A",
  "AAAA",
  "CAA",
  "CNAME",
  "MX",
  "NS",
  "PTR",
  "SOA",
  "TXT",
  "SRV",
];

function dnsResolver(domain: string, record: string) {
  switch (domain) {
    case "A":
      return dns.resolve4(domain);
    case "AAAA":
      return dns.resolve6(domain);
    case "CAA":
      return dns.resolveCaa(domain);
    case "CNAME":
      return dns.resolveCname(domain);
    case "MX":
      return dns.resolveMx(domain);
    case "NS":
      return dns.resolveNs(domain);
    case "PTR":
      return dns.reverse(domain);
    case "SRV":
      return dns.resolveSrv(domain);
    case "TXT":
      return dns.resolveTxt(domain);
    case "SOA":
      return dns.resolveSoa(domain);
    default:
      return "No Results Found!";
  }
}

const app = new Hono();

app.get("/root", (c) => {
  return c.json({
    success: true,
    message: "server is running",
  });
});

app.get("/api/:record", (c) => {
  const { record } = c.req.param("record");
  const { domain } = c.req.query("domain");

  if (!RECORD_TYPES.includes(record)) {
    return c.json({
      error: "Invalid DNS record type",
      allowed: RECORD_TYPES,
    });
  }

  if (!domain) {
    return c.json({ error: "Domain query is required" });
  }

  const result = dnsResolver(domain, record);

  c.json({
    record,
    domain,
    result,
  });
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
