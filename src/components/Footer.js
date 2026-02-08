import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillGithub } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <Container fluid className="footer">
      <Row>
        <Col md="4" className="footer-copywright">
          <h3>Designed by Raymond Wong</h3>
        </Col>
        <Col md="4" className="footer-copywright">
        </Col>
        <Col md="4" className="footer-body">
          <ul className="footer-icons">
            <li className="social-icons">
              <a
                href="https://github.com/RaymondWKWong"
                style={{ color: "white" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AiFillGithub size={22} />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="https://twitter.com/RaymondWongPhD"
                style={{ color: "white" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaXTwitter size={22} />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="https://linkedin.com/in/raymond-wong-a226a8154"
                style={{ color: "white" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn size={22} />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
