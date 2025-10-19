import React, { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

// 📦 임의 데이터 생성
function generateFakeData() {
  const categories = ["도시락", "샌드위치", "음료", "디저트", "즉석식품"];
  const stores = ["강남점", "경희대점", "홍대점", "부산서면점"];
  const rows = [];

  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const store = stores[Math.floor(Math.random() * stores.length)];
    const qty = Math.floor(Math.random() * 10) + 1;
    const sales = Math.random() * 5 + 0.5;
    const daysLeft = Math.floor(Math.random() * 10);
    const score = qty / (sales * (daysLeft + 1));
    const band =
      score >= 0.85
        ? "Very High"
        : score >= 0.7
        ? "High"
        : score >= 0.5
        ? "Medium"
        : score >= 0.3
        ? "Low"
        : "Very Low";
    rows.push({ store, category, qty, sales, daysLeft, score, band });
  }
  return rows;
}

export default function App() {
  const allRows = useMemo(() => generateFakeData(), []);
  const [selectedStore, setSelectedStore] = useState("경희대점");

  // 선택된 점포 데이터만 표시
  const rows = allRows.filter((r) => r.store === selectedStore);

  // 위험도 순서 및 색상 정의
  const bandOrder = ["Very Low", "Low", "Medium", "High", "Very High"];
  const bandColors = {
    "Very Low": "#3b82f6",
    Low: "#4ade80",
    Medium: "#facc15",
    High: "#f97316",
    "Very High": "#ef4444",
  };
  const bandLevels = {
    "Very Low": 1,
    Low: 2,
    Medium: 3,
    High: 4,
    "Very High": 5,
  };

  // 🔹 위험도 순 정렬
  const sortedRows = [...rows].sort(
    (a, b) => bandLevels[b.band] - bandLevels[a.band]
  );

  // 🔹 위험도 분포
  const counts = new Map(bandOrder.map((b) => [b, 0]));
  for (const r of rows) {
    if (counts.has(r.band)) counts.set(r.band, counts.get(r.band) + 1);
  }

  // 📊 BarChart
  const barData = {
    labels: bandOrder,
    datasets: [
      {
        label: `${selectedStore} 상품 개수`,
        data: bandOrder.map((b) => counts.get(b) ?? 0),
        backgroundColor: bandOrder.map((b) => bandColors[b]),
      },
    ],
  };

  // 📈 LineChart (최근 7일 폐기율/판매율)
  const lineData = {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    datasets: [
      {
        label: "폐기율(%)",
        data: Array(7)
          .fill(0)
          .map(() => (Math.random() * 10 + 2).toFixed(1)),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239,68,68,0.3)",
        fill: true,
        tension: 0.3,
      },
      {
        label: "판매율(%)",
        data: Array(7)
          .fill(0)
          .map(() => (Math.random() * 15 + 50).toFixed(1)),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.3)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  // 🍰 PieChart (카테고리별)
  const categoryCount = rows.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});
  const pieData = {
    labels: Object.keys(categoryCount),
    datasets: [
      {
        data: Object.values(categoryCount),
        backgroundColor: [
          "#3b82f6",
          "#22c55e",
          "#eab308",
          "#f97316",
          "#ef4444",
        ],
      },
    ],
  };

  // 🏁 CompareChart (점포 vs 본사)
  const compareData = {
    labels: ["폐기율", "판매율", "재고회전율"],
    datasets: [
      {
        label: selectedStore,
        data: [
          Math.random() * 10 + 5,
          Math.random() * 70 + 20,
          Math.random() * 5,
        ],
        backgroundColor: "#3b82f6",
      },
      {
        label: "본사 평균",
        data: [10, 60, 4],
        backgroundColor: "#9ca3af",
      },
    ],
  };

  // 🟢 위험도 동그라미 함수
  const renderDots = (band) => {
    const level = bandLevels[band];
    const color = bandColors[band];
    return (
      <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: i < level ? color : "#e5e7eb",
              }}
            />
          ))}
      </div>
    );
  };

  return (
    <div style={{ padding: 20, fontFamily: "Pretendard, sans-serif" }}>
      <h1>🏪 폐기 위험도 대시보드</h1>

      {/* ✅ 점포 선택 */}
      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor="store-select"
          style={{ fontWeight: "bold", marginRight: 8 }}
        >
          점포 선택:
        </label>
        <select
          id="store-select"
          value={selectedStore}
          onChange={(e) => setSelectedStore(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        >
          <option value="경희대점">경희대점</option>
          <option value="강남점">강남점</option>
          <option value="홍대점">홍대점</option>
          <option value="부산서면점">부산서면점</option>
        </select>
      </div>

      {/* 🧭 전체를 좌우 2컬럼으로 배치 */}
      <div style={{ display: "flex", gap: "30px" }}>
        {/* 왼쪽 섹션 */}
        <div style={{ flex: 1 }}>
          <h3>📊 위험도 분포</h3>
          <Bar data={barData} />

          <h3 style={{ marginTop: 30 }}>🟡 세부 상품 목록 (위험도순)</h3>
          <table
            border="1"
            cellPadding="8"
            style={{
              marginTop: 10,
              width: "100%",
              textAlign: "center",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th>카테고리</th>
                <th>재고</th>
                <th>판매속도</th>
                <th>잔여일수</th>
                <th>점수</th>
                <th>위험도</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((r, i) => (
                <tr key={i}>
                  <td>{r.category}</td>
                  <td>{r.qty}</td>
                  <td>{r.sales.toFixed(1)}</td>
                  <td>{r.daysLeft}</td>
                  <td>{r.score.toFixed(2)}</td>
                  <td>
                    {renderDots(r.band)}
                    <div
                      style={{ fontSize: "0.8rem", color: bandColors[r.band] }}
                    >
                      {r.band}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 오른쪽 섹션 */}
        <div style={{ flex: 1 }}>
          <h3>📈 최근 7일 폐기/판매 추세</h3>
          <Line data={lineData} />

          <h3 style={{ marginTop: 40 }}>🍰 카테고리별 비중</h3>
          <div style={{ maxWidth: 400 }}>
            <Pie data={pieData} />
          </div>

          <h3 style={{ marginTop: 40 }}>🏁 점포 vs 본사 평균 비교</h3>
          <Bar data={compareData} />
        </div>
      </div>
    </div>
  );
}
