import PropTypes from "prop-types";
import { CtaButton } from "./CtaButton";
import { Row, Col, Image, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const GameOver = ({
  rounds,
  score,
  time,
  closeGameOver,
  isLoggedIn,
  show,
}) => {
  const navigate = useNavigate();

  return (
    <Modal
      show={show}
      onHide={closeGameOver}
      centered
      className="custom-modal"
      size="xl"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title className="text-center w-100">Game Over</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoggedIn && (
          <>
            {rounds.filter((round) => round.points === 5).length > 0 && (
              <h4 className="text-center">Correct memes:</h4>
            )}
            <Row className="justify-content-center ms-2 me-2">
              {rounds.map(
                (round, index) =>
                  round.points === 5 && (
                    <Col
                      key={index}
                      className="d-flex flex-column align-items-center"
                    >
                      <h4 className="text-center">
                        Round {round.round_number}
                      </h4>
                      <div className="game-over-img-container text-center">
                        <Image
                          className="game-over-img mt-4"
                          src={`/meme/${round.imageId}.jpg`}
                        />
                        <p className={"mt-3 text-success"}>{round.caption}</p>
                      </div>
                    </Col>
                  )
              )}
            </Row>
          </>
        )}
        <Row className="mt-4">
          <Col>
            <h4 className="text-center">Total points: {score}</h4>
          </Col>
          <Col>
            <h4 className="text-center">Total Time: {time}s</h4>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Col className="text-end">
          <CtaButton text="Play again" action={closeGameOver} />
        </Col>
        <Col>
          <CtaButton text="Go to home" action={() => navigate("/")} />
        </Col>
      </Modal.Footer>
    </Modal>
  );
};

GameOver.propTypes = {
  show: PropTypes.bool.isRequired,
  rounds: PropTypes.array.isRequired,
  score: PropTypes.number.isRequired,
  time: PropTypes.number.isRequired,
  closeGameOver: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};
