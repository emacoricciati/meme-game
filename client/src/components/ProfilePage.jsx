import PropTypes from "prop-types";
import { getGames } from "../API";
import { useState, useEffect } from "react";
import { Game } from "./Game";
import { Container } from "react-bootstrap";

export const ProfilePage = ({ user }) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    getGames().then((games) => {
      setGames(games);
    });
  }, []);

  return (
    <Container>
      <h1 className="mt-3">Welcome back, {user.name}!</h1>
      {games.length === 0 ? (
        <h2 className="mt-3">You have no games yet!</h2>
      ) : (
        <>
          <h2 className="mb-3">Your games:</h2>
          {games.map((game, index) => (
            <Game key={game.game_id} game={game} gameID={index + 1} />
          ))}
        </>
      )}
    </Container>
  );
};

ProfilePage.propTypes = {
  user: PropTypes.object,
};
