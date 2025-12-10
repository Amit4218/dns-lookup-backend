import express from "express";
import cors from "cors";
import { config } from "dotenv";
import dns from "dns/promises";

config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
  })
);

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

export const dnsResolvers = {
  A: dns.resolve4,
  AAAA: dns.resolve6,
  CAA: dns.resolveCaa,
  CNAME: dns.resolveCname,
  MX: dns.resolveMx,
  NS: dns.resolveNs,
  PTR: dns.resolvePtr,
  SOA: dns.resolveSoa,
  TXT: dns.resolveTxt,
  SRV: dns.resolveSrv,
};

app.get("/api/:record", async (req, res) => {
  try {
    const { record } = req.params;
    const { domain } = req.query;

    if (!RECORD_TYPES.includes(record)) {
      return res.status(400).json({
        error: "Invalid DNS record type",
        allowed: RECORD_TYPES,
      });
    }

    if (!domain) {
      return res.status(400).json({ error: "Domain query is required" });
    }

    const resolver = dnsResolvers[record];

    const result = await resolver(domain);

    res.json({
      record,
      domain,
      result,
    });
  } catch (err) {
    console.error("DNS Error:", err);
    res.status(500).json({
      error: "Failed to resolve DNS record",
      details: err.message,
    });
  }
});
app.get("/root", (req, res) => {
  return res.status(200).json({ message: "application working" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`App running at http://localhost:${port}`);
  });
}
