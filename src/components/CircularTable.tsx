import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Circular = {
  id: string;
  regulator: string;
  industry: string;
  category: string;
  title: string;
  circular_number: string;
  published_date: string;
  effective_date: string;
  deadline: string;
  impact_level: string;
  impacted_entities: string[];
  summary: string;
  business_impact: string;
  action_required: string;
  resolution_steps: string[];
  source_url: string;
  pdf_url: string;
  compliance_risk: string;
  internal_teams: string[];
  system_changes: string;
  customer_impact: string;
  non_compliance_risk: string;
};

export default function CircularTable() {
  const [circulars, setCirculars] = useState<Circular[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCircular, setSelectedCircular] = useState<Circular | null>(null);
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchCirculars();
  }, []);

  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedCircular(null);
    }

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  async function fetchCirculars() {
    const { data, error } = await supabase
      .from("circulars")
      .select("*")
      .order("published_date", { ascending: false });

    if (!error) setCirculars(data || []);
    setLoading(false);
  }

  function formatDate(date: string) {
    if (!date) return "Not available";
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  }

  function getYear(date: string) {
    return date?.split("-")[0] || "";
  }

  function getMonth(date: string) {
    return date?.split("-")[1] || "";
  }

  const years = useMemo(() => {
    const uniqueYears = [...new Set(circulars.map((item) => getYear(item.published_date)))];
    return ["All", ...uniqueYears.filter(Boolean)];
  }, [circulars]);

  const months = [
    { label: "All Months", value: "All" },
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const filteredCirculars = circulars
    .filter((item) => {
      const yearMatch = selectedYear === "All" || getYear(item.published_date) === selectedYear;
      const monthMatch = selectedMonth === "All" || getMonth(item.published_date) === selectedMonth;
      return yearMatch && monthMatch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.published_date).getTime() - new Date(a.published_date).getTime();
      }

      if (sortBy === "oldest") {
        return new Date(a.published_date).getTime() - new Date(b.published_date).getTime();
      }

      if (sortBy === "regulator") {
        return a.regulator.localeCompare(b.regulator);
      }

      if (sortBy === "impact") {
        const order: Record<string, number> = {
          Critical: 1,
          High: 2,
          Medium: 3,
          Low: 4,
        };

        return (order[a.impact_level] || 5) - (order[b.impact_level] || 5);
      }

      return 0;
    });

  if (loading) return <div style={cardStyle}>Loading circulars...</div>;

  return (
    <>
      <div style={cardStyle}>
        <div style={topBarStyle}>
          <div>
            <h2 style={headingStyle}>Latest Circulars</h2>
            <p style={subTextStyle}>
              Showing {filteredCirculars.length} of {circulars.length} circulars
            </p>
          </div>

          <div style={filterBoxStyle}>
            <div>
              <label style={labelStyle}>Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={selectStyle}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year === "All" ? "All Years" : year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={selectStyle}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={selectStyle}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="regulator">Regulator A-Z</option>
                <option value="impact">Impact Level</option>
              </select>
            </div>
          </div>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Regulator</th>
              <th style={thStyle}>Industry</th>
              <th style={thStyle}>Published Date</th>
              <th style={thStyle}>Deadline</th>
              <th style={thStyle}>Impact</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCirculars.map((item) => (
              <tr key={item.id}>
                <td style={tdTitleStyle}>
                  <strong>{item.title}</strong>
                </td>
                <td style={tdStyle}>{item.regulator}</td>
                <td style={tdStyle}>{item.industry}</td>
                <td style={tdStyle}>{formatDate(item.published_date)}</td>
                <td style={tdStyle}>{item.deadline}</td>
                <td style={tdStyle}>
                  <span style={getImpactStyle(item.impact_level)}>
                    {item.impact_level}
                  </span>
                </td>
                <td style={tdStyle}>
                  <button style={buttonStyle} onClick={() => setSelectedCircular(item)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCirculars.length === 0 && (
          <div style={emptyStyle}>No circulars found for selected filters.</div>
        )}
      </div>

      {selectedCircular && (
        <div style={modalOverlayStyle} onClick={() => setSelectedCircular(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <div>
                <p style={modalLabelStyle}>Circular Analysis</p>
                <h2 style={modalTitleStyle}>{selectedCircular.title}</h2>
                <p style={modalMetaStyle}>
                  {selectedCircular.regulator} • {selectedCircular.industry} •{" "}
                  {formatDate(selectedCircular.published_date)}
                </p>
              </div>

              <button
                style={modalCloseButtonStyle}
                onClick={() => setSelectedCircular(null)}
              >
                ✕
              </button>
            </div>

            <div style={infoGridStyle}>
              <Info title="Circular Number" value={selectedCircular.circular_number} />
              <Info title="Category" value={selectedCircular.category} />
              <Info title="Effective Date / ETA" value={selectedCircular.effective_date} />
              <Info title="Deadline" value={selectedCircular.deadline} />
            </div>

            <Section title="Simple Summary" content={selectedCircular.summary} />
            <Section title="Business Impact" content={selectedCircular.business_impact} />
            <Section title="Action Required" content={selectedCircular.action_required} />
            <Section title="Compliance Risk" content={selectedCircular.compliance_risk} />
            <Section title="System Changes Required" content={selectedCircular.system_changes} />
            <Section title="Customer Impact" content={selectedCircular.customer_impact} />
            <Section title="Risk of Non-Compliance" content={selectedCircular.non_compliance_risk} />

            <h3 style={sectionHeadingStyle}>Impacted Entities</h3>
            <div style={tagWrapStyle}>
              {selectedCircular.impacted_entities?.map((entity) => (
                <span key={entity} style={tagStyle}>
                  {entity}
                </span>
              ))}
            </div>

            <h3 style={sectionHeadingStyle}>Internal Teams Involved</h3>
            <div style={tagWrapStyle}>
              {selectedCircular.internal_teams?.map((team) => (
                <span key={team} style={teamTagStyle}>
                  {team}
                </span>
              ))}
            </div>

            <h3 style={sectionHeadingStyle}>Resolution Checklist</h3>
            <ul style={listStyle}>
              {selectedCircular.resolution_steps?.map((step) => (
                <li key={step} style={listItemStyle}>
                  {step}
                </li>
              ))}
            </ul>

            <div style={buttonRowStyle}>
              {selectedCircular.source_url && (
                <a
                  href={selectedCircular.source_url}
                  target="_blank"
                  rel="noreferrer"
                  style={sourceButtonStyle}
                >
                  Open Official Source
                </a>
              )}

              {selectedCircular.pdf_url && (
                <a
                  href={selectedCircular.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  style={pdfButtonStyle}
                >
                  View PDF / Source Document
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div style={infoCardStyle}>
      <p style={infoTitleStyle}>{title}</p>
      <p style={infoValueStyle}>{value || "Not available"}</p>
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div style={sectionBoxStyle}>
      <h3 style={sectionHeadingStyle}>{title}</h3>
      <p style={sectionTextStyle}>{content || "Not available"}</p>
    </div>
  );
}

function getImpactStyle(level: string) {
  if (level === "Critical") return { ...pillStyle, background: "#fee2e2", color: "#991b1b" };
  if (level === "High") return { ...pillStyle, background: "#ffedd5", color: "#9a3412" };
  return { ...pillStyle, background: "#dbeafe", color: "#1e40af" };
}

const cardStyle = {
  background: "white",
  borderRadius: "20px",
  padding: "24px",
  marginTop: "20px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  overflowX: "auto" as const,
};

const topBarStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  alignItems: "center",
  marginBottom: "18px",
};

const headingStyle = {
  margin: 0,
  color: "#020617",
};

const subTextStyle = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: "14px",
};

const filterBoxStyle = {
  display: "flex",
  gap: "12px",
  alignItems: "end",
  flexWrap: "wrap" as const,
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 800,
  color: "#475569",
  marginBottom: "6px",
};

const selectStyle = {
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  fontWeight: 700,
  background: "white",
  minWidth: "135px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const thStyle = {
  textAlign: "left" as const,
  padding: "12px",
  borderBottom: "1px solid #e2e8f0",
  color: "#334155",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #e2e8f0",
  verticalAlign: "top" as const,
};

const tdTitleStyle = {
  ...tdStyle,
  minWidth: "300px",
};

const emptyStyle = {
  padding: "22px",
  textAlign: "center" as const,
  color: "#64748b",
};

const pillStyle = {
  padding: "7px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 800,
};

const buttonStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 800,
};

const modalOverlayStyle = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(15, 23, 42, 0.72)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "24px",
  zIndex: 9999,
};

const modalStyle = {
  background: "white",
  width: "min(1080px, 96vw)",
  maxHeight: "88vh",
  overflowY: "auto" as const,
  borderRadius: "22px",
  padding: "28px",
};

const modalHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  borderBottom: "1px solid #e2e8f0",
  paddingBottom: "18px",
};

const modalLabelStyle = {
  margin: 0,
  color: "#2563eb",
  fontSize: "12px",
  fontWeight: 900,
  textTransform: "uppercase" as const,
};

const modalTitleStyle = {
  margin: "8px 0 0",
  color: "#020617",
  fontSize: "26px",
};

const modalMetaStyle = {
  margin: "8px 0 0",
  color: "#64748b",
};

const modalCloseButtonStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  border: "none",
  background: "#020617",
  color: "white",
  fontSize: "18px",
  cursor: "pointer",
};

const infoGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "14px",
  marginTop: "20px",
};

const infoCardStyle = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  padding: "14px",
};

const infoTitleStyle = {
  color: "#64748b",
  fontSize: "13px",
  margin: 0,
};

const infoValueStyle = {
  fontWeight: 800,
  margin: "6px 0 0",
  color: "#020617",
};

const sectionBoxStyle = {
  marginTop: "18px",
  padding: "16px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
};

const sectionHeadingStyle = {
  color: "#020617",
  margin: "0 0 8px",
};

const sectionTextStyle = {
  color: "#334155",
  lineHeight: 1.7,
  margin: 0,
};

const tagWrapStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap" as const,
  marginBottom: "14px",
};

const tagStyle = {
  background: "#e0f2fe",
  color: "#0369a1",
  padding: "8px 12px",
  borderRadius: "999px",
  fontWeight: 800,
  fontSize: "13px",
};

const teamTagStyle = {
  ...tagStyle,
  background: "#ecfdf5",
  color: "#047857",
};

const listStyle = {
  paddingLeft: "22px",
  color: "#334155",
};

const listItemStyle = {
  marginBottom: "8px",
};

const buttonRowStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap" as const,
  marginTop: "18px",
};

const sourceButtonStyle = {
  display: "inline-block",
  background: "#2563eb",
  color: "white",
  padding: "11px 15px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: 800,
};

const pdfButtonStyle = {
  ...sourceButtonStyle,
  background: "#16a34a",
};