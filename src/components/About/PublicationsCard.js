import React from "react";

const publicationsData = [
  {
    authors: "Wong, R., et al.",
    title: "Critical statistical assessment of data in metal additive manufacturing",
    journal: "Materials & Design",
    doi: "https://doi.org/10.1016/j.matdes.2025.114301",
    status: "published",
  },
  {
    authors: "Wong, R., et al.",
    title: "Interpretable machine learning for process-property of steels",
    journal: "Journal of Applied Physics",
    doi: null,
    status: "invited",
  },
];

function PublicationsCard() {
  return (
    <div className="about-section-box">
      {publicationsData.map((pub, index) => (
        <div key={index} className="publication-entry">
          <p className="publication-authors">{pub.authors}</p>
          <p className="publication-title">{pub.title}</p>
          <p className="publication-meta">
            <span className="publication-journal">{pub.journal}</span>
            {pub.status === "invited" && (
              <span className="publication-badge">Invited Submission</span>
            )}
          </p>
          {pub.doi && (
            <p className="publication-doi">
              <a href={pub.doi} target="_blank" rel="noopener noreferrer">
                {pub.doi}
              </a>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default PublicationsCard;
