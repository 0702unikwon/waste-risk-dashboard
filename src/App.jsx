import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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
    let band =
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
  const rows = useMemo(() => generateFakeData(), []);

  const bandCount = rows.reduce((acc, r) => {
    acc[r.band] = (acc[r.band] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(bandCount),
    datasets: [
      {
        label: "상품 개수",
        data: Object.values(bandCount),
        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#facc15",
          "#4ade80",
          "#3b82f6",
        ],
      },
    ],
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📦 폐기 위험도 대시보드 (예시)</h1>
      <p>임의로 생성된 50개 상품의 폐기 위험도 분포</p>
      <Bar data={data} />
      <table border="1" cellPadding="8" style={{ marginTop: 20, width: "100%" }}>
        <thead>
          <tr>
            <th>매장</th>
            <th>카테고리</th>
            <th>재고</th>
            <th>판매속도</th>
            <th>잔여일수</th>
            <th>점수</th>
            <th>위험도</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.store}</td>
              <td>{r.category}</td>
              <td>{r.qty}</td>
              <td>{r.sales.toFixed(1)}</td>
              <td>{r.daysLeft}</td>
              <td>{r.score.toFixed(2)}</td>
              <td>{r.band}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
