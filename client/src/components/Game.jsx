import { Col, Row } from "react-bootstrap";
import PropType from "prop-types";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
export const Game = ({ game, gameID }) => {

    const navigate = useNavigate();

  return (
    <div className="card mb-4 p-2 btn-custom" style={{cursor: 'pointer'}} onClick={() => navigate("/games/" + gameID, {state: {gameId: game.game_id}})}>
      <Row>
        <Col>
          <h1>Game {gameID}</h1>
        </Col>
        <Col>
          <h3>Date: {dayjs(parseInt(game.date)).format("YYYY-MM-DD HH:mm")}</h3>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Total: {game.total}</h3>
        </Col>
        <Col>
          <h3>Time taken: {game.time_taken}s</h3>
        </Col>
      </Row>
    </div>
  );
};

Game.propTypes = {
  game: PropType.object.isRequired,
    gameID: PropType.number.isRequired,
};
