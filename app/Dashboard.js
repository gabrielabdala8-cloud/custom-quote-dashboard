import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, Area, AreaChart } from "recharts";

const RAW_DATA = [
  // 3PL Breakdown
  { threepl: "Synergie Canada", orders: 1130, revenue: 1833288, profit: 91641, cost: 1741647 },
  { threepl: "Lazr Freight", orders: 1709, revenue: 1578491, profit: 207758, cost: 1370734 },
];

// RFQ Acceptance Rate Data (ALL quotes including declined/cancelled)
const RFQ_ALL = [
  { name: "Dispatched", value: 2835, color: "#22d3ee" },
  { name: "Expired", value: 177, color: "#fbbf24" },
  { name: "Cancelled", value: 121, color: "#fb7185" },
  { name: "Aborted", value: 79, color: "#f97316" },
  { name: "Accepted", value: 3, color: "#34d399" },
  { name: "Declined", value: 2, color: "#ef4444" },
  { name: "Pending Cancel", value: 1, color: "#94a3b8" },
  { name: "Booked", value: 1, color: "#a78bfa" },
  { name: "Revised", value: 1, color: "#64748b" },
];

const RFQ_BY_3PL = [
  { threepl: "Lazr Freight", total: 1770, active: 1709, cancelled: 41, expired: 7, declined: 2, aborted: 11, rate: 96.6 },
  { threepl: "Synergie Canada", total: 1450, active: 1130, cancelled: 80, expired: 170, declined: 0, aborted: 68, rate: 77.9 },
];

const MONTHLY = [
  { month: "Jan 25", orders: 212, revenue: 347009, profit: 28658 },
  { month: "Feb 25", orders: 199, revenue: 304365, profit: 13917 },
  { month: "Mar 25", orders: 193, revenue: 226495, profit: 13929 },
  { month: "Apr 25", orders: 196, revenue: 228114, profit: 9067 },
  { month: "May 25", orders: 202, revenue: 248052, profit: 29176 },
  { month: "Jun 25", orders: 195, revenue: 216172, profit: 17792 },
  { month: "Jul 25", orders: 191, revenue: 231642, profit: 18514 },
  { month: "Aug 25", orders: 154, revenue: 151276, profit: 10778 },
  { month: "Sep 25", orders: 193, revenue: 222869, profit: 12867 },
  { month: "Oct 25", orders: 201, revenue: 224131, profit: 30168 },
  { month: "Nov 25", orders: 173, revenue: 176616, profit: 10078 },
  { month: "Dec 25", orders: 134, revenue: 142231, profit: 9303 },
  { month: "Jan 26", orders: 170, revenue: 196282, profit: 11154 },
  { month: "Feb 26", orders: 159, revenue: 191471, profit: 15902 },
  { month: "Mar 26", orders: 198, revenue: 258169, profit: 64646 },
  { month: "Apr 26", orders: 68, revenue: 46884, profit: 3369 },
];

const ORDER_STATUS = [
  { name: "Completed", value: 2357, revenue: 2822128 },
  { name: "Billing", value: 420, revenue: 493180 },
  { name: "Reservation", value: 39, revenue: 59549 },
  { name: "Transport", value: 20, revenue: 28375 },
  { name: "Negotiation", value: 3, revenue: 8547 },
];

const TOP_CLIENTS = [
  { name: "Ryder Cascades", orders: 1332, revenue: 1662436 },
  { name: "Cascades", orders: 201, revenue: 571187 },
  { name: "Pro-Label", orders: 269, revenue: 335932 },
  { name: "QMB", orders: 44, revenue: 106152 },
  { name: "Joseph Ribkoff", orders: 162, revenue: 66574 },
  { name: "Moov", orders: 100, revenue: 42950 },
  { name: "Bridgepoint", orders: 25, revenue: 41872 },
  { name: "Cascades ULC", orders: 31, revenue: 41386 },
  { name: "Imports Dragon", orders: 68, revenue: 40572 },
  { name: "Labelink", orders: 110, revenue: 39735 },
];

const LANE_TYPE = [
  { name: "Intra-CA", orders: 1179, revenue: 1560149 },
  { name: "Intra-QC", orders: 837, revenue: 595622 },
  { name: "Intra-US", orders: 355, revenue: 578842 },
  { name: "CA-to-US", orders: 308, revenue: 446828 },
  { name: "US-to-CA", orders: 141, revenue: 187548 },
];

const SALES_REPS = [
  { name: "Marc-André G.", orders: 2285, revenue: 2842849 },
  { name: "Krystelle D.", orders: 184, revenue: 228361 },
  { name: "Patrick D.", orders: 205, revenue: 148361 },
  { name: "Devon T.", orders: 48, revenue: 80788 },
  { name: "Yann M.", orders: 69, revenue: 71974 },
  { name: "Catherine G.", orders: 45, revenue: 38605 },
];

const TRANSPORT_TYPE = [
  { name: "LTL", orders: 2564, revenue: 2670163 },
  { name: "FTL", orders: 275, revenue: 741617 },
];

const fmt = (n) => {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

const fmtFull = (n) => `$${n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const COLORS = {
  bg: "#0b0f19",
  surface: "#111827",
  surfaceHover: "#1a2234",
  border: "#1e293b",
  text: "#e2e8f0",
  textMuted: "#64748b",
  accent: "#22d3ee",
  accentDim: "rgba(34,211,238,0.15)",
  green: "#34d399",
  greenDim: "rgba(52,211,153,0.15)",
  amber: "#fbbf24",
  amberDim: "rgba(251,191,36,0.15)",
  rose: "#fb7185",
  roseDim: "rgba(251,113,133,0.15)",
  purple: "#a78bfa",
  purpleDim: "rgba(167,139,250,0.15)",
};

const PIE_COLORS = [COLORS.accent, COLORS.green, COLORS.amber, COLORS.rose, COLORS.purple];

const KPICard = ({ label, value, sub, color, icon }) => (
  <div style={{
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: "24px 28px",
    position: "relative",
    overflow: "hidden",
    minWidth: 0,
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: 3,
      background: `linear-gradient(90deg, ${color}, transparent)`,
    }} />
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.2, color: COLORS.textMuted }}>{label}</span>
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.text, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 style={{
    fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5,
    color: COLORS.accent, margin: "36px 0 16px", paddingBottom: 8,
    borderBottom: `1px solid ${COLORS.border}`,
    fontFamily: "'JetBrains Mono', monospace",
  }}>{children}</h2>
);

const ChartCard = ({ title, children, span = 1 }) => (
  <div style={{
    background: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 16,
    padding: 24,
    gridColumn: span > 1 ? `span ${span}` : undefined,
  }}>
    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>{title}</div>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1a2234", border: `1px solid ${COLORS.border}`,
      borderRadius: 10, padding: "10px 14px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 11, color: p.color, display: "flex", gap: 8, justifyContent: "space-between" }}>
          <span>{p.name}</span>
          <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>
            {p.name === "Orders" ? p.value : fmtFull(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const tabs = ["Overview", "3PL Analysis", "Clients & Lanes", "Acceptance Rate"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Overview");

  const totalRevenue = 3411780;
  const totalCost = 3112381;
  const totalProfit = 299399;
  const totalOrders = 2839;
  const margin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div style={{
      background: COLORS.bg,
      minHeight: "100vh",
      color: COLORS.text,
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "0 0 60px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.surface} 0%, #0f172a 100%)`,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "32px 40px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.green})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700,
          }}>Q</div>
          <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>Custom Quote Analysis</span>
        </div>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginLeft: 48 }}>
          3PL Operations · 2025 YTD · Revenue &amp; Profitability Dashboard
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginTop: 20, marginLeft: 48 }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: 600, transition: "all 0.2s",
              background: activeTab === t ? COLORS.accentDim : "transparent",
              color: activeTab === t ? COLORS.accent : COLORS.textMuted,
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 28 }}>
          <KPICard icon="💰" label="Total Revenue" value={fmt(totalRevenue)} sub={fmtFull(totalRevenue) + " CAD"} color={COLORS.accent} />
          <KPICard icon="📊" label="Total Cost" value={fmt(totalCost)} sub={fmtFull(totalCost) + " CAD"} color={COLORS.amber} />
          <KPICard icon="✅" label="Net Profit" value={fmt(totalProfit)} sub={`${margin}% margin`} color={COLORS.green} />
          <KPICard icon="📦" label="Total Orders" value={totalOrders.toLocaleString()} sub="Custom 3PL quotes" color={COLORS.purple} />
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "Overview" && (
          <>
            <SectionTitle>Monthly Revenue &amp; Profit Trend</SectionTitle>
            <ChartCard title="Revenue vs Profit (CAD)" span={2}>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={MONTHLY}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={COLORS.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="month" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
                  <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} tickFormatter={v => fmt(v)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke={COLORS.accent} fill="url(#revGrad)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="profit" name="Profit" stroke={COLORS.green} fill="url(#profGrad)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <SectionTitle>Order Status &amp; RFQ Breakdown</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <ChartCard title="Orders by Status">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={ORDER_STATUS} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} strokeWidth={0}>
                      {ORDER_STATUS.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div style={{ background: "#1a2234", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px" }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.text }}>{d.name}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>{d.value} orders · {fmtFull(d.revenue)}</div>
                        </div>
                      );
                    }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 8 }}>
                  {ORDER_STATUS.map((s, i) => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: PIE_COLORS[i] }} />
                      <span style={{ color: COLORS.textMuted }}>{s.name}</span>
                      <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: COLORS.text }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Transport Type Split">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={TRANSPORT_TYPE} dataKey="orders" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} strokeWidth={0}>
                      <Cell fill={COLORS.accent} />
                      <Cell fill={COLORS.amber} />
                    </Pie>
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div style={{ background: "#1a2234", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px" }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.text }}>{d.name}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>{d.orders} orders · {fmtFull(d.revenue)}</div>
                        </div>
                      );
                    }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 8 }}>
                  {TRANSPORT_TYPE.map((t, i) => (
                    <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 3, background: i === 0 ? COLORS.accent : COLORS.amber }} />
                      <span style={{ color: COLORS.textMuted }}>{t.name}</span>
                      <span style={{ fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{t.orders}</span>
                      <span style={{ color: COLORS.textMuted, fontSize: 11 }}>({((t.orders / totalOrders) * 100).toFixed(0)}%)</span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            <SectionTitle>RFQ Status</SectionTitle>
            <div style={{
              background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24,
              display: "flex", gap: 32, alignItems: "center",
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ height: 12, borderRadius: 6, background: COLORS.border, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "99.9%", borderRadius: 6, background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.accent})` }} />
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: COLORS.green }}>2,820</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>Dispatched (99.9%)</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: COLORS.amber }}>3</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>Accepted / Booked</div>
              </div>
            </div>
          </>
        )}

        {/* 3PL ANALYSIS TAB */}
        {activeTab === "3PL Analysis" && (
          <>
            <SectionTitle>3PL Performance Comparison</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {RAW_DATA.map((pl) => {
                const m = ((pl.profit / pl.revenue) * 100).toFixed(1);
                const isLazr = pl.threepl === "Lazr Freight";
                const clr = isLazr ? COLORS.accent : COLORS.green;
                return (
                  <div key={pl.threepl} style={{
                    background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 28,
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: clr }} />
                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: clr }}>{pl.threepl}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Orders</div>
                        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{pl.orders.toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Revenue</div>
                        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(pl.revenue)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Profit</div>
                        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: COLORS.green }}>{fmt(pl.profit)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Margin</div>
                        <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: parseFloat(m) > 10 ? COLORS.green : COLORS.amber }}>{m}%</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 16, height: 8, borderRadius: 4, background: COLORS.border }}>
                      <div style={{ height: "100%", borderRadius: 4, background: clr, width: `${(pl.revenue / totalRevenue) * 100}%`, opacity: 0.8 }} />
                    </div>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4 }}>
                      {((pl.revenue / totalRevenue) * 100).toFixed(1)}% of total revenue
                    </div>
                  </div>
                );
              })}
            </div>

            <SectionTitle>3PL Revenue &amp; Profit Comparison</SectionTitle>
            <ChartCard title="Side-by-Side">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={RAW_DATA} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="threepl" tick={{ fill: COLORS.textMuted, fontSize: 12 }} axisLine={{ stroke: COLORS.border }} />
                  <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} tickFormatter={v => fmt(v)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Revenue" fill={COLORS.accent} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="profit" name="Profit" fill={COLORS.green} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="cost" name="Cost" fill={COLORS.amber} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <SectionTitle>Sales Representatives</SectionTitle>
            <ChartCard title="Revenue by Rep">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={SALES_REPS} layout="vertical" barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} horizontal={false} />
                  <XAxis type="number" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} tickFormatter={v => fmt(v)} />
                  <YAxis type="category" dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} width={110} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Revenue" fill={COLORS.purple} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}

        {/* CLIENTS & LANES TAB */}
        {activeTab === "Clients & Lanes" && (
          <>
            <SectionTitle>Top 10 Clients by Revenue</SectionTitle>
            <ChartCard title="Client Revenue (CAD)">
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={TOP_CLIENTS} layout="vertical" barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} horizontal={false} />
                  <XAxis type="number" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} tickFormatter={v => fmt(v)} />
                  <YAxis type="category" dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Revenue" fill={COLORS.accent} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <SectionTitle>Lane Type Distribution</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <ChartCard title="Revenue by Lane">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={LANE_TYPE} dataKey="revenue" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} strokeWidth={0}>
                      {LANE_TYPE.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div style={{ background: "#1a2234", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px" }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.text }}>{d.name}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>{d.orders} orders · {fmtFull(d.revenue)}</div>
                        </div>
                      );
                    }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                  {LANE_TYPE.map((l, i) => (
                    <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: PIE_COLORS[i] }} />
                      <span style={{ color: COLORS.textMuted }}>{l.name}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Orders by Lane">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={LANE_TYPE}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 10 }} axisLine={{ stroke: COLORS.border }} />
                    <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="orders" name="Orders" fill={COLORS.green} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Client detail table */}
            <SectionTitle>Client Detail Table</SectionTitle>
            <div style={{
              background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16,
              overflow: "hidden",
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    {["Client", "Orders", "Revenue (CAD)", "% of Total"].map(h => (
                      <th key={h} style={{
                        padding: "14px 20px", textAlign: "left", fontWeight: 600, fontSize: 11,
                        textTransform: "uppercase", letterSpacing: 1, color: COLORS.textMuted,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TOP_CLIENTS.map((c, i) => (
                    <tr key={c.name} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                      <td style={{ padding: "12px 20px", fontWeight: 600 }}>{c.name}</td>
                      <td style={{ padding: "12px 20px", fontFamily: "'JetBrains Mono', monospace" }}>{c.orders.toLocaleString()}</td>
                      <td style={{ padding: "12px 20px", fontFamily: "'JetBrains Mono', monospace" }}>{fmtFull(c.revenue)}</td>
                      <td style={{ padding: "12px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 6, borderRadius: 3, background: COLORS.border }}>
                            <div style={{ height: "100%", borderRadius: 3, background: COLORS.accent, width: `${(c.revenue / totalRevenue) * 100}%` }} />
                          </div>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, minWidth: 40, textAlign: "right" }}>
                            {((c.revenue / totalRevenue) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ACCEPTANCE RATE TAB */}
        {activeTab === "Acceptance Rate" && (
          <>
            <SectionTitle>RFQ Acceptance Overview</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              <KPICard icon="📋" label="Total RFQs" value="3,220" sub="All quotes submitted" color={COLORS.accent} />
              <KPICard icon="✅" label="Active / Accepted" value="2,839" sub="88.2% acceptance rate" color={COLORS.green} />
              <KPICard icon="❌" label="Non-Active" value="381" sub="Declined + Cancelled + Expired + Aborted" color={COLORS.rose} />
              <KPICard icon="💸" label="Lost Revenue" value={fmt(682551)} sub="Revenue on non-active RFQs" color={COLORS.amber} />
            </div>

            <SectionTitle>RFQ Status Breakdown</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <ChartCard title="All RFQ Statuses">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={RFQ_ALL} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={2} strokeWidth={0}>
                      {RFQ_ALL.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div style={{ background: "#1a2234", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px" }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.text }}>{d.name}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>{d.value} quotes · {(d.value / 3220 * 100).toFixed(1)}%</div>
                        </div>
                      );
                    }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 8 }}>
                  {RFQ_ALL.map((s) => (
                    <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color }} />
                      <span style={{ color: COLORS.textMuted }}>{s.name}</span>
                      <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", color: COLORS.text }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>

              <ChartCard title="Non-Active Breakdown">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={RFQ_ALL.filter(r => !["Dispatched","Accepted","Booked"].includes(r.name))} layout="vertical" barSize={22}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} horizontal={false} />
                    <XAxis type="number" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} width={120} />
                    <Tooltip content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div style={{ background: "#1a2234", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px" }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: COLORS.text }}>{label}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>{payload[0].value} quotes</div>
                        </div>
                      );
                    }} />
                    <Bar dataKey="value" name="Quotes" radius={[0, 6, 6, 0]}>
                      {RFQ_ALL.filter(r => !["Dispatched","Accepted","Booked"].includes(r.name)).map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <SectionTitle>Acceptance Rate by 3PL</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {RFQ_BY_3PL.map((pl) => {
                const isLazr = pl.threepl === "Lazr Freight";
                const clr = isLazr ? COLORS.accent : COLORS.green;
                const rateColor = pl.rate >= 90 ? COLORS.green : pl.rate >= 80 ? COLORS.amber : COLORS.rose;
                return (
                  <div key={pl.threepl} style={{
                    background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 28,
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: clr }} />
                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: clr }}>{pl.threepl}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 20 }}>{pl.total} total quotes</div>

                    {/* Acceptance rate big number */}
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                      <div style={{ fontSize: 48, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: rateColor }}>{pl.rate}%</div>
                      <div style={{ fontSize: 12, color: COLORS.textMuted }}>Acceptance Rate</div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ height: 12, borderRadius: 6, background: COLORS.border, overflow: "hidden", marginBottom: 16 }}>
                      <div style={{ height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${clr}, ${rateColor})`, width: `${pl.rate}%`, transition: "width 0.5s" }} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                      {[
                        ["Active", pl.active, COLORS.green],
                        ["Cancelled", pl.cancelled, COLORS.rose],
                        ["Expired", pl.expired, COLORS.amber],
                        ["Aborted", pl.aborted, "#f97316"],
                      ].map(([label, val, c]) => (
                        <div key={label} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: c }}>{val}</div>
                          <div style={{ fontSize: 10, color: COLORS.textMuted }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Acceptance rate comparison bar chart */}
            <SectionTitle>3PL Acceptance Comparison</SectionTitle>
            <ChartCard title="Active vs Non-Active by 3PL">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={RFQ_BY_3PL} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                  <XAxis dataKey="threepl" tick={{ fill: COLORS.textMuted, fontSize: 12 }} axisLine={{ stroke: COLORS.border }} />
                  <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} />
                  <Tooltip content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div style={{ background: "#1a2234", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 14px" }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>{label}</div>
                        {payload.map((p, i) => (
                          <div key={i} style={{ fontSize: 11, color: p.color, display: "flex", gap: 8, justifyContent: "space-between" }}>
                            <span>{p.name}</span>
                            <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{p.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }} />
                  <Bar dataKey="active" name="Active" fill={COLORS.green} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="cancelled" name="Cancelled" fill={COLORS.rose} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expired" name="Expired" fill={COLORS.amber} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="aborted" name="Aborted" fill="#f97316" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </>
        )}

        {/* Footer */}
        <div style={{ marginTop: 48, padding: "20px 0", borderTop: `1px solid ${COLORS.border}`, textAlign: "center" }}>
          <span style={{ fontSize: 11, color: COLORS.textMuted }}>
            Custom Quote Analysis Dashboard · Data extracted 2025 YTD · All amounts in CAD unless noted
          </span>
        </div>
      </div>
    </div>
  );
}
