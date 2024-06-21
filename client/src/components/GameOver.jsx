import PropTypes from "prop-types";
import { CtaButton } from "./CtaButton";
import { Row, Col, Image, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const GameOver = ({ rounds, score, time, closeGameOver }) => {
  const getCaptionColor = (round) => {
    if (round.caption !== "Not answered") {
      if (round.points) {
        return "text-success";
      } else {
        return "text-danger";
      }
    }
    return "";
  };

  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <Container className="game-over-container">
        <h1 className="text-center">Game Over</h1>
        <Row className="justify-content-center ms-2 me-2">
          {rounds.map((round, index) => (
            <Col
              key={index}
              className="d-flex flex-column align-items-center"
            >
              <h4 className="text-center">Round {round.round_number}</h4>
              <div className="game-over-img-container text-center">
                <Image
                  className="game-over-img mt-4"
                  src={`/meme/${round.imageId}.jpg`}
                />
                <p className={`mt-3 ${getCaptionColor(round)}`}>
                  {round.caption}
                </p>
              </div>
              <p className="mt-2 text-center">Points: {round.points}</p>
            </Col>
          ))}
        </Row>
        <Row>
          <Col>
            <h4 className="text-center">Total points: {score}</h4>
          </Col>
          <Col>
            <h4 className="text-center">Total Time: {time}s</h4>
          </Col>
        </Row>
        <Row className="justify-content-center mb-4">
          <Col className="text-end">
            <CtaButton text="Play again" action={closeGameOver} />
          </Col>
          <Col className="text-start">
            <CtaButton text="Go to home" action={() => navigate("/")} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

GameOver.propTypes = {
  rounds: PropTypes.array.isRequired,
  score: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  closeGameOver: PropTypes.func.isRequired,
};
