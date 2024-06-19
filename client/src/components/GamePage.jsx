import { useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { Timer } from "./Timer";
import { getRandomMeme } from "../API";
import { CaptionList } from "./CaptionList";
import { GameOver } from "./GameOver";

export const GamePage = () => {
  const [currentMeme, setCurrentMeme] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const fetchMeme = () => {
      getRandomMeme().then((meme) => {
        setCurrentMeme(meme);
      });
    };
    if (!gameOver) {
      fetchMeme();
    }
  }, [gameOver]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore((prevScore) => prevScore + 5);
    }
    else {
      setShowCorrect(true);
    }
    setStopTimer(true);
    setTimeout(() => {
      setGameOver(true);
    }, 1000);
  };

  const closeGameOver = () => {
    setGameOver(false);
    setStopTimer(false);
    setShowCorrect(false);
    setScore(0);
  };

  const getElapsedTime = (time) => {
    if (time === 30) {
      setShowCorrect(true);
      setTimeout(() => {
        setGameOver(true);
      }, 1000);
    }
    setTime(time);
  };

  return (
    <>
      <Container fluid className="mt-2">
        {currentMeme && (
          <>
            <Row className="w-100 mb-5">
              <Col className="col-4 d-flex justify-content-center align-items-center">
                <div>
                  <Timer stopTimer={stopTimer} getTime={getElapsedTime} />
                </div>
              </Col>
              <Col className="col-4 d-flex justify-content-center align-items-center">
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <h3>Round: {round}/3</h3>
                  <Image
                    className="img-custom"
                    src={`src/assets/meme/${currentMeme.filename}`}
                  />
                </div>
              </Col>
              <Col className="col-4 d-flex justify-content-center align-items-center">
                <i className="bi bi-trophy-fill h1 text-warning me-2"></i>
                <h1>Score: {score}</h1>
              </Col>
            </Row>
            <CaptionList
              captions={currentMeme.captions}
              handleAnswer={handleAnswer}
              showCorrect={showCorrect}
              key={currentMeme.id}
            />
          </>
        )}
      </Container>
      {gameOver && (
        <div className="overlay">
          <GameOver
            round={round}
            score={score}
            time={time}
            closeGameOver={closeGameOver}
          />
        </div>
      )}
    </>
  );
};
