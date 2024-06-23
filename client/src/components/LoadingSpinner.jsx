import { Spinner, Container, Row, Col } from "react-bootstrap";

export const LoadingSpinner = () => {
    return (
        <Container fluid className="d-flex justify-content-center">
            <Row>
                <Col className="d-flex justify-content-center mt-5">
                    <Spinner className="spinner-custom" animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Col>
            </Row>
        </Container>
    );
}
