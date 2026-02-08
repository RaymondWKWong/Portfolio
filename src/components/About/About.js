import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import Github from "./Github";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import ConferencesCard from "./ConferencesCard";

import AboutSlideshow from "./Slideshow_About"
import NewsCard from "./NewsCard";

function About() {
  return (
    <Container fluid className="about-section">
      <Particle />
      <Container>

        <h1 className="project-heading">
          In The <strong className="purple">News</strong>
        </h1>
        <NewsCard />

        <Row style={{ justifyContent: "center", padding: "10px" }}>
          <Col
            md={12}
            style={{
              justifyContent: "center",
              paddingTop: "30px",
              paddingBottom: "20px",
            }}
          >
            <h1 style={{ fontSize: "2.1em", paddingBottom: "20px", paddingLeft: "66px" }}>
              <strong className="purple"> ABOUT ME </strong>
            </h1>
            <Aboutcard />
          </Col>

          <Col
            md={8}
            style={{ paddingTop: "10px", paddingBottom: "50px" }}
          >
            <AboutSlideshow />
          </Col>
        </Row>

        <h1 className="project-heading">
          <strong className="purple">Conferences</strong>
        </h1>
        <Row style={{ justifyContent: "center" }}>
          <Col md={8}>
            <ConferencesCard />
          </Col>
        </Row>

        <h1 className="project-heading">
          Professional <strong className="purple">Skillset </strong>
        </h1>

        <Techstack />

        <Github />
      </Container>
    </Container>
  );
}

export default About;
