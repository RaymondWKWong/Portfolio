import React, { useState } from "react";
import GitHubCalendar from "react-github-calendar";
import Reveal from "../ui/Reveal";
import { techStack } from "../../data/skills";
import styles from "./SkillsTools.module.css";

function SkillsTools() {
  const [calendarFailed, setCalendarFailed] = useState(false);

  return (
    <div className={styles.wrap} id="stack">
      <div className={styles.head}>
        <p className={styles.label}>Stack</p>
      </div>

      <Reveal>
        <div className={styles.row}>
          <p className={styles.rowLabel}>Languages &amp; frameworks</p>
          <ul className={styles.iconList}>
            {techStack.map(({ Icon, label }) => (
              <li key={label} className={styles.iconItem}>
                <Icon className={styles.icon} aria-hidden="true" />
                <span className={styles.iconLabel}>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {!calendarFailed && (
        <Reveal className={styles.calendar}>
          <p className={styles.rowLabel}>Days I code</p>
          <div className={styles.calendarFrame}>
            <ErrorBoundary onError={() => setCalendarFailed(true)}>
              <GitHubCalendar
                username="RaymondWKWong"
                blockSize={13}
                blockMargin={4}
                color="#0a0a0b"
                fontSize={14}
              />
            </ErrorBoundary>
          </div>
        </Reveal>
      )}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    if (this.props.onError) this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default SkillsTools;
