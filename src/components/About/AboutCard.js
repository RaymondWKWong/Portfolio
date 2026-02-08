import React from "react";
import Card from "react-bootstrap/Card";

import TimelineEntry from "./TimelineEntry";
import PublicationsCard from "./PublicationsCard";
import Logo01C from "../../Assets/Logos/01C_Logo.jpg";
import LogoDaler from "../../Assets/Logos/DalerTrading_Logo.jpg";
import LogoImperial from "../../Assets/Logos/Imperial_Logo.jpg";
import LogoUoB from "../../Assets/Logos/UoB_Logo.jpg";
import LogoIMC from "../../Assets/Logos/IMC_Logo.jpg";
import LogoOrionHack from "../../Assets/Logos/OrionHack_Logo.jpg";
import LogoMorganStanley from "../../Assets/Logos/MorganStanleyLogo.jpg";
import Logo10DS from "../../Assets/Logos/10DS_Logo.jpg";
import LogoAnthropic from "../../Assets/Logos/Anthropic_Logo.jpg";
import LogoManGroup from "../../Assets/Logos/ManGroup_Logo.jpg";
import LogoQuantMinds from "../../Assets/Logos/QuantMinds_Logo.jpg";
import LogoAlgosoc from "../../Assets/Logos/Imperia_Algosoc_Logo.jpg";
import LogoQTC from "../../Assets/Logos/Imperial_QTC_Logo.jpg";

const competitionsData = [
  {
    logo: LogoAnthropic,
    name: "Anthropic Agents Hackathon",
    organization: "Anthropic",
    badge: null,
    year: "2025",
  },
  {
    logo: Logo10DS,
    name: "Rewire the State Hackathon",
    organization: "10 Downing Street",
    badge: null,
    year: "2025",
  },
  {
    logo: LogoIMC,
    name: "IMC Prosperity Trading",
    organization: "IMC Trading",
    badge: "107th Global | 9th UK",
    year: "2025",
  },
  {
    logo: LogoManGroup,
    name: "Man Group Hackathon",
    organization: "Man Group",
    badge: null,
    year: "2024",
  },
  {
    logo: LogoQuantMinds,
    name: "QuantMinds TradeEntry Hackathon",
    organization: "QuantMinds",
    badge: null,
    year: "2024",
  },
  {
    logo: LogoMorganStanley,
    name: "Code to Give",
    organization: "Morgan Stanley",
    badge: "Top 10",
    year: "2023",
  },
  {
    logo: LogoOrionHack,
    name: "OrionHack",
    organization: "OrionHack",
    badge: "2nd Place",
    year: "2023",
  },
];

const experienceData = [
  {
    logo: Logo01C,
    title: "Machine Learning | R&D Specialist",
    organization: "01C",
    dates: "Oct 2025 - Present",
  },
  {
    logo: LogoDaler,
    title: "Quantitative Researcher",
    organization: "Daler Trading",
    dates: "May - Oct 2025",
  },
  {
    logo: LogoAlgosoc,
    title: "Head of Corporate Relations",
    organization: "Algorithmic Trading Society",
    dates: "Oct 2023 - Oct 2025",
  },
  {
    logo: LogoQTC,
    title: "Analyst",
    organization: "Imperial College Investment Society",
    dates: "Oct 2023 - Oct 2025",
  },
  {
    logo: LogoImperial,
    title: "Graduate Teaching Assistant",
    organization: "Imperial College London",
    dates: "Oct 2022 - Oct 2025",
    badge: "Awarded Teaching Assistant of the Year",
  },
];

const educationData = [
  {
    logo: LogoImperial,
    title: "PhD Applied Machine Learning",
    organization: "Imperial College London",
    badge: "Awarded Best Research Poster | International Symposium on Advances in Metallurgy",
  },
  {
    logo: LogoUoB,
    title: "MSc Engineering Mathematics",
    organization: "University of Bristol",
  },
  {
    logo: LogoUoB,
    title: "BEng Mechanical Engineering",
    organization: "University of Bristol",
    badge: "Dean's List Award",
  },
];

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            I'm <span className="purple">Raymond Wong</span> — a PhD
            student at <span className="purple">Imperial College London</span>,
            specialising in <span className="purple">Applied Machine Learning</span>.
            I currently work as an ML & R&D Specialist at
            <span className="purple"> 01C</span>, building 3D worlds powered by
            LLMs. Previously, I was a Quantitative Researcher at
            <span className="purple"> Daler Trading</span>, developing trading
            strategies with deep learning and time series analysis.
          </p>

          <div className="about-section-box">
            <p className="about-section-box-title"><strong>Competitions</strong></p>
            {competitionsData.map((entry, index) => (
              <TimelineEntry
                key={index}
                logo={entry.logo}
                primaryText={entry.name}
                secondaryText={entry.organization}
                dates={entry.year}
                badge={entry.badge}
              />
            ))}
          </div>

          <div className="about-section-box">
            <p className="about-section-box-title"><strong>Experience</strong></p>
            {experienceData.map((entry, index) => (
              <TimelineEntry
                key={index}
                logo={entry.logo}
                primaryText={entry.title}
                secondaryText={entry.organization}
                dates={entry.dates}
                badge={entry.badge}
              />
            ))}
          </div>

          <div className="about-section-box">
            <p className="about-section-box-title"><strong>Education</strong></p>
            {educationData.map((entry, index) => (
              <TimelineEntry
                key={index}
                logo={entry.logo}
                primaryText={entry.title}
                secondaryText={entry.organization}
                dates={entry.dates}
                badge={entry.badge}
              />
            ))}
          </div>

          <p className="about-section-box-title"><strong>Publications</strong></p>
          <PublicationsCard />
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
