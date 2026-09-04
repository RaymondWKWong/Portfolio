import IMC from "../Assets/Projects/IMC.webp";
import MakaStory from "../Assets/Projects/makastory.webp";
import SignBridge from "../Assets/Projects/signbridge.webp";
import OrionHack from "../Assets/Projects/orionhack.webp";
import Gold from "../Assets/Projects/gold.webp";
import MetaAnalysis from "../Assets/Projects/meta-analysis.webp";

export const projects = [
  {
    serial: "01",
    year: "2025",
    title: "IMC Prosperity",
    prestige: "107th Global · 9th UK · 20,000+ teams",
    summary:
      "Algorithmic trading hackathon. Market making, statistical arbitrage, Black-Scholes pricing, delta hedging across 15 trading days.",
    image: IMC,
    imageAlt: "IMC Prosperity Trading hackathon dashboard",
    stack: ["Python", "NumPy", "Black-Scholes", "Stat. Arbitrage"],
    duration: "15 days · April 2025",
    outcome:
      "107th out of 20,000+ teams globally. 9th in the UK. Built from a blank repo to a live multi-strategy book.",
    details:
      "Implemented market making with fair-value estimation across commodities and ETFs, statistical arbitrage on correlated pairs, Black-Scholes options pricing with delta hedging, and inventory-aware position sizing. Strategies competed against other teams in a simulated exchange.",
    links: [
      {
        label: "Write-up",
        href: "https://www.linkedin.com/feed/update/urn:li:activity:7192945639297564672/",
      },
    ],
  },
  {
    serial: "02",
    year: "2025",
    title: "Meta-Analysis · Metal 3D Printing",
    prestige: "Materials & Design · Published 2025",
    summary:
      "Statistical and ML analysis of metal 3D-printing literature data. DNN, LightGBM, CatBoost. Sensitivity analysis for interpretation.",
    image: MetaAnalysis,
    imageAlt:
      "Meta-analysis of literature data for metal additive manufacturing",
    stack: ["Python", "DNN", "LightGBM", "CatBoost", "SHAP"],
    duration: "PhD · Imperial",
    outcome:
      "Published in Materials &amp; Design (2025). arXiv preprint 2308.16621. Forms part of the PhD thesis.",
    details:
      "Built a large meta-dataset from metal additive-manufacturing literature, then trained DNN, LightGBM and CatBoost models to predict mechanical properties from process and composition. Sensitivity analysis interprets which features actually drive predictions, separating physically meaningful effects from data artifacts.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/RaymondWKWong/MetaAnalysis_MetalAM",
      },
      { label: "arXiv", href: "https://doi.org/10.48550/arXiv.2308.16621" },
    ],
  },
  {
    serial: "03",
    year: "2024",
    title: "Gold Price Workshop",
    prestige: "Imperial Algorithmic Trading Society",
    summary:
      "Gold price forecast from daily moves of other precious metals. Delivered as a workshop tutorial.",
    image: Gold,
    imageAlt: "Gold price prediction workshop",
    stack: ["Python", "scikit-learn", "Pandas", "Matplotlib"],
    duration: "Imperial AlgoSoc",
    outcome:
      "Delivered to a full lecture theatre of Imperial undergrads. Materials still used in society teaching.",
    details:
      "Forecast gold's daily percentage move from the daily moves of other precious metals (silver, platinum, palladium). Walked through feature engineering, train/test split, regression vs. tree models, and how to read predicted-vs-actual plots without fooling yourself.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/RaymondWKWong/AlgoTrading-ML-Workshop",
      },
    ],
  },
  {
    serial: "04",
    year: "2023",
    title: "MakaStory",
    prestige: "Morgan Stanley Code to Give · Top 10",
    summary:
      "Accessible story generator for children with impairments and mobility limitations. Text, speech, and sign-language input through a tailored ML model.",
    image: MakaStory,
    imageAlt: "MakaStory accessible story generator",
    stack: [
      "React",
      "Python",
      "ML model",
      "Speech-to-text",
      "Sign-language CV",
    ],
    duration: "5 days · Code to Give",
    outcome:
      "Top 10 out of all teams at Morgan Stanley's Code to Give. Demoed to non-profit partners and Morgan Stanley judges.",
    details:
      "A web app that generates illustrated stories for children with mobility or speech impairments. Accepts text, speech, or sign-language input, routed through a tailored ML pipeline that produces age-appropriate narrative text and matched illustrations.",
    links: [
      { label: "GitHub", href: "https://github.com/ruihanjc/CodeToGive" },
    ],
  },
  {
    serial: "05",
    year: "2023",
    title: "Satellite Collisions",
    prestige: "OrionHack · 2nd place",
    summary:
      "LSTM forecasting collision risk between satellites and orbital debris. Live data visualised so high-risk zones surface immediately.",
    image: OrionHack,
    imageAlt: "OrionHack satellite collision risk visualisation",
    stack: ["Python", "PyTorch", "LSTM", "WebGL viz"],
    duration: "2 days · OrionHack",
    outcome:
      "2nd place. Picked up by Orion's mentors as a viable industry brief.",
    details:
      "Trained an LSTM on historical TLE data to forecast collision risk between active satellites and tracked debris. The web viz pins live data over a 3D globe so operators can see high-risk passes coming, not just a probability number after the fact.",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/RaymondWKWong/OrionHack-Hackathon",
      },
    ],
  },
  {
    serial: "06",
    year: "2023",
    title: "SignBridge",
    prestige: "CNN classifier · 90%+ accuracy",
    summary:
      "Real-time sign-language ↔ text translation. Built to bridge literacy gaps between hearing and Deaf communities.",
    image: SignBridge,
    imageAlt: "SignBridge sign-language translation interface",
    stack: ["Python", "TensorFlow", "CNN", "OpenCV", "WebApp"],
    duration: "Hackathon weekend",
    outcome:
      "Trained CNN classifier reached 90%+ accuracy on the demo set. DevPost demo public.",
    details:
      "A two-way translator. Webcam feed runs through a CNN classifier that maps hand-pose to sign-language tokens, mapping back to text. Reverse direction synthesises sign-language animations from text input.",
    links: [
      { label: "DevPost", href: "https://devpost.com/software/team-straddle" },
    ],
  },
];
