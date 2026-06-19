import Parser from "rss-parser";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const parser = new Parser({
  customFields: {
    item: ["link", "pubDate", "title", "contentSnippet"],
  },
});

function getPublishedDate(item) {
  const rawDate = item.isoDate || item.pubDate;

  if (!rawDate) {
    return new Date().toISOString().split("T")[0];
  }

  const parsedDate = new Date(rawDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return new Date().toISOString().split("T")[0];
  }

  return parsedDate.toISOString().split("T")[0];
}

function isValidCircularItem(item) {
  if (!item) return false;

  const title = item.title || "";
  const link = item.link || "";

  if (!title || !link) return false;

  return (
    link.includes("sebi.gov.in") &&
    (
      link.includes("/legal/circulars/") ||
      title.toLowerCase().includes("circular")
    )
  );
}

function buildCircular(item) {
  const title = item.title || "SEBI Circular";
  const sourceUrl = item.link || "";

  return {
    regulator: "SEBI",
    industry: "Capital Markets",
    category: "Circular",
    title,
    circular_number: "To be reviewed",
    published_date: getPublishedDate(item),
    effective_date: "To be reviewed",
    deadline: "To be reviewed",
    impact_level: "Medium",
    impacted_entities: ["Stock Brokers", "Investors", "Market Intermediaries"],
    summary:
      "This SEBI circular has been automatically fetched from the official SEBI feed. The detailed compliance impact should be reviewed by the compliance team.",
    business_impact:
      "Capital market intermediaries should review this circular for possible impact on reporting, operations, investor communication, system changes, risk controls or compliance monitoring.",
    action_required:
      "Open the official circular, read the applicability section, identify impacted teams, update SOPs where required and track implementation closure.",
    resolution_steps: [
      "Open official circular",
      "Review applicability",
      "Identify impacted business processes",
      "Assign compliance owner",
      "Update SOP or system logic if required",
      "Track closure evidence"
    ],
    source_url: sourceUrl,
    pdf_url: sourceUrl,
    compliance_risk:
      "Medium risk until the circular is reviewed and mapped to internal processes.",
    internal_teams: ["Compliance", "Operations", "Technology"],
    system_changes:
      "System changes, if any, should be assessed after reviewing the official circular.",
    customer_impact:
      "Customer impact should be assessed based on applicability to the intermediary or product.",
    non_compliance_risk:
      "Non-compliance may result in regulatory observations, inspection remarks, reporting gaps or operational follow-up.",
    source_type: "SEBI_RSS",
    fetched_at: new Date().toISOString(),
    has_exact_source: true,
    has_exact_pdf: true,
  };
}

async function fetchSebiCirculars() {
  try {
    console.log("Fetching SEBI circulars...");

    const feed = await parser.parseURL("https://www.sebi.gov.in/sebirss.xml");

    const items = Array.isArray(feed.items) ? feed.items : [];

    console.log(`RSS items received: ${items.length}`);

    const circulars = items
      .filter(isValidCircularItem)
      .slice(0, 100)
      .map(buildCircular)
      .filter((item) => item.source_url);

    console.log(`Valid SEBI circulars found: ${circulars.length}`);

    if (circulars.length === 0) {
      console.log("No valid SEBI circulars found. Nothing inserted.");
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
    console.error("SEBI fetch failed:", error.message);
    process.exit(1);
  }
}

fetchSebiCirculars();