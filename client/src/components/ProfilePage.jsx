import PropTypes from "prop-types";
import { getGames } from "../API";
import { useState, useEffect } from "react";
import { Game } from "./Game";
import { Container, Col, Row } from "react-bootstrap";

export const ProfilePage = ({ user }) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    getGames().then((games) => {
      const sortedGames = games.sort((a, b) => b.date - a.date);
      setGames(sortedGames);
    });
  }, []);

  return (
    <Container>
      <h1 className="mt-3">Welcome back, {user.name}!</h1>
      {games.length === 0 ? (
        <h2 className="mt-3">You have no games yet!</h2>
      ) : (
        <Row>
          <Col>
            <h3>Total number of games played: {games.length} </h3>
          </Col>
          <Col>
            <h3>Meme unlocked: 10/20 </h3>{" "}
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
