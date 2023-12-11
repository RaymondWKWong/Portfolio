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
        typewriter.typeString('Imperial College London')
        .pauseFor(2500)
        .deleteAll(10)

        typewriter.typeString('OrionHack | Awarded 2nd Place <FaMedal /> <br />')
        typewriter.typeString('Morgan Stanley - Code to Give | Ranked Top 10 <FaMedal />')
        .pauseFor(2500)
        .deleteAll(10)

        .start();
      }}
    />
  );
}


export default Type;
