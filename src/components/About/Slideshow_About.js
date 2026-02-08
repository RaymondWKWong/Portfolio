import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

import ConferenceImg from "../../Assets/conference2.jpg";
import QuantMinds from "../../Assets/quantminds conference.jpeg";
import GroupImg from "../../Assets/group photo.jpg";
import QuantMindsHackathon from "../../Assets/QuantMinds_Hackathon_03.jpg";

const AboutSlideshow = () => {
  const images = [
    ConferenceImg,
    QuantMinds,
    QuantMindsHackathon,
    GroupImg,
  ];

  return (
      <Zoom scale={1.4} indicators={true} duration={2000} arrows={false} canSwipe={true}>
          {images.map((each, index) => (
              <div key={index} style={{ width: "100%" }}>
                  <img style={{ objectFit: "cover", width: "100%" }} alt="Slide" src={each} />
              </div>
          ))}
      </Zoom>
  );
};

export default AboutSlideshow;