import assert from "node:assert/strict";
import { dnsResolvers } from "../index.js";
import test from "node:test";

test("A Record test", async () => {
  const resolver = dnsResolvers["A"];
  const result = await resolver("amit4218.fun");

  assert.ok(Array.isArray(result));
  assert.ok(result.every((ip) => typeof ip === "string"));
});

test("AAAA Record test", async () => {
  const resolver = dnsResolvers["AAAA"];
  const result = await resolver("amit4218.fun");

  assert.ok(Array.isArray(result));
  assert.ok(result.every((ip) => typeof ip === "string"));
});

test("CNAME Record test", async () => {
  const resolver = dnsResolvers["CNAME"];
  const result = await resolver("dnslookup.amit4218.fun");

  assert.deepStrictEqual(
    {
      record: "CNAME",
      domain: "dnslookup.amit4218.fun",
      result,
    },
    {
      record: "CNAME",
      domain: "dnslookup.amit4218.fun",
      result: ["dns-lookup-fe.onrender.com"],
    }
  );
});

test("MX Record test", async () => {
  const resolver = dnsResolvers["MX"];
  const result = await resolver("amit4218.fun");

  assert.ok(Array.isArray(result));
  result.forEach((r) => {
    assert.equal(typeof r.exchange, "string");
    assert.equal(typeof r.priority, "number");
  });
});

test("CAA Record test", async () => {
  const resolver = dnsResolvers["CAA"];
  const result = await resolver("amit4218.fun");

  assert.ok(Array.isArray(result));
  result.forEach((r) => {
    assert.equal(typeof r.critical, "number");
    assert.ok("issue" in r || "issuewild" in r);
  });
});

test("NS Record test", async () => {
  const resolver = dnsResolvers["NS"];
  const result = await resolver("amit4218.fun");

  assert.ok(Array.isArray(result));
  assert.ok(result.every((ns) => typeof ns === "string"));
});

test("PTR Record test", async () => {
  const resolver = dnsResolvers["PTR"];
  const result = await resolver("41.137.120.34.in-addr.arpa");

  assert.ok(Array.isArray(result));
  assert.ok(result.every((ptr) => typeof ptr === "string"));
});

test("SOA Record test", async () => {
  const resolver = dnsResolvers["SOA"];
  const result = await resolver("amit4218.fun");

  assert.ok(typeof result === "object");
  assert.equal(typeof result.nsname, "string");
  assert.equal(typeof result.hostmaster, "string");
  assert.equal(typeof result.serial, "number");
});

test("TXT Record test", async () => {
  const resolver = dnsResolvers["TXT"];
  const result = await resolver("amit4218.fun");

  assert.ok(Array.isArray(result));
  result.forEach((r) => assert.ok(Array.isArray(r)));
});

test("SRV Record test", async () => {
  const resolver = dnsResolvers["SRV"];
  const result = await resolver("dnslookup.amit4218.fun");

  assert.ok(Array.isArray(result));
});
