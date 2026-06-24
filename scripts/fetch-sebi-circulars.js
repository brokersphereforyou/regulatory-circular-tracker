import WebSocket from "ws";
global.WebSocket = WebSocket;

import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SEBI_LISTING_URL =
  "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&smid=0&ssid=7";

const SEBI_BASE_URL = "https://www.sebi.gov.in";

function cleanText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function toAbsoluteUrl(url) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${SEBI_BASE_URL}${url}`;
  return `${SEBI_BASE_URL}/${url}`;
}

function parseSebiDate(rawDate) {
  const text = cleanText(rawDate);

  if (!text) return new Date().toISOString().split("T")[0];

  const parsed = new Date(text);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return new Date().toISOString().split("T")[0];
}

function estimateImpact(title) {
  const lower = title.toLowerCase();

  if (
    lower.includes("cyber") ||
    lower.includes("risk") ||
    lower.includes("compliance") ||
    lower.includes("reporting") ||
    lower.includes("investor protection") ||
    lower.includes("settlement")
  ) {
    return "High";
  }

  if (
    lower.includes("framework") ||
    lower.includes("master circular") ||
    lower.includes("intermediaries")
  ) {
    return "High";
  }

  return "Medium";
}

function detectEntities(title) {
  const lower = title.toLowerCase();
  const entities = new Set(["Market Intermediaries"]);

  if (lower.includes("stock broker") || lower.includes("broker")) {
    entities.add("Stock Brokers");
  }

  if (lower.includes("mutual fund") || lower.includes("amc")) {
    entities.add("Mutual Funds");
    entities.add("AMCs");
  }

  if (lower.includes("investment adviser")) {
    entities.add("Investment Advisers");
  }

  if (lower.includes("research analyst")) {
    entities.add("Research Analysts");
  }

  if (lower.includes("depository")) {
    entities.add("Depositories");
    entities.add("Depository Participants");
  }

  if (lower.includes("clearing")) {
    entities.add("Clearing Corporations");
  }

  if (lower.includes("exchange")) {
    entities.add("Stock Exchanges");
  }

  if (lower.includes("investor")) {
    entities.add("Investors");
  }

  return Array.from(entities);
}

function buildCircular({ title, date, sourceUrl }) {
  const impact = estimateImpact(title);
  const impactedEntities = detectEntities(title);

  return {
    regulator: "SEBI",
    industry: "Capital Markets",
    category: "Circular",
    title,
    circular_number: "To be reviewed",
    published_date: parseSebiDate(date),
    effective_date: "To be reviewed",
    deadline: "To be reviewed",
    impact_level: impact,
    impacted_entities: impactedEntities,
    summary:
      `${title}. This circular has been fetched from SEBI's official circular listing page. The compliance team should review the official source to confirm applicability, circular number, effective date, and exact regulatory obligations.`,
    business_impact:
      "This circular may impact regulated capital market participants depending on applicability. Potential areas include reporting obligations, compliance monitoring, internal SOP updates, investor communication, operational controls, system validations, audit evidence and regulatory submissions.",
    action_required:
      "Review the official SEBI circular, identify applicable business lines, assign a compliance owner, map the circular against existing SOPs, check whether technology or reporting changes are required, communicate changes to relevant teams and track implementation closure.",
    resolution_steps: [
      "Open official SEBI circular",
      "Confirm circular number and applicability",
      "Identify impacted products, processes and entities",
      "Assign compliance owner",
      "Review SOP, reporting and system changes",
      "Implement required changes",
      "Maintain audit trail and closure evidence",
    ],
    source_url: sourceUrl,
    pdf_url: sourceUrl,
    compliance_risk:
      "Medium to high risk depending on applicability. Delay in review or implementation can lead to regulatory observations, inspection remarks, reporting gaps or compliance breaches.",
    internal_teams: ["Compliance", "Operations", "Technology", "Business", "Risk"],
    system_changes:
      "System changes should be assessed after reviewing the official circular. Possible changes may include reporting logic, dashboard updates, validation rules, audit trails, customer communication or workflow changes.",
    customer_impact:
      "Customer or investor impact should be assessed based on the circular. Some circulars may require disclosure changes, process changes, additional checks, updated communication or revised timelines.",
    non_compliance_risk:
      "Failure to comply may result in regulatory observations, penalties, additional reporting, audit findings, operational restrictions or reputational risk.",
    source_type: "SEBI_DIRECT_LISTING",
    fetched_at: new Date().toISOString(),
    has_exact_source: true,
    has_exact_pdf: true,
  };
}

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
  }

  return response.text();
}

async function fetchSebiCirculars() {
  try {
    console.log("Fetching SEBI circulars from listing page...");
    console.log(SEBI_LISTING_URL);

    const html = await fetchPage(SEBI_LISTING_URL);
    const $ = cheerio.load(html);

    const candidates = [];

    $("a").each((_, element) => {
      const title = cleanText($(element).text());
      const href = $(element).attr("href");

      if (!title || !href) return;

      const sourceUrl = toAbsoluteUrl(href);

      const isCircular =
        sourceUrl.includes("sebi.gov.in") &&
        sourceUrl.includes("/legal/circulars/") &&
        sourceUrl.endsWith(".html");

      if (!isCircular) return;

      const rowText = cleanText($(element).closest("tr, li, div").text());
      const dateMatch =
        rowText.match(/[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}/) ||
        rowText.match(/\d{1,2}\s+[A-Z][a-z]{2}\s+\d{4}/);

      candidates.push({
        title,
        sourceUrl,
        date: dateMatch ? dateMatch[0] : "",
      });
    });

    const uniqueMap = new Map();

    for (const item of candidates) {
      if (!uniqueMap.has(item.sourceUrl)) {
        uniqueMap.set(item.sourceUrl, item);
      }
    }

    const circulars = Array.from(uniqueMap.values())
      .slice(0, 100)
      .map(buildCircular);

    console.log(`SEBI circulars found: ${circulars.length}`);

    if (circulars.length === 0) {
      console.log("No SEBI circulars found. Nothing inserted.");
      return;
    }

    const { error } = await supabase
      .from("circulars")
      .upsert(circulars, { onConflict: "source_url" });

    if (error) {
      console.error("Supabase insert error:", error);
      process.exit(1);
    }

    console.log(`Inserted/updated ${circulars.length} SEBI circulars successfully.`);
  } catch (error) {
    console.error("SEBI fetch failed:", error);
    process.exit(1);
  }
}

fetchSebiCirculars();