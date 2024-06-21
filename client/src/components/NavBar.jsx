import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Smile from "../assets/smile.png";
import PropType from "prop-types";

export const NavBar = ({ logout, isLoggedIn }) => {
  const navigate = useNavigate();
  return (
    <div className="navbar-custom py-2">
      <Container fluid className="align-items-center">
        <Row>
          <Col>
            <Button variant="link" className="text-decoration-none fs-5">
              Theme
            </Button>
          </Col>
          <Col className="d-flex align-items-center justify-content-center">
            <a
              href="/"
              className="d-flex align-items-center justify-content-center justify-content-md-start h-100 link-light text-decoration-none"
            >
              <Image src={Smile} width={50} className="me-2 pe-auto" />
              <span className="h3 mb-0 text-dark">Meme Game </span>
            </a>
          </Col>
          <Col className="d-flex align-items-center justify-content-end">
            {!isLoggedIn && (
              <Button
                variant="link"
                className="text-decoration-none fs-5"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            )}
            {isLoggedIn && (
              <>
                <Button variant="link" className="text-decoration-none" onClick={() => navigate("/profile")}>
                  <i className="bi bi-person-circle fs-4"></i>
                </Button>
                <Button
                  variant="link"
                  className="text-decoration-none fs-5"
                  onClick={() => {logout(); navigate("/")}}
                >
                  Logout
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

NavBar.propTypes = {
  isLoggedIn: PropType.bool.isRequired,
  logout: PropType.func.isRequired,
};
