export type Circular = {
  id: string;
  date: string;
  regulator: string;
  industry: string;
  category: string;
  title: string;
  circularNumber: string;
  impactLevel: "Low" | "Medium" | "High" | "Critical";
  effectiveDate: string;
  deadline: string;
  impactedEntities: string[];
  summary: string;
  businessImpact: string;
  actionRequired: string;
  resolutionSteps: string[];
  sourceUrl: string;
};