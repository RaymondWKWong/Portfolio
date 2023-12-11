import React from "react";
import { Container, Row, Col } from "react-bootstrap";
// import homeLogo from "../../Assets/home-main.svg";
import homeLogo from "../../Assets/profile_no_background.png";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";

function Home() {
  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content">
          <Row>
            <Col md={6} className="home-header">
              <h1 className="heading-name">
                <strong className="main-name"> RAYMOND WONG </strong>
              </h1>

              <div style={{ padding: 45, textAlign: "left" }}>
                <Type />
              </div>
            </Col>

            <Col md={6} style={{paddingBottom: 20 }}>
              <img
                src={homeLogo}
                alt="home pic"
                className="img-fluid"
                style={{ maxHeight: "450px" }}
              />
            </Col>
          </Row>
        </Container>
      </Container>
      <Home2 />
    </section>
  );
}

export default Home;