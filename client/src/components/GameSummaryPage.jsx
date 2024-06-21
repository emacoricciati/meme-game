import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getGame } from "../API";
import dayjs from "dayjs";

export const GameSummaryPage = () => {
  const location = useLocation();
  const { gameId } = location.state;
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (gameId) {
      getGame(gameId).then((game) => setGame(game));
    }
  }, [gameId]);

  console.log(game);

  return (
    <div>
      {game && (
        <>
          <h1>Game Summary</h1>
          <h3>Date: {dayjs(parseInt(game.date)).format("YYYY-MM-DD HH:mm")}</h3>
          <h3>Total: {game.total}</h3>
          <h3>Time taken: {game.time_taken}s</h3>
        </>
      )}
    </div>
  );
};
