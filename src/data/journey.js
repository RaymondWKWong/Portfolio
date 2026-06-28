import LogoUoB from "../Assets/Logos/UoB_Logo.jpg";
import LogoImperial from "../Assets/Logos/Imperial_Logo.jpg";
import LogoDaler from "../Assets/Logos/DalerTrading_Logo.jpg";
import Logo01C from "../Assets/Logos/01C_Logo.jpg";
import LogoIMC from "../Assets/Logos/IMC_Logo.jpg";
import LogoOrionHack from "../Assets/Logos/OrionHack_Logo.jpg";
import LogoMorganStanley from "../Assets/Logos/MorganStanleyLogo.jpg";
import LogoAnthropic from "../Assets/Logos/Anthropic_Logo.jpg";
import Logo10DS from "../Assets/Logos/10DS_Logo.jpg";
import news01C from "../Assets/01C_TechEU.jpg";
import news01CPortal from "../Assets/01C_TechNews.png";

export const journey = [
  {
    serial: "01",
    visualKey: "01C",
    chapter: "01C",
    wordmark: "01C",
    accent: "#b8902f",
    bg: "#ffffff",
    period: "Oct 2025 to present",
    role: "CTO",
    org: "01C",
    logo: Logo01C,
    headline: "Building 3D worlds powered by LLMs.",
    body: [
      "CTO at 01C, building Amara — our system that generates full 3D worlds from a single prompt.",
      "Featured in tech.eu and The Tech News Portal. The work sits at the seam between language models and rendered reality, which is exactly the seam I want to be on.",
    ],
    news: [
      {
        image: news01C,
        title:
          "01C launches Amara to generate full 3D worlds from simple prompts",
        source: "tech.eu",
        date: "Feb 2, 2026",
        url: "https://tech.eu/2026/02/02/01c-launches-amara-to-generate-full-3d-worlds-from-simple-prompts/",
      },
      {
        image: news01CPortal,
        title:
          "01C wants to erase the friction between imagination and 3D world-building",
        source: "The Tech News Portal",
        date: "2026",
        url: "https://thetechnewsportal.com/latest/01c-wants-to-erase-the-friction-between-imagination-and-3d-world-building",
      },
    ],
  },
  {
    serial: "02",
    visualKey: "IMPERIAL",
    chapter: "Imperial",
    wordmark: "IMPERIAL",
    accent: "#0066cc",
    bg: "#f5f5f7",
    period: "2022 to present",
    role: "PhD · Applied Machine Learning",
    org: "Imperial College London",
    logo: LogoImperial,
    headline: "PhD in Applied Machine Learning.",
    body: [
      "PhD at Imperial bridging materials science and machine learning. Building interpretable models that capture underlying physics.",
    ],
    pills: [
      "Best Research @ ISAM",
      "Teaching Assistant of the Year",
      "Materials & Design · Journal of Applied Physics",
      "Faculty of Engineering Teaching Award · Nominated",
    ],
  },
  {
    serial: "03",
    visualKey: "DALER",
    chapter: "Daler",
    wordmark: "DALER",
    accent: "#1d1d1f",
    bg: "#ffffff",
    period: "May to Oct 2025",
    role: "Quantitative Researcher",
    org: "Daler Trading",
    logo: LogoDaler,
    headline: "Transformer-based strategies, 1.8 Sharpe.",
    body: [
      "Quant Researcher at Daler. Built novel transformer-based mid-term trading strategies achieving a 1.8 Sharpe ratio.",
      "Independently predicted major market corrections with 15% returns inside 3-day windows.",
    ],
    pills: [
      "Transformer · 1.8 Sharpe",
      "15% returns · 3-day windows",
      "Deep learning · Time-series",
    ],
  },
  {
    serial: "04",
    visualKey: "BRISTOL",
    chapter: "Bristol",
    wordmark: "BRISTOL",
    accent: "#1d1d1f",
    bg: "#f5f5f7",
    period: "2017 to 2022",
    role: "MSc",
    org: "University of Bristol",
    logo: LogoUoB,
    headline: "Maths, computing, and the systems they describe.",
    body: [
      "BEng in Mechanical Engineering at the University of Bristol, then an MSc in Engineering Mathematics — maths and computing applied to real-world systems: robotics, simulations, computational neuroscience.",
      "That intersection between abstract models and physical behaviour set up everything that came after.",
    ],
    pills: [
      "Dean's List × 2",
    ],
  },
  {
    serial: "05",
    visualKey: "HACKATHONS",
    chapter: "Hackathons",
    wordmark: "HACKED",
    accent: "#1d1d1f",
    bg: "#ffffff",
    period: "2023 to 2025",
    role: "Trading · ML · Social impact",
    org: "Globally · UK · London",
    headline: "Trading, ML, and social-impact hackathons.",
    body: [
      "107th globally and 9th in the UK at IMC Prosperity (out of 20,000+ teams). 2nd at OrionHack. Top 10 at Morgan Stanley's Code to Give.",
      "Plus Anthropic Agents, Man Group, QuantMinds TradeEntry, and 10 Downing Street's Rewire the State.",
    ],
    pills: [
      "107th Global @ IMC Prosperity",
      "9th UK · 20,000+ teams",
      "2nd place @ OrionHack",
      "Top 10 @ Morgan Stanley Code to Give",
      "Rewire the State @ 10 Downing Street",
    ],
    visualGrid: [
      LogoIMC,
      LogoOrionHack,
      LogoMorganStanley,
      LogoAnthropic,
      Logo10DS,
    ],
  },
];
