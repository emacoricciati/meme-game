import { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Image, Alert } from "react-bootstrap";
import { Timer } from "./Timer";
import { getRandomMeme } from "../API";
import { CaptionList } from "./CaptionList";
import { GameOver } from "./GameOver";
import { postGame } from "../API";
import PropType from "prop-types";
import { LoadingSpinner } from "./LoadingSpinner";

export const GamePage = ({ isLoggedIn }) => {
  const [currentMeme, setCurrentMeme] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [stopTimer, setStopTimer] = useState(false);
  const [showCorrectCaptions, setShowCorrectCaptions] = useState(false);
  const [time, setTime] = useState(0);
  const [memes, setMemes] = useState([]);
  const [savedRounds, setSavedRounds] = useState([]);
  const [show, setShow] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const initialRender = useRef(true); // to prevent two fetches on first render
  // useRef instead of useState because we don't want to re-render when it changes

  useEffect(() => {
    // skip second fetch
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    let fetchMeme;
    if (!isLoggedIn) {
      fetchMeme = () => {
        getRandomMeme(currentMeme ? [currentMeme] : undefined).then((meme) => {
          setCurrentMeme(meme);
          setIsLoading(false);
        });
      };
    } else {
      fetchMeme = () => {
        getRandomMeme(memes).then((meme) => {
          setCurrentMeme(meme);
          setMemes((prevMemes) => [...prevMemes, meme]);
          setStopTimer(false);
          setShowCorrectCaptions(false);
          setIsLoading(false);
        });
      };
    }
    if (!gameOver) {
      setIsLoading(true);
      console.log("fetching meme");
      fetchMeme();
    }
  }, [gameOver, round]);

  useEffect(() => {
    if (gameOver && isLoggedIn) {
      const game = {
        total: score,
        date: new Date().toISOString(),
        time_taken: time,
        rounds: savedRounds,
      };
      postGame(game); // TO DO  check response
    }
  }, [gameOver]);

  const handleAnswer = (isCorrect, captionId, caption) => {
    setShow(true);
    if (isCorrect) {
      setFeedback("Correct answer!");
      setScore((prevScore) => prevScore + 5);
    } else {
      setFeedback("Incorrect answer!");
      setShowCorrectCaptions(true);
    }
    setStopTimer(true);
    const savedRound = {
      round_number: round,
      imageId: currentMeme.id,
      captionId,
      points: isCorrect ? 5 : 0,
      caption,
    };
    setSavedRounds((prevRounds) => [...prevRounds, savedRound]);
    if (isLoggedIn && round < 3) {
      setTimeout(() => {
        setRound((prevRound) => prevRound + 1);
        setShow(false);
      }, 1000);
    } else {
      setMemes([]);
      setTimeout(() => {
        setGameOver(true);
      }, 1000);
    }
  };

  // TODO change last image of one game to first image of next game

  const closeGameOver = () => {
    setShow(false);
    setSavedRounds([]);
    setTime(0);
    setRound(1);
    setGameOver(false);
    setStopTimer(false);
    setShowCorrectCaptions(false);
    setScore(0);
  };

  const getElapsedTime = (time) => {
    if (time === 30) {
      setStopTimer(true);
      setShowCorrectCaptions(true);
      setShow(true);
      setFeedback("Time's up!");
      const savedRound = {
        round_number: round,
        imageId: currentMeme.id,
        captionId: null,
        points: 0,
        caption: "Not answered",
      };
      setSavedRounds((prevRounds) => [...prevRounds, savedRound]);
      if (isLoggedIn && round < 3) {
        setTimeout(() => {
          setRound((prevRound) => prevRound + 1);
          setShow(false);
        }, 1000);
      } else {
        setTimeout(() => {
          setGameOver(true);
        }, 1000);
      }
    }
    setTime((prevTime) => prevTime + time);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && currentMeme && (
        <Container fluid className="mt-2">
          <Row className="w-100 mb-5">
            <Col className="col-4 d-flex justify-content-center align-items-center">
              <div>
                <Timer stopTimer={stopTimer} getTime={getElapsedTime} />
              </div>
            </Col>
            <Col className="col-4 d-flex justify-content-center align-items-center">
              <div className="d-flex flex-column justify-content-center align-items-center">
                <h3>
                  Round: {round}/{isLoggedIn ? 3 : 1}
                </h3>
                <Image
                  className="img-custom"
                  src={`/meme/${currentMeme.filename}`}
                />
              </div>
            </Col>
            <Col className="col-4 d-flex flex-column justify-content-center align-items-center position-relative">
              <div className="d-flex align-items-center">
                <i className="bi bi-trophy-fill h1 text-warning me-2"></i>
                <h1>Score: {score}</h1>
              </div>
              <Alert
                show={show}
                onClose={() => setShow(false)}
                variant={feedback === "Correct answer!" ? "success" : "danger"}
                className="mt-3 position-absolute w-100"
                style={{ top: "70%" }}
              >
                {feedback}
              </Alert>
            </Col>
          </Row>
          <CaptionList
            captions={currentMeme.captions}
            handleAnswer={handleAnswer}
            showCorrect={showCorrectCaptions}
            key={round}
          />
        </Container>
      )}
      {gameOver && (
        <div className="overlay">
          <GameOver
            rounds={savedRounds}
            score={score}
            time={time}
            closeGameOver={closeGameOver}
            isLoggedIn={isLoggedIn}
          />
        </div>
      )}
    </>
  );
};

GamePage.propTypes = {
  isLoggedIn: PropType.bool.isRequired,
};
