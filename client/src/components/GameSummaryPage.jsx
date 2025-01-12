import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { getGame } from "../API";
import { Container, Image, Col, Row } from "react-bootstrap";
import dayjs from "dayjs";
import { CtaButton } from "./CtaButton";

export const GameSummaryPage = () => {
  const location = useLocation();
  const params = useParams();
  const { gameId } = location.state;
  const [game, setGame] = useState(null);
  const navigate = useNavigate();

  const getCaptionColor = (round) => {
    if (round.caption !== "Not answered") {
      if (round.points) {
        return "text-success";
      } else {
        return "text-danger";
      }
    }
    return "";
  };

  useEffect(() => {
    if (gameId) {
      getGame(gameId).then((game) => setGame(game));
    }
  }, [gameId]);

  return (
    <Container>
      {game && (
        <>
        <Row className="mt-3 mb-3">
          <Col></Col>
          <Col><h1 className="text-center">Game #{params.gameId}</h1></Col>
          <Col className="text-center">
            <CtaButton text="Go to profile" action={() => navigate("/profile")}/>
          </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <h3 className="text-center">
                Date: {dayjs(parseInt(game.date)).format("YYYY-MM-DD HH:mm")}
              </h3>
            </Col>
            <Col>
              <h3 className="text-center">Time taken: {game.time_taken}s</h3>
            </Col>
            <Col>
              <h3 className="text-center">Total points: {game.total}</h3>
            </Col>
          </Row>
          <Row className="mt-5">
            {game.rounds.map((round, index) => (
              <Col
                key={index}
                className="d-flex flex-column align-items-center"
              >
                <h2 className="text-center">Round {round.round_number}</h2>
                <div className="img-with-caption text-center">
                  <Image
                    className="img-in-caption mt-4"
                    src={`/meme/${round.image}`}
                  />
                  <h5 className={`mt-3 ${getCaptionColor(round)}`}>
                    {round.caption}
                  </h5>
                </div>
                <h4 className="mt-2 text-center">Points: {round.points}</h4>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};
