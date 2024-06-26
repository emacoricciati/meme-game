import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

export const Timer = ({ stopTimer, getTime }) => {
  const [counter, setCounter] = useState(30);
  const [strokeDashoffset, setStrokeDashoffset] = useState(282.7433388230814); // 2 π r = 2 * 45 * π
  const [strokeColor, setStrokeColor] = useState("#28a745");
  const startTimeRef = useRef(Date.now());
  
  useEffect(() => {
    if (stopTimer && counter > 0) {
      getTime(30-counter);
    }
  },[stopTimer, counter])
  
  useEffect(() => {

    let animationFrameId;

    const updateStrokeColor = (elapsedSeconds) => {
      if (elapsedSeconds >= 25) {
        setStrokeColor("#FF0000");
      }
    };

    const animate = () => {
      const elapsedTime = (Date.now() - startTimeRef.current) / 1000; // in seconds
      const remainingTime = 30 - elapsedTime;
      if (remainingTime > 0) {
        setCounter(Math.ceil(remainingTime)); // Round up to the nearest integer
        setStrokeDashoffset(282.7433388230814 * (1 - remainingTime / 30)); // anticlockwise
        updateStrokeColor(30 - remainingTime);
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCounter(0);
        getTime(30); // Send the elapsed time to the parent component
        setStrokeDashoffset(282.7433388230814); // Reset to full circle if needed
      }
    };

    if (!stopTimer) {
      startTimeRef.current = Date.now(); // Reset start time
      setCounter(30); // Reset counter to 30 seconds
      setStrokeColor("#28a745"); // Reset stroke color
      animationFrameId = requestAnimationFrame(animate); // Start animation
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [stopTimer]);

  return (
    <div className="countdown">
      <svg viewBox="-25 -25 150 150" className="countdown-svg">
        <circle cx="50" cy="50" r="45" className="background-circle" />
        <circle
          cx="50"
          cy="50"
          r="45"
          className="foreground-circle"
          style={{
            strokeDashoffset: strokeDashoffset,
            stroke: strokeColor,
          }}
        />
      </svg>
      <div className="countdown-text">
        0:{counter.toString().padStart(2, "0")}
      </div>
    </div>
  );
};

Timer.propTypes = {
  stopTimer: PropTypes.bool.isRequired,
  getTime: PropTypes.func.isRequired,
};
