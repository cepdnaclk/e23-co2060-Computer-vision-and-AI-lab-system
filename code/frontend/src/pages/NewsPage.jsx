import { useEffect, useMemo, useState } from "react";
import { T } from "../styles/theme";
import { Badge, Card, Divider, SectionLabel, SectionTitle } from "../components/UI";
import { NEWS_ITEMS } from "../data/labData";
import { getNews } from "../services/api";

function formatNewsDate(value) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function normalizeNews(rows) {
  return Array.isArray(rows) ? rows.map((item) => ({
    category: item.category || item.type || "News",
    title: item.title,
    content: item.content || item.desc || "",
    published_date: item.published_date || item.date,
  })) : [];
}

export function NewsPage() {
  const [news, setNews] = useState(NEWS_ITEMS);

  useEffect(() => {
    let cancelled = false;
    const loadNews = async () => {
      try {
        const response = await getNews();
        const rows = normalizeNews(response.data);
        if (!cancelled && rows.length > 0) setNews(rows);
      } catch (error) {
        console.error("Failed to fetch news", error);
      }
    };
    loadNews();
    return () => { cancelled = true; };
  }, []);

  const shown = useMemo(() => news, [news]);

  return (
    <div className="page-shell section-padding">
      <SectionLabel text="News" />
      <SectionTitle>Latest updates and events</SectionTitle>
      <Divider />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        {shown.map((item) => (
          <Card key={item.title} style={{ padding: "1.2rem", borderTop: `3px solid ${T.gold}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".7rem", flexWrap: "wrap" }}>
              <Badge label={item.category} tone="Pending" />
              <span style={{ color: T.textLight, fontSize: ".77rem" }}>{formatNewsDate(item.published_date || item.date)}</span>
            </div>
            <div style={{ fontWeight: 700, color: T.navyDark, lineHeight: 1.5 }}>{item.title}</div>
            <p style={{ color: T.textMid, lineHeight: 1.7, fontSize: ".88rem", marginBottom: 0 }}>{item.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
