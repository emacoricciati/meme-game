import PropTypes from "prop-types";
import { Button } from "react-bootstrap";

export const GameOver = ({ round, score, time, closeGameOver }) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="game-over-container">
        <h1 className="game-over-title">Game Over</h1>
        <div className="game-over-details">
          <h2>Rounds: {round}</h2>
          <h2>Points: {score}</h2>
          <h2>Total Time: {time}s</h2>
          <Button className="btn-custom" onClick={closeGameOver}>Play again</Button>
        </div>
      </div>
    </div>
  );
};

GameOver.propTypes = {
  round: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  closeGameOver: PropTypes.func.isRequired,
};
