import { T } from "../styles/theme";
import { Badge, Card, Divider, SectionLabel, SectionTitle } from "../components/UI";
import { PUBLICATIONS } from "../data/labData";

export function PublicationsPage() {
  return (
    <div className="page-shell section-padding">
      <SectionLabel text="Publications" />
      <SectionTitle>Research publications</SectionTitle>
      <Divider />
      <p style={{ color: T.textMid, fontSize: ".96rem", lineHeight: 1.8, marginBottom: "1.4rem", maxWidth: 760 }}>
        Peer-reviewed journal articles and conference papers from the lab. The presentation keeps the emphasis on content rather than visual gimmicks.
      </p>

      <Card style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="dtable">
            <thead>
              <tr>
                <th style={{ width: 84 }}>Year</th>
                <th>Title</th>
                <th>Authors</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              {PUBLICATIONS.map((paper) => (
                <tr key={paper.title}>
                  <td style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, color: T.navy }}>{paper.year}</td>
                  <td style={{ fontWeight: 600 }}>
                    {paper.title}
                    {paper.award && <span style={{ marginLeft: ".5rem" }}><Badge label={paper.award} /></span>}
                  </td>
                  <td style={{ color: T.textMid, fontSize: ".86rem" }}>{paper.authors}</td>
                  <td style={{ color: T.navy, fontSize: ".86rem", fontWeight: 600 }}>{paper.venue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
