import { useState } from "react";
import CircularTable from "./components/CircularTable";

function App() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [quickFilter, setQuickFilter] = useState("All");

  const menuItems = [
    "Dashboard",
    "RBI Circulars",
    "SEBI Circulars",
    "NPCI Circulars",
    "Industries",
    "Impact Tracker",
  ];

  return (
    <div style={pageStyle}>
      <aside style={sidebarStyle}>
        <div style={brandBoxStyle}>
          <h2 style={brandStyle}>Regulatory Tracker</h2>
          <p style={brandSubStyle}>India</p>
        </div>

        <nav style={menuStyle}>
          {menuItems.map((item) => (
            <button
              key={item}
              style={activeMenu === item ? activeMenuStyle : menuItemStyle}
              onClick={() => {
                setActiveMenu(item);
                setQuickFilter("All");
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main style={mainStyle}>
        <section style={heroStyle}>
          <div>
            <p style={tagStyle}>India Compliance Intelligence</p>
            <h1 style={titleStyle}>Regulatory Circular Tracker</h1>
            <p style={subtitleStyle}>
              Track daily circulars, impacted industries, ETA, business impact and resolution steps.
            </p>

            <div style={searchBoxStyle}>
              <input placeholder="Search RBI, SEBI, UPI, KYC, broker..." style={searchInputStyle} />
              <button style={searchButtonStyle}>Search</button>
            </div>
          </div>

          <div style={heroGraphicStyle}>
            <div style={graphicCircleStyle}>📑</div>
            <div style={graphicLineStyle}></div>
            <div style={graphicCardsStyle}>
              <div style={miniCardStyle}>RBI</div>
              <div style={miniCardStyle}>SEBI</div>
              <div style={miniCardStyle}>NPCI</div>
            </div>
            <p style={graphicTextStyle}>Live regulatory intelligence</p>
          </div>
        </section>

        <section style={statsGridStyle}>
          <StatCard title="Total Circulars" value="3" />
          <StatCard title="Regulators" value="3" />
          <StatCard title="High Impact" value="2" />
          <StatCard title="Updated Today" value="2" />
        </section>

        <section style={filterBarStyle}>
          {["All", "Banking", "Payments", "Capital Markets", "Critical"].map((item) => (
            <button
              key={item}
              style={quickFilter === item ? activeFilterStyle : filterButtonStyle}
              onClick={() => setQuickFilter(item)}
            >
              {item}
            </button>
          ))}
        </section>

        <CircularTable activeMenu={activeMenu} quickFilter={quickFilter} />
      </main>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div style={statCardStyle}>
      <p style={statTitleStyle}>{title}</p>
      <h2 style={statValueStyle}>{value}</h2>
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  width: "100vw",
  background: "#eef2f7",
  display: "flex",
  fontFamily: "Inter, Arial, sans-serif",
  margin: 0,
  padding: 0,
};

const sidebarStyle = {
  width: "250px",
  minWidth: "250px",
  background: "#020617",
  color: "white",
  padding: "28px 20px",
  position: "sticky" as const,
  top: 0,
  left: 0,
  height: "100vh",
};

const brandBoxStyle = { marginBottom: "34px" };

const brandStyle = {
  fontSize: "24px",
  margin: 0,
  fontWeight: 900,
  color: "white",
  lineHeight: 1.15,
};

const brandSubStyle = {
  color: "#93c5fd",
  marginTop: "6px",
  fontWeight: 700,
};

const menuStyle = {
  display: "grid",
  gap: "10px",
};

const menuItemStyle = {
  padding: "13px 14px",
  borderRadius: "12px",
  color: "#cbd5e1",
  fontWeight: 700,
  background: "transparent",
  border: "none",
  textAlign: "left" as const,
  cursor: "pointer",
  fontSize: "15px",
};

const activeMenuStyle = {
  ...menuItemStyle,
  background: "#2563eb",
  color: "white",
};

const mainStyle = {
  flex: 1,
  padding: "28px",
  overflowX: "hidden" as const,
};

const heroStyle = {
  background: "linear-gradient(135deg, #0f172a, #1e3a8a, #2563eb)",
  color: "white",
  padding: "34px",
  borderRadius: "24px",
  display: "grid",
  gridTemplateColumns: "1fr 280px",
  gap: "28px",
  alignItems: "center",
};

const tagStyle = {
  color: "#bfdbfe",
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  fontSize: "12px",
  margin: 0,
};

const titleStyle = {
  fontSize: "42px",
  margin: "10px 0",
  color: "white",
};

const subtitleStyle = {
  fontSize: "16px",
  color: "#dbeafe",
  maxWidth: "820px",
};

const searchBoxStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "24px",
  maxWidth: "720px",
};

const searchInputStyle = {
  flex: 1,
  padding: "14px 16px",
  borderRadius: "12px",
  border: "none",
  outline: "none",
  fontSize: "15px",
};

const searchButtonStyle = {
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "0 24px",
  fontWeight: 900,
};

const heroGraphicStyle = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.22)",
  borderRadius: "22px",
  padding: "22px",
  textAlign: "center" as const,
};

const graphicCircleStyle = {
  width: "74px",
  height: "74px",
  borderRadius: "50%",
  background: "white",
  color: "#1d4ed8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "34px",
  margin: "0 auto 14px",
};

const graphicLineStyle = {
  height: "2px",
  background: "rgba(255,255,255,0.35)",
  margin: "14px 0",
};

const graphicCardsStyle = {
  display: "flex",
  gap: "8px",
  justifyContent: "center",
};

const miniCardStyle = {
  background: "rgba(255,255,255,0.92)",
  color: "#0f172a",
  padding: "8px 10px",
  borderRadius: "10px",
  fontWeight: 900,
  fontSize: "13px",
};

const graphicTextStyle = {
  margin: "14px 0 0",
  color: "#dbeafe",
  fontSize: "13px",
  fontWeight: 700,
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "16px",
  margin: "22px 0",
};

const statCardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "18px",
  boxShadow: "0 8px 22px rgba(15, 23, 42, 0.08)",
};

const statTitleStyle = {
  margin: 0,
  color: "#64748b",
  fontSize: "13px",
  fontWeight: 800,
};

const statValueStyle = {
  margin: "8px 0 0",
  color: "#0f172a",
  fontSize: "32px",
};

const filterBarStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "18px",
  flexWrap: "wrap" as const,
};

const filterButtonStyle = {
  background: "white",
  border: "1px solid #cbd5e1",
  padding: "9px 14px",
  borderRadius: "999px",
  fontWeight: 800,
  color: "#334155",
  cursor: "pointer",
};

const activeFilterStyle = {
  ...filterButtonStyle,
  background: "#020617",
  color: "white",
};

export default App;
