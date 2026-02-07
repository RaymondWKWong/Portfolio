import React from "react";
import { Container, Row, Col } from "react-bootstrap";
// import homeLogo from "../../Assets/home-main.svg";
import homeLogo from "../../Assets/profile_no_background.png";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";

// function Home() {
//   return (
//     <section>
//       <Container fluid className="home-section" id="home">
//         <Particle />
//         <Container className="home-content">
//           <Row>
//             <Col md={6} className="home-header">
//               <h1 className="heading-name">
//                 <strong className="main-name"> RAYMOND WONG </strong>
//               </h1>

//               <div style={{ padding: 45, textAlign: "left" }}>
//                 <Type />
//               </div>
//             </Col>

//             <Col md={6} style={{paddingBottom: 20 }}>
//               <img
//                 src={homeLogo}
//                 alt="home pic"
//                 className="img-fluid"
//                 style={{ maxHeight: "450px" }}
//               />
//             </Col>
//           </Row>
//         </Container>
//       </Container>
//       <Home2 />
//     </section>
//   );
// }

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

              <div className="d-md-none" style={{ paddingBottom: 20 }}>
                {/* This content will be displayed on screens smaller than md (medium) */}
                <img
                  src={homeLogo}
                  alt="home pic"
                  className="img-fluid"
                  style={{ maxHeight: "450px", objectFit: "contain" }}
                />
              </div>

              <div style={{ padding: 45, textAlign: "left" }}>
                <Type />
              </div>
            </Col>

            <Col md={6} className="d-none d-md-block" style={{ paddingBottom: 20, paddingLeft: 150 }}>
              {/* This content will be displayed on screens md (medium) and larger */}
              <img
                src={homeLogo}
                alt="home pic"
                className="img-fluid"
                style={{ maxHeight: "450px", objectFit: "contain" }}
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
