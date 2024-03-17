import {useEffect, useRef, useState} from "react";

export const CountdownX = ({ date }) => {
  const [timer, setTimer] = useState("");


  const setTimeRemaining = () => {
    const total_seconds = (date - new Date()) / 1000;

    if (total_seconds > 0) {
      const seconds = (Math.floor(total_seconds % 60) + "").padStart(2, "0");
      const minutes = (Math.floor(
        (total_seconds / 60) % 60
      ) + "").padStart(2, "0");
      const hours = (Math.floor(
        (total_seconds / 60 / 60)
      ));

      if (hours < 1) {
        setTimer(`${minutes}:${seconds}`);
      } else {
        setTimer(`${hours}h ${minutes}m`);
      }
    } else {
      setTimer(`LIVE`);
    }
  };



  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining();
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timer]);


  return timer;
}
