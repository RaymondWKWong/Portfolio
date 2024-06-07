import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import IMC from "../../Assets/Projects/IMC.png";
import MakaStory from "../../Assets/Projects/makastory.png";
import SignBridge from "../../Assets/Projects/signbridge.png";
import OrionHack from "../../Assets/Projects/orionhack.png";
import Gold from "../../Assets/Projects/gold.png";
import Meta_Analysis from "../../Assets/Projects/meta analysis.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: '#333' }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
        <Col md={4} className="project-card">
            <ProjectCard 
              imgPath={IMC }
              isBlog={false}
              title="IMC Prosperity Trading"
              description="IMC’s 15-day Algorithmic Trading hackathon competing against 13,000+ participants. Algorithmic trading strategies implemented includes market making by estimating fair value of commodities and ETF, statistical
              arbitrage, applying Black-Scholes model for option pricing and delta hedging strategies."
              webLink="https://www.linkedin.com/feed/update/urn:li:activity:7192945639297564672/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={MakaStory}
              isBlog={false}
              title="MakaStory"
              description="Story generator web app for children with different impairments and mobility limitations, supporting text inputs, speech inputs and sign language inputs with a tailored machine learning model."
              ghLink="https://github.com/ruihanjc/CodeToGive"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={OrionHack}
              isBlog={false}
              title="Mitigating Risk of Collisions of Satellites and Debris "
              description="Trained LSTM model to predict risk of collisions for satellites and debris with visualisations of satellites and debris based on live data, highlighting areas with high risk to mitigate collisions."
              ghLink="https://github.com/RaymondWKWong/OrionHack-Hackathon"            
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={Gold}
              isBlog={false}
              title="Gold Price Prediction Workshop for AlgoTrading"
              description="Forecasting gold price based on the daily percentage change in the closing prices of other precious metals - Machine learning workshop tutorial for Imperial College London's Algorithmic Trading Society."
              ghLink="https://github.com/RaymondWKWong/AlgoTrading-ML-Workshop"
              demoLink="https://github.com/RaymondWKWong/AlgoTrading-ML-Workshop"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={Meta_Analysis}
              isBlog={false}
              title="Meta-Analysis of Literature Data for Metal 3D Printing"
              description="Applied statistical analysis methods to analyse raw data and constructing multiple machine learning models (DNN, LightGBM, CatBoost etc...) for predicting material properties and quality of print. Utilised sensitivity analysis analysis to interpret the trained models."
              ghLink="https://github.com/RaymondWKWong/MetaAnalysis_MetalAM"
              webLink="https://doi.org/10.48550/arXiv.2308.16621"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={SignBridge}
              isBlog={false}
              title="SignBridge"
              description="Platform to enable the real-time interpretation of sign language to text. Vice versa, we have also implemented the ability to translate from text to sign language to tackle the problem with illiteracy rate with a trained CNN classifier with over 90% accuracy."
              webLink="https://devpost.com/software/team-straddle"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
