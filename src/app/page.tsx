"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

/* ───────── Styles ───────── */

const STYLES = `
*{box-sizing:border-box;margin:0;padding:0}
body{background:#f8f9fa;font-family:'Apple SD Gothic Neo','Pretendard',system-ui,-apple-system,sans-serif}
:root{
  --blue:#1a2744; --blue-light:#e8efff;
  --red:#f04452; --red-light:#fff0f2;
  --orange:#ff8c42; --orange-light:#fff0e6;
  --green:#00b493; --green-light:#e6faf7;
  --gray-50:#f8f9fa; --gray-100:#f2f4f6; --gray-200:#e5e8eb;
  --gray-400:#8b95a1; --gray-600:#4e5968; --gray-800:#191f28;
  --white:#fff; --radius-lg:20px; --radius-md:16px; --radius-sm:12px;
  --shadow:0 2px 12px rgba(0,0,0,0.06);
}
.app-wrap{max-width:520px;margin:0 auto;min-height:100vh;background:var(--gray-50)}
.sticky-tab-bar{position:sticky;top:0;z-index:100;background:var(--white);border-bottom:1px solid var(--gray-200);display:flex;overflow-x:auto;scrollbar-width:none}
.sticky-tab-bar::-webkit-scrollbar{display:none}
.tab-btn{flex:1;min-width:70px;padding:14px 8px;border:0;background:transparent;font-size:14px;font-weight:500;color:var(--gray-400);cursor:pointer;border-bottom:2px solid transparent;transition:.2s;white-space:nowrap}
.tab-btn.active{color:var(--blue);border-bottom-color:var(--blue);font-weight:700}
.card{background:var(--white);border-radius:var(--radius-md);padding:20px;margin-bottom:12px;box-shadow:var(--shadow)}
.section{padding:24px 16px 8px;scroll-margin-top:56px}
.section-title{font-size:18px;font-weight:800;color:var(--gray-800);margin-bottom:16px}
.row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--gray-100)}
.row:last-child{border-bottom:none}
.row-label{font-size:14px;color:var(--gray-600)}
.row-value{font-size:14px;font-weight:600;color:var(--gray-800)}
.badge{display:inline-block;padding:3px 8px;border-radius:6px;font-size:12px;font-weight:600}
.badge-blue{background:var(--blue-light);color:var(--blue)}
.badge-green{background:var(--green-light);color:var(--green)}
.btn-primary{display:block;width:100%;padding:16px;background:var(--blue);color:#fff;border:0;border-radius:var(--radius-sm);font-size:15px;font-weight:500;cursor:pointer;transition:opacity .15s;text-align:center}
.btn-primary:active{opacity:.85}
.btn-outline{display:block;width:100%;padding:11px;background:var(--white);color:var(--gray-800);border:1.5px solid var(--gray-200);border-radius:var(--radius-sm);font-size:13px;font-weight:500;cursor:pointer;transition:background .15s;text-align:center}
.btn-outline:active{background:var(--blue-light)}
.period-tabs{display:flex;gap:4px;margin-bottom:16px;background:var(--gray-100);padding:4px;border-radius:10px}
.period-tab{flex:1;padding:7px 4px;border:0;background:transparent;font-size:12px;font-weight:500;color:var(--gray-400);cursor:pointer;border-radius:7px;transition:.15s}
.period-tab.active{background:var(--white);color:var(--gray-800);font-weight:700;box-shadow:0 1px 4px rgba(0,0,0,0.1)}
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.asset-hero{background:var(--white);padding:24px 20px 0}
.asset-amount{font-size:32px;font-weight:900;color:var(--gray-800);letter-spacing:-1px;margin-bottom:4px}
.asset-profit{font-size:16px;font-weight:700;color:var(--red)}
.asset-bank{font-size:13px;color:var(--gray-400);margin-top:8px;padding-bottom:20px}
.custom-tooltip{background:var(--gray-800);color:#fff;padding:8px 12px;border-radius:8px;font-size:13px;font-weight:600}
.metric-card{background:var(--white);border-radius:var(--radius-sm);padding:16px;box-shadow:var(--shadow)}
.metric-label{font-size:12px;color:var(--gray-400);margin-bottom:6px}
.metric-value{font-size:18px;font-weight:800;color:var(--gray-800);letter-spacing:-0.5px}
.page-header{display:flex;align-items:center;padding:16px;background:var(--white);border-bottom:1px solid var(--gray-200);position:sticky;top:0;z-index:200}
.back-btn{background:none;border:0;font-size:20px;cursor:pointer;padding:4px 8px 4px 0;color:var(--gray-800)}
.page-header-title{font-size:17px;font-weight:700;color:var(--gray-800)}
.calc-input{width:100%;padding:14px 16px;background:var(--gray-100);border:0;border-radius:var(--radius-sm);font-size:16px;font-weight:600;color:var(--gray-800);margin-bottom:8px;outline:none;transition:background .15s}
.calc-input:focus{background:var(--blue-light)}
.progress-bar-bg{background:var(--gray-100);border-radius:99px;height:8px;margin-top:10px;overflow:hidden}
.progress-bar-fill{height:100%;border-radius:99px;background:var(--orange);transition:width .5s ease}
.etf-item{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--gray-100)}
.etf-item:last-child{border-bottom:none}
.etf-name{font-size:14px;font-weight:600;color:var(--gray-800)}
.etf-ratio{font-size:14px;font-weight:700;color:var(--blue)}
.etf-dot{width:10px;height:10px;border-radius:50%;margin-right:10px;flex-shrink:0}
.btn-navy{display:block;width:100%;padding:18px;background:#1a2744;color:#ff8c42;border:0;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;text-align:center;letter-spacing:-.3px}
.btn-navy:active{opacity:.85}
.btn-navy-outline{display:block;width:100%;padding:18px;background:transparent;color:#1a2744;border:2px solid #1a2744;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;text-align:center}
.btn-navy-outline:active{background:#f0f2f7}
.modal-overlay{position:fixed;inset:0;background:rgba(15,23,42,.45);display:grid;place-items:end center;z-index:9999;padding:12px}
.modal{width:min(520px,100%);background:var(--white);border-radius:22px;border:1px solid rgba(15,23,42,.08);box-shadow:0 18px 40px rgba(15,23,42,.22);padding:14px}
.modal-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px}
.modal-title{font-size:16px;font-weight:900;color:var(--gray-800)}
.modal-close{border:0;background:transparent;font-size:18px;color:var(--gray-400);cursor:pointer}
.compare-box{border:1px solid rgba(15,23,42,.08);border-radius:16px;padding:12px;background:var(--white)}
.compare-header,.compare-row{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:12px}
.compare-header{gap:10px;padding-bottom:10px}
.compare-row{padding:10px 0;border-top:1px solid var(--gray-100)}
.compare-col-left{font-size:12px;font-weight:900;color:var(--red);text-align:left}
.compare-col-right{font-size:12px;font-weight:900;color:#1a2744;text-align:left}
.compare-label{font-size:13px;color:var(--gray-600)}
.compare-val{font-size:13px;font-weight:400;color:var(--gray-800)}
.compare-val-strong{font-size:13px;font-weight:800;color:var(--gray-800)}
.btn-secondary{display:block;width:100%;padding:16px;background:var(--white);color:var(--gray-800);border:1.5px solid var(--gray-200);border-radius:var(--radius-sm);font-size:13px;font-weight:700;cursor:pointer;text-align:center}
.btn-secondary:active{background:var(--gray-100)}
`;

/* ───────── Dummy Data ───────── */

const CHART_DATA = {
  "1주": [
    { date: "2/12", value: 12100000 },
    { date: "2/13", value: 12230000 },
    { date: "2/14", value: 12180000 },
    { date: "2/17", value: 12350000 },
    { date: "2/18", value: 12420000 },
    { date: "2/19", value: 12587000 },
  ],
  "1달": [
    { date: "1/19", value: 11200000 },
    { date: "1/26", value: 11600000 },
    { date: "2/2", value: 11950000 },
    { date: "2/9", value: 12100000 },
    { date: "2/16", value: 12350000 },
    { date: "2/19", value: 12587000 },
  ],
  "3달": [
    { date: "11월", value: 9800000 },
    { date: "12월", value: 10500000 },
    { date: "1월", value: 11500000 },
    { date: "2월", value: 12587000 },
  ],
  "6달": [
    { date: "8월", value: 7000000 },
    { date: "9월", value: 8200000 },
    { date: "10월", value: 9100000 },
    { date: "11월", value: 9800000 },
    { date: "12월", value: 10500000 },
    { date: "2월", value: 12587000 },
  ],
  "올해": [
    { date: "1월", value: 11000000 },
    { date: "2월", value: 12587000 },
  ],
  "전체": [
    { date: "2023.01", value: 5000000 },
    { date: "2023.06", value: 7000000 },
    { date: "2024.01", value: 9000000 },
    { date: "2024.06", value: 10500000 },
    { date: "2025.01", value: 11000000 },
    { date: "2025.02", value: 12587000 },
  ],
};

const ASSET_ALLOCATION = [
  { name: "미국 배당 ETF", value: 40, color: "#3182f6" },
  { name: "한국 배당 ETF", value: 25, color: "#00b493" },
  { name: "채권 ETF", value: 20, color: "#f59e0b" },
  { name: "리츠 ETF", value: 10, color: "#8b5cf6" },
  { name: "현금성", value: 5, color: "#8b95a1" },
];

const ETF_LIST = [
  { name: "SCHD (슈왑 배당 ETF)", ratio: "40%", color: "#3182f6" },
  { name: "KODEX 고배당", ratio: "25%", color: "#00b493" },
  { name: "ACE 국채 10년", ratio: "20%", color: "#f59e0b" },
  { name: "TIGER 리츠부동산인프라", ratio: "10%", color: "#8b5cf6" },
  { name: "CMA (현금성)", ratio: "5%", color: "#8b95a1" },
];

// 한 곳에서 “자산 요약(더미)” 관리 → 여기 값으로 카드/상세 모두 계산
const ASSET_SUMMARY = {
  accountType: "일반형" as "일반형" | "서민형",
  dividendYTD: 10_000_000,
  lossYTD: 3_000_000,
  totalValue: 12_587_000,
  profitAmount: 587_000,
  profitRate: 4.89,
};

/* ───────── Tax Utils (통일) ───────── */

function calcIsaTax({
  accountType,
  dividend,
  loss,
}: {
  accountType: "일반형" | "서민형";
  dividend: number; // 원
  loss: number; // 원
}) {
  const taxFreeLimit = accountType === "서민형" ? 4_000_000 : 2_000_000;

  const netProfit = dividend - loss;

  const normalTaxBase = dividend;
  const normalTax = Math.round(normalTaxBase * 0.154);

  const isaTaxBase = Math.max(0, netProfit - taxFreeLimit);
  const isaTax = Math.round(isaTaxBase * 0.099);

  const savedTax = normalTax - isaTax;
  const taxFreeApplied = Math.max(0, Math.min(taxFreeLimit, netProfit));

  return {
    taxFreeLimit,
    netProfit,
    normalTaxBase,
    normalTax,
    isaTaxBase,
    isaTax,
    savedTax,
    taxFreeApplied,
  };
}

/* ───────── Common Components ───────── */

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 2 }}>{label}</div>
      <div>{Number(payload[0].value).toLocaleString()}원</div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
  badge,
}: {
  label: string;
  value?: string;
  badge?: { text: string; color: "blue" | "green" };
}) => (
  <div className="row">
    <span className="row-label">{label}</span>
    {badge ? (
      <span className={`badge badge-${badge.color}`}>{badge.text}</span>
    ) : (
      <span className="row-value">{value}</span>
    )}
  </div>
);

const PageHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <div className="page-header" style={{ zIndex: 300 }}>
    <button className="back-btn" onClick={onBack}>
      ←
    </button>
    <span className="page-header-title">{title}</span>
  </div>
);

const StickyTabs = ({
  tabs,
  active,
  onClick,
  top = 0,
  zIndex = 200,
}: {
  tabs: string[];
  active: number;
  onClick: (idx: number) => void;
  top?: number;
  zIndex?: number;
}) => (
  <div className="sticky-tab-bar" style={{ top, zIndex }}>
    {tabs.map((t, i) => (
      <button
        key={t}
        className={`tab-btn ${active === i ? "active" : ""}`}
        onClick={() => onClick(i)}
      >
        {t}
      </button>
    ))}
  </div>
);

/* ───────── Product Page ───────── */

const CalculatorSection = () => {
  const [accountType, setAccountType] = useState<"일반형" | "서민형">("일반형");
  const [dividend, setDividend] = useState("1000"); // 만원
  const [loss, setLoss] = useState("300"); // 만원

  const taxFreeLimit = accountType === "서민형" ? 400 : 200;

  const totalProfit = Number(dividend);
  const realizedLoss = Number(loss);
  const netProfit = totalProfit - realizedLoss;

  const normalTax = Math.round(totalProfit * 0.154 * 10000);
  const isaTaxBase = Math.max(0, netProfit - taxFreeLimit);
  const isaTax = Math.round(isaTaxBase * 0.099 * 10000);

  const savedTax = normalTax - isaTax;
  const taxFreeApplied = Math.max(0, Math.min(taxFreeLimit, netProfit));

  const rows = [
    { label: "총 소득", normal: `${netProfit.toLocaleString()}만원`, isa: `${netProfit.toLocaleString()}만원`, bold: true },
    { label: "(-)비과세 혜택", normal: "-", isa: `${taxFreeApplied.toLocaleString()}만원`, isaColor: "var(--red)" },
    { label: "과세 대상 금액", normal: `${totalProfit.toLocaleString()}만원`, isa: `${isaTaxBase.toLocaleString()}만원`, bold: true },
    { label: "세율", normal: "15.4%", isa: "9.9%", isaColor: "var(--blue)" },
    { label: "세금", normal: `${normalTax.toLocaleString()}원`, isa: `${isaTax.toLocaleString()}원`, bold: true },
  ] as any[];

  return (
    <div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-800)" }}>💰 절세 계산기</div>

          <div style={{ display: "flex", background: "var(--gray-100)", borderRadius: 10, padding: 3, gap: 2 }}>
            {(["일반형", "서민형"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setAccountType(t)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  background: accountType === t ? "var(--white)" : "transparent",
                  color: accountType === t ? "var(--blue)" : "var(--gray-400)",
                  boxShadow: accountType === t ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "var(--blue-light)",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 12,
            color: "var(--blue)",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          {accountType === "서민형" ? "🎯 서민형 · 비과세 한도 400만원" : "📋 일반형 · 비과세 한도 200만원"}
        </div>

        <label style={{ fontSize: 12, color: "var(--gray-400)", marginBottom: 4, display: "block" }}>
          배당/이자 수익 (만원)
        </label>
        <input className="calc-input" type="number" value={dividend} onChange={(e) => setDividend(e.target.value)} />

        <label style={{ fontSize: 12, color: "var(--gray-400)", marginBottom: 4, display: "block" }}>
          실현 손실 (만원)
        </label>
        <input className="calc-input" type="number" value={loss} onChange={(e) => setLoss(e.target.value)} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px" }}>
          <span style={{ fontSize: 13, color: "var(--gray-600)", fontWeight: 600 }}>총 소득</span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: netProfit >= 0 ? "var(--gray-800)" : "var(--red)",
              letterSpacing: -0.5,
            }}
          >
            {netProfit.toLocaleString()}만원
          </span>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 14, color: "var(--gray-600)", marginBottom: 8, fontWeight: 500 }}>
          예상 세금 절약 금액
        </div>

        <div style={{ display: "flex", fontSize: 12, color: "var(--gray-400)", marginBottom: 4 }}>
          <span style={{ flex: 1 }} />
          <span style={{ width: 100, textAlign: "right" }}>일반계좌</span>
          <span style={{ width: 100, textAlign: "right", color: "var(--blue)", fontWeight: 700 }}>ISA계좌</span>
        </div>

        {rows.map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "9px 0",
              borderBottom: "1px solid var(--gray-100)",
              fontSize: 13,
            }}
          >
            <span style={{ flex: 1, color: "var(--gray-600)" }}>{row.label}</span>
            <span style={{ width: 100, textAlign: "right", fontWeight: row.bold ? 700 : 400, color: "var(--gray-800)" }}>
              {row.normal}
            </span>
            <span style={{ width: 100, textAlign: "right", fontWeight: row.bold ? 700 : 400, color: row.isaColor || "var(--gray-800)" }}>
              {row.isa}
            </span>
          </div>
        ))}

        <div style={{ display: "flex", alignItems: "center", paddingTop: 12, marginTop: 4, fontSize: 14, fontWeight: 800 }}>
          <span style={{ flex: 1, color: "var(--gray-800)" }}>절세 금액</span>
          <span style={{ width: 100, textAlign: "right", color: "var(--blue)", fontSize: 16, fontWeight: 900, letterSpacing: -1 }}>
            {savedTax.toLocaleString()}원
          </span>
        </div>

        <div style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 14, lineHeight: 1.7 }}>
          * 단순 계산 기준이며 실제 세금과 다를 수 있습니다
          <br />* 서민형: 총급여 5,000만원 이하 또는 종합소득 3,800만원 이하
        </div>
      </div>
    </div>
  );
};

const ISAProductPage = ({ onBack }: { onBack: () => void }) => {
  const tabs = ["기본 정보", "상품 안내", "투자 자산", "모의 계산기"];
  const [activeTab, setActiveTab] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const TOP = 56 + 48;
    const observers = sectionRefs.current.map((ref, idx) => {
      if (!ref) return null;
      const io = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setActiveTab(idx),
        { rootMargin: `-${TOP}px 0px -60% 0px`, threshold: 0 }
      );
      io.observe(ref);
      return io;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const scrollToSection = useCallback((idx: number) => {
    setActiveTab(idx);
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div style={{ background: "var(--gray-50)", minHeight: "100vh" }}>
      <PageHeader title="ISA 상품 안내" onBack={onBack} />
      <StickyTabs tabs={tabs} active={activeTab} onClick={scrollToSection} top={56} />

      <div style={{ paddingBottom: 60 }}>
        <div ref={(el) => { sectionRefs.current[0] = el; }} className="section" style={{ scrollMarginTop: 104 }}>
          <div className="section-title">기본 정보</div>
          <div className="card">
            <InfoRow label="투자 알고리즘" value="배당 성장 퀀트 전략" />
            <InfoRow label="최소 계약 금액" value="100만원" />
            <InfoRow label="투자 형태" badge={{ text: "자문", color: "blue" }} />
            <InfoRow label="서비스 수수료" value="운용보수 연 0.5%" />
            <InfoRow label="계좌 유형" badge={{ text: "중개형 ISA", color: "green" }} />
            <InfoRow label="최소 의무 가입" value="3년" />
          </div>
          <button className="btn-outline" style={{ marginTop: 4 }} onClick={() => alert("설명서 다운로드")}>
            계약 권유 및 상품 설명서
          </button>
          <button className="btn-outline" style={{ marginTop: 4 }} onClick={() => alert("계약서 다운로드")}>
            비대면 자문 계약서
          </button>
        </div>

        <div ref={(el) => { sectionRefs.current[1] = el; }} className="section" style={{ scrollMarginTop: 104 }}>
          <div className="section-title">상품 안내</div>
          <div className="card">
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: "var(--gray-800)" }}>서비스 개요</div>
            <p style={{ fontSize: 14, color: "var(--gray-600)", lineHeight: 1.7 }}>
              국내외 배당 ETF를 중심으로 구성된 포트폴리오로 안정적 배당 수익과 장기 성장을 목표로 합니다.
              ISA 비과세 한도를 활용해 절세 효과를 제공합니다.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: "var(--gray-800)" }}>운용 방식</div>
            {[
              ["🔄", "월 1회 포트폴리오 리밸런싱"],
              ["📊", "퀀트 기반 종목 선별 및 비중 조절"],
              ["💸", "배당 수익 자동 재투자 옵션 제공"],
              ["🛡️", "리스크 분산을 위한 다자산 구성"],
            ].map(([icon, text]) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: "1px solid var(--gray-100)",
                  fontSize: 14,
                  color: "var(--gray-800)",
                }}
              >
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ background: "var(--red-light)" }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: "var(--red)" }}>⚠️ 리스크 안내</div>
            <p style={{ fontSize: 13, color: "#c0392b", lineHeight: 1.7 }}>
              투자는 원금 손실 위험이 있습니다. 과거 수익률은 미래 수익을 보장하지 않으며 시장 상황에 따라 손실이 발생할 수 있습니다.
              투자 전 상품 설명서를 확인하세요.
            </p>
          </div>
        </div>

        <div ref={(el) => { sectionRefs.current[2] = el; }} className="section" style={{ scrollMarginTop: 104 }}>
          <div className="section-title">투자 자산</div>

          <div className="card">
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "var(--gray-800)" }}>자산 구성 비율</div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={ASSET_ALLOCATION} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {ASSET_ALLOCATION.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Legend formatter={(v) => <span style={{ fontSize: 12, color: "var(--gray-600)" }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, color: "var(--gray-800)" }}>보유 ETF 목록</div>
            {ETF_LIST.map((etf) => (
              <div key={etf.name} className="etf-item">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="etf-dot" style={{ background: etf.color }} />
                  <span className="etf-name">{etf.name}</span>
                </div>
                <span className="etf-ratio">{etf.ratio}</span>
              </div>
            ))}
          </div>
        </div>

        <div ref={(el) => { sectionRefs.current[3] = el; }} className="section" style={{ scrollMarginTop: 104 }}>
          <div className="section-title">모의 계산기</div>
          <CalculatorSection />
        </div>
      </div>
    </div>
  );
};

/* ───────── Asset Page ───────── */

const SubscriptionInfoSection = () => (
  <div className="card">
    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: "var(--gray-800)" }}>가입 정보</div>
    <InfoRow label="가입일" value="2024.01.03" />
    <InfoRow label="계좌번호" value="110-****-1103" />
    <InfoRow label="가입 유형" value="중개형 ISA" />
    <InfoRow label="만기 해지 가능일" value="2027.01.03 (3년)" />
    <InfoRow label="자동이체 설정" badge={{ text: "설정 바로가기 >", color: "blue" }} />
  </div>
);

const TaxDetailSection = ({
  accountType,
  dividendYTD,
  lossYTD,
}: {
  accountType: "일반형" | "서민형";
  dividendYTD: number;
  lossYTD: number;
}) => {
  const t = calcIsaTax({ accountType, dividend: dividendYTD, loss: lossYTD });

  const rows = [
    { label: "배당/이자 소득", normal: `${dividendYTD.toLocaleString()}원`, isa: `${dividendYTD.toLocaleString()}원` },
    { label: "(-)비과세 혜택", normal: "-", isa: `${t.taxFreeApplied.toLocaleString()}원`, isaColor: "var(--red)" },
    { label: "(-)손실 상계", normal: "-", isa: `${lossYTD.toLocaleString()}원`, isaColor: "var(--red)" },
    { label: "과세 대상 소득", normal: `${t.normalTaxBase.toLocaleString()}원`, isa: `${t.isaTaxBase.toLocaleString()}원` },
    { label: "세율", normal: "15.4%", isa: "9.9%", isaColor: "var(--blue)" },
    { label: "세금", normal: `${t.normalTax.toLocaleString()}원`, isa: `${t.isaTax.toLocaleString()}원` },
  ] as any[];

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 900 }}>예상 세금 상세 내역</div>
        <span className="badge badge-blue">{accountType}</span>
      </div>

      <div style={{ display: "flex", fontSize: 12, color: "var(--gray-400)", marginBottom: 6 }}>
        <span style={{ flex: 1 }} />
        <span style={{ width: 110, textAlign: "right" }}>일반계좌</span>
        <span style={{ width: 110, textAlign: "right", color: "var(--blue)", fontWeight: 800 }}>ISA계좌</span>
      </div>

      {rows.map((row) => (
        <div
          key={row.label}
          style={{ display: "flex", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--gray-100)", fontSize: 13 }}
        >
          <span style={{ flex: 1, color: "var(--gray-600)" }}>{row.label}</span>
          <span style={{ width: 110, textAlign: "right" }}>{row.normal}</span>
          <span style={{ width: 110, textAlign: "right", color: row.isaColor || "var(--gray-800)" }}>{row.isa}</span>
        </div>
      ))}

      <div style={{ display: "flex", marginTop: 12, fontWeight: 800 }}>
        <span style={{ flex: 1 }}>절세 금액</span>
        <span style={{ width: 110, textAlign: "right", color: "var(--blue)", fontSize: 15 }}>
          {t.savedTax.toLocaleString()}원
        </span>
      </div>
    </div>
  );
};

const EarlyTerminationSection = () => {
  const [open, setOpen] = useState(false);

  const nowValue = ASSET_SUMMARY.totalValue;
  const recaptureTax = 142_000;
  const terminationFee = 50_000;
  const earlyReceive = nowValue - recaptureTax - terminationFee;

  return (
    <div>
      <div className="card" style={{ background: "var(--orange-light)" }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "var(--orange)" }}>⚠️ 중도해지 시 주의사항</div>
        <p style={{ fontSize: 13, color: "#000", lineHeight: 1.7 }}>
          의무 가입기간(3년) 이내 해지 시 그동안 받은 세금 혜택이 취소될 수 있습니다.
        </p>
      </div>

      <button className="btn-navy" onClick={() => setOpen(true)}>중도해지 예상 조회</button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title">해지/유지 비용 비교</div>
              <button className="modal-close" onClick={() => setOpen(false)} aria-label="닫기">✕</button>
            </div>

            <div className="compare-box">
              <div className="compare-header">
                <div />
                <div className="compare-col-left">중도해지</div>
                <div className="compare-col-right">만기 유지</div>
              </div>

              <div className="compare-row">
                <div className="compare-label">해지 세금</div>
                <div className="compare-val">{`-${recaptureTax.toLocaleString()}원`}</div>
                <div className="compare-val">0원</div>
              </div>

              <div className="compare-row">
                <div className="compare-label">해지 수수료</div>
                <div className="compare-val">{`-${terminationFee.toLocaleString()}원`}</div>
                <div className="compare-val">0원</div>
              </div>

              <div className="compare-row">
                <div className="compare-label">체감 수령/가치</div>
                <div className="compare-val-strong">{earlyReceive.toLocaleString()}원</div>
                <div className="compare-val-strong">{nowValue.toLocaleString()}원 + 혜택 유지</div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: "var(--gray-600)", lineHeight: 1.6, marginTop: 12 }}>
              지금 해지하면{" "}
              <b style={{ color: "var(--red)" }}>{(recaptureTax + terminationFee).toLocaleString()}원</b>{" "}
              만큼 비용이 발생할 수 있어요. 가능하면 만기 유지가 유리할 수 있습니다.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
              <button className="btn-primary" onClick={() => setOpen(false)}>유지하고 혜택 지키기</button>
              <button className="btn-secondary" onClick={() => alert("고객센터 문의 😛")}>그래도 해지</button>
            </div>

            <div style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 10, lineHeight: 1.5 }}>
              * 추징세/수수료는 계좌유형·가입기간·약관에 따라 달라질 수 있습니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AssetPage = ({ onBack }: { onBack: () => void }) => {
  const tabs = ["가입 정보", "세금 상세내역", "중도해지 예상조회"];
  const periods = ["1주", "1달", "3달", "6달", "올해", "전체"] as const;

  const [activeTab, setActiveTab] = useState(0);
  const [activePeriod, setActivePeriod] = useState<(typeof periods)[number]>("1달");
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const tax = useMemo(
    () => calcIsaTax({ accountType: ASSET_SUMMARY.accountType, dividend: ASSET_SUMMARY.dividendYTD, loss: ASSET_SUMMARY.lossYTD }),
    []
  );

  useEffect(() => {
    const OFFSET = 56 + 48 + 320 + 260;
    const observers = sectionRefs.current.map((ref, idx) => {
      if (!ref) return null;
      const io = new IntersectionObserver(
        ([entry]) => entry.isIntersecting && setActiveTab(idx),
        { rootMargin: `-${OFFSET}px 0px -30% 0px`, threshold: 0 }
      );
      io.observe(ref);
      return io;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  const scrollToSection = useCallback((idx: number) => {
    setActiveTab(idx);
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const chartData = CHART_DATA[activePeriod];

  const limit = 2000;
  const deposited = 1200;
  const remaining = limit - deposited;
  const depositRate = deposited / limit;

  const exemptLimit = 500;
  const exemptUsed = 142;
  const exemptRate = exemptUsed / exemptLimit;

  return (
    <div style={{ background: "var(--gray-50)", minHeight: "100vh" }}>
      <PageHeader title="ISA 자산 현황" onBack={onBack} />

      <div className="asset-hero" style={{ boxShadow: "var(--shadow)" }}>
        <div style={{ fontSize: 13, color: "var(--gray-400)", marginBottom: 4 }}>총 평가금액</div>
        <div className="asset-amount">{ASSET_SUMMARY.totalValue.toLocaleString()}원</div>
        <div className="asset-profit">
          +{ASSET_SUMMARY.profitAmount.toLocaleString()}원 &nbsp;
          <span style={{ fontSize: 13 }}>+{ASSET_SUMMARY.profitRate}%</span>
        </div>
        <div className="asset-bank">퀀팃증권 · 110-****-1103</div>

        <div style={{ display: "flex", gap: 16, padding: "12px 0", borderTop: "1px solid var(--gray-100)" }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--gray-400)", marginBottom: 2 }}>오늘 수익</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--red)" }}>+23,400원</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--gray-400)", marginBottom: 2 }}>이번 달 배당</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--blue)" }}>+52,000원</div>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--white)", padding: "20px 16px 4px", marginBottom: 12 }}>
        <div className="period-tabs">
          {periods.map((p) => (
            <button key={p} className={`period-tab ${activePeriod === p ? "active" : ""}`} onClick={() => setActivePeriod(p)}>
              {p}
            </button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3182f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3182f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#8b95a1" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="value" stroke="#3182f6" strokeWidth={2} fill="url(#colorValue)" dot={false} activeDot={{ r: 4, fill: "#3182f6" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <div className="section-title" style={{ paddingTop: 8 }}>주요 지표</div>

        <div className="grid-2" style={{ marginBottom: 10 }}>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 12, color: "var(--gray-400)", marginBottom: 8, fontWeight: 500 }}>평가 수익률</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "var(--red)", letterSpacing: -1, lineHeight: 1.1, marginBottom: 4 }}>
              +{ASSET_SUMMARY.profitRate}%
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--red)", opacity: 0.8 }}>
              +{ASSET_SUMMARY.profitAmount.toLocaleString()}원
            </div>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 12, color: "var(--gray-400)", marginBottom: 8, fontWeight: 500 }}>누적 절세 금액</div>
            {/* ✅ 이제 상세내역과 동일한 calc 결과 사용 */}
            <div style={{ fontSize: 26, fontWeight: 900, color: "var(--blue)", letterSpacing: -1, lineHeight: 1.1, marginBottom: 4 }}>
              {(tax.savedTax / 10000).toFixed(1)}만원
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--blue)", opacity: 0.7 }}>세금 혜택 적용 중</div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-800)" }}>올해 납입 한도</span>
            <span style={{ fontSize: 15, fontWeight: 900, color: "var(--blue)" }}>{Math.round(depositRate * 100)}%</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--gray-400)", marginBottom: 3 }}>총 한도</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-800)" }}>{limit.toLocaleString()}만원</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--gray-400)", marginBottom: 3 }}>누적 입금</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-800)" }}>{deposited.toLocaleString()}만원</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "var(--gray-400)", marginBottom: 3 }}>추가 납입 가능</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "var(--blue)" }}>{remaining.toLocaleString()}만원</div>
            </div>
          </div>

          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${depositRate * 100}%` }} />
          </div>
          <div style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 8 }}>
            {deposited.toLocaleString()}만원 납입 완료 · {remaining.toLocaleString()}만원 남음
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-800)" }}>비과세 한도 사용률</span>
            <span style={{ fontSize: 15, fontWeight: 900, color: "var(--green)" }}>{Math.round(exemptRate * 100)}%</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--gray-400)", marginBottom: 3 }}>비과세 한도</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-800)" }}>{exemptLimit}만원</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--gray-400)", marginBottom: 3 }}>사용액</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gray-800)" }}>{exemptUsed}만원</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "var(--gray-400)", marginBottom: 3 }}>잔여 한도</div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "var(--green)" }}>{exemptLimit - exemptUsed}만원</div>
            </div>
          </div>

          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${exemptRate * 100}%`, background: "var(--green)" }} />
          </div>
          <div style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 8 }}>
            {exemptUsed}만원 사용 · {exemptLimit - exemptUsed}만원 남음
          </div>
        </div>
      </div>

      <StickyTabs tabs={tabs} active={activeTab} onClick={scrollToSection} top={56} />

      <div style={{ padding: "0 0 60px" }}>
        <div ref={(el) => { sectionRefs.current[0] = el; }} className="section" style={{ scrollMarginTop: 112 }}>
          <div className="section-title">가입 정보</div>
          <SubscriptionInfoSection />
        </div>

        <div ref={(el) => { sectionRefs.current[1] = el; }} className="section" style={{ scrollMarginTop: 112 }}>
          <div className="section-title">세금 상세내역</div>
          <TaxDetailSection
            accountType={ASSET_SUMMARY.accountType}
            dividendYTD={ASSET_SUMMARY.dividendYTD}
            lossYTD={ASSET_SUMMARY.lossYTD}
          />
        </div>

        <div ref={(el) => { sectionRefs.current[2] = el; }} className="section" style={{ scrollMarginTop: 112 }}>
          <div className="section-title">중도해지 예상조회</div>
          <EarlyTerminationSection />
        </div>
      </div>
    </div>
  );
};

/* ───────── Main ───────── */

const MainPage = ({ onNavigate }: { onNavigate: (s: "main" | "product" | "asset") => void }) => (
  <div style={{ minHeight: "100vh", background: "var(--white)" }}>
    <div style={{ padding: "16px 20px 0" }}>
      <span style={{ fontSize: 22, color: "var(--gray-800)", cursor: "pointer" }}>‹</span>
    </div>

    <div style={{ textAlign: "center", padding: "24px 24px 0" }}>
      <div style={{ fontSize: 13, color: "var(--gray-400)", marginBottom: 12, letterSpacing: 0.2 }}>
        배당 성장 투자 &nbsp;|&nbsp; 글로벌 배당 ETF
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--gray-800)", lineHeight: 1.35, letterSpacing: -1 }}>
        세금 혜택으로<br />스마트한 ISA 투자
      </h1>
    </div>

    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "28px 0 20px", fontSize: 96 }}>
      🏦
    </div>

    <div style={{ display: "flex", borderTop: "1px solid var(--gray-200)", borderBottom: "1px solid var(--gray-200)", margin: "0 20px 32px", padding: "20px 0" }}>
      {[
        { label: "최소 투자금", value: "100만원" },
        { label: "투자 방식", value: "자문" },
        { label: "비과세 최대", value: "400만원" },
      ].map((item, idx, arr) => (
        <div key={item.label} style={{ flex: 1, textAlign: "center", borderRight: idx < arr.length - 1 ? "1px solid var(--gray-200)" : "none" }}>
          <div style={{ fontSize: 11, color: "var(--gray-400)", marginBottom: 6, fontWeight: 500 }}>{item.label}</div>
          <div style={{ fontSize: 17, fontWeight: 900, color: "var(--gray-800)", letterSpacing: -0.5 }}>{item.value}</div>
        </div>
      ))}
    </div>

    <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 12 }}>
      <button className="btn-navy" onClick={() => onNavigate("product")}>ISA 투자 하기</button>
      <button className="btn-navy-outline" onClick={() => onNavigate("asset")}>내 자산 현황 보기</button>
    </div>

    <div style={{ padding: "24px 20px 40px" }}>
      <div className="card" style={{ background: "var(--gray-50)" }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "var(--gray-800)" }}>💡 ISA 계좌란?</div>
        <p style={{ fontSize: 13, color: "var(--gray-600)", lineHeight: 1.7 }}>
          다양한 금융상품을 하나의 계좌로 운용하며 수익에 대해{" "}
          <strong style={{ color: "#1a2744" }}>최대 400만원까지 비과세</strong>{" "}
          혜택을 받을 수 있는 절세 전용 계좌입니다.
        </p>
      </div>
    </div>
  </div>
);

export default function ISAApp() {
  const [screen, setScreen] = useState<"main" | "product" | "asset">("main");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="app-wrap">
        {screen === "main" && <MainPage onNavigate={setScreen} />}
        {screen === "product" && <ISAProductPage onBack={() => setScreen("main")} />}
        {screen === "asset" && <AssetPage onBack={() => setScreen("main")} />}
      </div>
    </>
  );
}
