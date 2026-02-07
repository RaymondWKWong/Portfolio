import React from "react";
import Typewriter from "typewriter-effect";

// https://stackoverflow.com/questions/54875497/how-do-you-increase-the-typewriter-effect-speed-and-increase-cursor-size
const typewriter = new Typewriter({
  loop: true,
  delay: 1000,
  cursorClassName: 'cursorSize', // custom class name
});

function Type() {
  return (
    <Typewriter
      options={{
        delay: 10,
        loop: true,
      }}

      onInit={(typewriter) => {
        typewriter.typeString('PhD Student <br />')
        typewriter.typeString('Imperial College London <br />')
        typewriter.typeString('<br />')
        typewriter.typeString('Best Research Poster | International Symposium on Advances in Metallurgy <FaMedal /> <br />')
        typewriter.typeString('<br />')
        typewriter.typeString('Teaching Assistant of the Year | Imperial College London <FaMedal />')
        .pauseFor(2500)
        .deleteAll(10)

        typewriter.typeString('IMC Prosperity Trading Talent | Ranked 107th Global | 9th UK <FaMedal /> <br />')
        typewriter.typeString('<br />')
        typewriter.typeString('OrionHack | Awarded 2nd Place <FaMedal /> <br />')
        typewriter.typeString('<br />')
        typewriter.typeString('Morgan Stanley - Code to Give | Ranked Top 10 <FaMedal /> <br />')
        typewriter.typeString('<br />')
        typewriter.typeString('10 Downing Street - Rewire the State Hackathon <FaMedal />')
        .pauseFor(2500)
        .deleteAll(10)

        .start();
      }}
    />
  );
}


export default Type;
