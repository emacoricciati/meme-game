import { Container, Row, Col, Image } from "react-bootstrap";
import homeImage from "../assets/home.jpg"
import {useNavigate} from "react-router-dom";
import { CtaButton } from "./CtaButton";
export const HomePage = () => {

const navigate = useNavigate();
  return (
    <Container>
      <Row className="justify-content-center align-items-center mt-5">
        <Col className="d-flex justify-content-start align-items-center">
            <div className="card p-5 text-start">
              <h2>Welcome to Meme Game!</h2>
                <p>Think you know your memes? Put your skills to the test and see if you can match the captions with the right meme. Whether you re a meme connoisseur or just looking for a good laugh, Meme Game is sure to keep you entertained.</p>
                <CtaButton text="Start now!" action={() => navigate("/game")}/>
              </div>
        </Col>
        <Col className="d-flex justify-content-center align-items-center">
          <Image src={homeImage} roundedCircle width={550}/>
        </Col>
      </Row>
    </Container>
  );
};
