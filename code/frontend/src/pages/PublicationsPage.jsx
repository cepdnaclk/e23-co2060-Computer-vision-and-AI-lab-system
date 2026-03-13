import { T } from "../styles/theme";
import { SectionLabel, SectionTitle, Divider } from "../components/UI";
import { PUBLICATIONS } from "../data/labData";

export function PublicationsPage() {
  return (
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      <SectionLabel text="Publications" />
      <SectionTitle>Research Publications</SectionTitle>
      <Divider />
      <p style={{ color: T.textMid, marginBottom: "2rem", fontSize: ".9rem" }}>
        Peer-reviewed journal articles, conference papers, and research output from lab members.
      </p>

      <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="dtable">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Year</th>
                <th>Title</th>
                <th>Authors</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              {PUBLICATIONS.map(p => (
                <tr key={p.title}>
                  <td style={{ fontFamily: "'Roboto Mono',monospace", fontWeight: 600, color: T.navy }}>{p.year}</td>
                  <td style={{ fontWeight: 600 }}>
                    {p.title}
                    {p.award && (
                      <span style={{ marginLeft: ".45rem", background: T.gold, color: T.white, padding: "1px 5px", fontSize: ".64rem", fontWeight: 700, borderRadius: 2 }}>
                        🏆 {p.award}
                      </span>
                    )}
                  </td>
                  <td style={{ color: T.textMid, fontSize: ".82rem" }}>{p.authors}</td>
                  <td style={{ color: T.navyLight, fontSize: ".82rem", fontWeight: 600 }}>{p.venue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
