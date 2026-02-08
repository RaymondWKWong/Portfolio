import React from "react";
import TimelineEntry from "./TimelineEntry";
import LogoIMC from "../../Assets/Logos/IMC_Logo.jpg";
import LogoOrionHack from "../../Assets/Logos/OrionHack_Logo.jpg";
import LogoMorganStanley from "../../Assets/Logos/MorganStanleyLogo.jpg";
import Logo10DS from "../../Assets/Logos/10DS_Logo.jpg";
import LogoAnthropic from "../../Assets/Logos/Anthropic_Logo.jpg";
import LogoManGroup from "../../Assets/Logos/ManGroup_Logo.jpg";
import LogoQuantMinds from "../../Assets/Logos/QuantMinds_Logo.jpg";

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

function CompetitionsCard() {
  return (
    <div className="about-section-box">
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
  );
}

export default CompetitionsCard;
