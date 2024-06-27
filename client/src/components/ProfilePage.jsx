import PropTypes from "prop-types";
import { getGames, getTotalPoints, getUnlockedMemes } from "../API";
import { useState, useEffect } from "react";
import { Game } from "./Game";
import { Container, Col, Row } from "react-bootstrap";
import { CtaButton } from "./CtaButton";
import { useNavigate } from "react-router-dom";

export const ProfilePage = ({ user }) => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [numberOfMemes, setNumberOfMemes] = useState(0);

  useEffect(() => {
    getGames().then((games) => {
      const sortedGames = games.sort((a, b) => b.date - a.date);
      setGames(sortedGames);
    });
    getTotalPoints().then((points) => {
      setTotalPoints(points);
    });
    getUnlockedMemes().then((tot) => {
      setNumberOfMemes(tot);
    });
  }, []);

  return (
    <Container>
      <h1 className="mt-3">Welcome back, {user.name}!</h1>
      {games.length === 0 && totalPoints && numberOfMemes ? (
        <h2 className="mt-3">You have no games yet!</h2>
      ) : (
        <Row>
          <Col>
            <h3>Games played: {games.length} </h3>
          </Col>
          <Col>
            <h3 className="text-center">
              Meme unlocked: {numberOfMemes.unlockedMemes}/
              {numberOfMemes.totalMemes}
            </h3>
          </Col>
          <Col className="text-end">
            <CtaButton
              text="Start a new game!"
              action={() => navigate("/game")}
            />
          </Col>
          <Col className="text-start">
            <CtaButton
              text="Go to home"
              action={() => navigate("/")}
            />
          </Col>
          <Row>
            <h3>Total points: {totalPoints}</h3>
          </Row>
          {games.length > 0 ? (
            <Row>
              <h3 className="mt-3 mb-3">Your games:</h3>
              {games.map((game, index) => (
                <Game
                  key={game.game_id}
                  game={game}
                  gameID={games.length - index}
                />
              ))}
            </Row>
          ) : (
            <h3 className="mt-3">You haven&apos;t played any games yet.</h3>
          )}
        </Row>
      )}
    </Container>
  );
};

ProfilePage.propTypes = {
  user: PropTypes.object,
};
