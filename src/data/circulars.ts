import type { Circular } from "../types/circular";

export const circulars: Circular[] = [
  {
    id: "1",
    date: "2026-06-19",
    regulator: "RBI",
    industry: "Banking",
    category: "KYC / Compliance",
    title: "Updated KYC Guidelines",
    circularNumber: "RBI/2026-27/001",
    impactLevel: "High",
    effectiveDate: "Immediate",
    deadline: "30 days from circular date",
    impactedEntities: ["Banks", "NBFCs", "Payment Aggregators", "Fintechs"],
    summary: "RBI has updated KYC requirements for regulated entities.",
    businessImpact:
      "Banks, NBFCs and fintech companies may need to update customer onboarding, verification checks and internal SOPs.",
    actionRequired:
      "Review existing KYC flow, update compliance checklist, train operations teams and monitor implementation.",
    resolutionSteps: [
      "Read the official circular",
      "Identify impacted products and teams",
      "Update internal SOP",
      "Train operations and support teams",
      "Track closure before deadline",
    ],
    sourceUrl: "https://www.rbi.org.in/",
  },
  {
    id: "2",
    date: "2026-06-19",
    regulator: "SEBI",
    industry: "Capital Markets",
    category: "Broker Compliance",
    title: "Broker Reporting Changes",
    circularNumber: "SEBI/HO/MIRSD/2026/002",
    impactLevel: "Medium",
    effectiveDate: "2026-07-01",
    deadline: "2026-07-15",
    impactedEntities: ["Stock Brokers", "Depository Participants", "Investors"],
    summary: "SEBI updated reporting process for market intermediaries.",
    businessImpact:
      "Brokers may need to update reporting systems, compliance workflows and investor communication processes.",
    actionRequired:
      "Review current reporting process and align internal systems with SEBI requirements.",
    resolutionSteps: [
      "Check circular requirements",
      "Update reporting format",
      "Inform compliance team",
      "Test changes",
      "Submit reports within timeline",
    ],
    sourceUrl: "https://www.sebi.gov.in/",
  },
  {
    id: "3",
    date: "2026-06-18",
    regulator: "NPCI",
    industry: "Payments",
    category: "UPI Operations",
    title: "UPI Monitoring Framework",
    circularNumber: "NPCI/UPI/2026/003",
    impactLevel: "Critical",
    effectiveDate: "Immediate",
    deadline: "15 days from circular date",
    impactedEntities: ["Banks", "TPAPs", "Payment Apps", "Merchants"],
    summary: "NPCI released new UPI monitoring guidelines.",
    businessImpact:
      "Banks and payment apps may need enhanced transaction monitoring, fraud checks and operational reporting.",
    actionRequired:
      "Update UPI monitoring rules, review transaction risk checks and coordinate with bank partners.",
    resolutionSteps: [
      "Review UPI monitoring rules",
      "Update fraud detection parameters",
      "Coordinate with bank partners",
      "Test in staging",
      "Deploy after approval",
    ],
    sourceUrl: "https://www.npci.org.in/",
  },
];