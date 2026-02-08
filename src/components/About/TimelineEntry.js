import React from "react";

function TimelineEntry({ logo, primaryText, secondaryText, dates, bullets, badge }) {
  return (
    <div className="timeline-entry">
      {logo ? (
        <img src={logo} alt={secondaryText} className="timeline-logo" />
      ) : (
        <div className="timeline-logo-placeholder">
          {secondaryText ? secondaryText.charAt(0) : "?"}
        </div>
      )}
      <div className="timeline-details">
        <p className="timeline-primary">{primaryText}</p>
        <p className="timeline-secondary">
          <span className="purple">{secondaryText}</span>
        </p>
        {dates && <p className="timeline-dates">{dates}</p>}
        {badge && <span className="timeline-badge">{badge}</span>}
        {bullets && bullets.length > 0 && (
          <ul className="timeline-bullets">
            {bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TimelineEntry;
