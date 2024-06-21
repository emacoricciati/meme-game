import { useEffect, useState, useRef } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { Timer } from "./Timer";
import { getRandomMeme } from "../API";
import { CaptionList } from "./CaptionList";
import { GameOver } from "./GameOver";
import { postGame } from "../API";
import PropType from "prop-types";

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
        });
      };
    } else {
      fetchMeme = () => {
        getRandomMeme(memes).then((meme) => {
          setCurrentMeme(meme);
          setMemes((prevMemes) => [...prevMemes, meme]);
          setStopTimer(false);
          setShowCorrectCaptions(false);
        });
      };
    }
    if (!gameOver) {
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
      postGame(game)
    }
  }, [gameOver]);

  const handleAnswer = (isCorrect, captionId) => {
    if (isCorrect) {
      setScore((prevScore) => prevScore + 5);
    } else {
      setShowCorrectCaptions(true);
    }
    setStopTimer(true);
    const savedRound = {
      round_number: round,
      imageId: currentMeme.id,
      captionId,
      points: isCorrect ? 5 : 0,
    };
    setSavedRounds((prevRounds) => [...prevRounds, savedRound]);
    if (isLoggedIn && round < 3) {
      setTimeout(() => {
        setRound((prevRound) => prevRound + 1);
      }, 1000);
    } else {
      setMemes([]);
      setTimeout(() => {
        setGameOver(true);
      }, 1000);
    }
  };

  // TO DO change last image of one game to first image of next game

  const closeGameOver = () => {
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
      const savedRound = {
        round_number: round,
        imageId: currentMeme.id,
        captionId: null,
        points: 0,
      };
      setSavedRounds((prevRounds) => [...prevRounds, savedRound]);
      if (isLoggedIn && round < 3) {
        setTimeout(() => {
          setRound((prevRound) => prevRound + 1);
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
                  <h3>
                    Round: {round}/{isLoggedIn ? 3 : 1}
                  </h3>
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
              showCorrect={showCorrectCaptions}
              key={round}
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

GamePage.propTypes = {
  isLoggedIn: PropType.bool.isRequired,
};
