import PropTypes from "prop-types";
import { getGames, getTotalPoints, getUnlockedMemes } from "../API";
import { useState, useEffect } from "react";
import { Game } from "./Game";
import { Container, Col, Row } from "react-bootstrap";

export const ProfilePage = ({ user }) => {
  const [games, setGames] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [numberOfMemes, setNumberOfMemes] = useState(0);

  // TODO: add a button to navigate

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
            <h3>Total number of games played: {games.length} </h3>
            <h3>Total points: {totalPoints}</h3>
          </Col>
          <Col>
            <h3>
              Meme unlocked: {numberOfMemes.unlockedMemes}/
              {numberOfMemes.totalMemes}{" "}
            </h3>{" "}
            {/* TODO: This is a placeholder for the meme unlock feature */}
          </Col>
          <h3 className="mb-3">Your games:</h3>
          {games.map((game, index) => (
            <Game
              key={game.game_id}
              game={game}
              gameID={games.length - index}
            />
          ))}
        </Row>
      )}
    </Container>
  );
};

ProfilePage.propTypes = {
  user: PropTypes.object,
};
