import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FiExternalLink } from "react-icons/fi";
import news01C from "../../Assets/01C_TechEU.jpg";
import news01CPortal from "../../Assets/01C_TechNews.png";

const newsItems = [
  {
    image: news01C,
    title: "01C launches Amara to generate full 3D worlds from simple prompts",
    source: "tech.eu",
    date: "Feb 2, 2026",
    url: "https://tech.eu/2026/02/02/01c-launches-amara-to-generate-full-3d-worlds-from-simple-prompts/",
  },
  {
    image: news01CPortal,
    title: "01C wants to erase the friction between imagination and 3D world building",
    source: "The Tech News Portal",
    date: "2026",
    url: "https://thetechnewsportal.com/latest/01c-wants-to-erase-the-friction-between-imagination-and-3d-world-building",
  },
];

function NewsCard() {
  return (
    <>
      {newsItems.map((item, index) => (
        <a
          key={index}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Card className="news-card-view">
            <Row className="g-0">
              <Col md={5}>
                <div className="news-img-wrapper">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="news-img"
                  />
                </div>
              </Col>
              <Col md={7} className="d-flex align-items-center">
                <Card.Body>
                  <div className="news-source">
                    {item.source} &middot; {item.date}
                  </div>
                  <Card.Title className="news-title">
                    {item.title}
                  </Card.Title>
                  <div className="news-link">
                    Read article <FiExternalLink />
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </a>
      ))}
    </>
  );
}

export default NewsCard;
