import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

import MakaStory from "../../Assets/Projects/makastory.png";
import OrionHack from "../../Assets/Projects/orionhack.png";
import Gold from "../../Assets/Projects/gold.png";

const ProjectSlideshow = () => {
  const images = [
    MakaStory,
    OrionHack,
    Gold,
  ];

//   return (
//       <Zoom scale={1.4} indicators={true} duration={2000} arrows={false} canSwipe={true}>
//           {images.map((each, index) => (
//                 <div key={index} style={{ width: "100%", height: "300px", overflow: "hidden" }}>
//                 <img style={{ objectFit: "cover", width: "100%", height: "100%" }} alt="Slide Image" src={each} />
//             </div>
//           ))}
//       </Zoom>
//   );
// };


  return (
      <Zoom scale={1.4} indicators={true} duration={2000} arrows={false} canSwipe={true}>
          {images.map((each, index) => (
              <div key={index} style={{ width: "100%" }}>
                  <img style={{ objectFit: "cover", width: "100%" }} alt="Slide Image" src={each} />
              </div>
          ))}
      </Zoom>
  );
};

export default ProjectSlideshow;