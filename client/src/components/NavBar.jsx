import { Container, Row, Col, Button } from "react-bootstrap";

export const NavBar = () => {
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
              <span className="h3 mb-0">Meme Game </span>
            </a>
          </Col>
          <Col className="d-flex align-items-center justify-content-end">
            <Button variant="link" className="text-decoration-none fs-5">
              Login
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
