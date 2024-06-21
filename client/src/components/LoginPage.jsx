import { Container, Row, Form, Alert } from "react-bootstrap";
import { CtaButton } from "./CtaButton";
import { useState } from "react";
import PropType from "prop-types";
import { useNavigate } from "react-router-dom";

export const LoginPage = ({login}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    login(credentials)
      .then ( () => navigate( "/profile" ) )
      .catch( (err) => {
        if(err.message === "Unauthorized")
          setErrorMessage("Invalid username and/or password");
        else
          setErrorMessage(err.message);
        setShow(true);
      });
  };
  return (
    <Container>
      <Row className="justify-content-center align-items-center mt-5">
        <div className="card p-5 text-start">
          <h2>Welcome,</h2>
          <h5 className="mb-5 text-secondary">Log in to continue</h5>
          <Form onSubmit={handleSubmit}>
            <Alert
              dismissible
              show={show}
              onClose={() => setShow(false)}
              variant="danger"
            >
              {errorMessage}
            </Alert>
            <Form.Group className="mb-4" controlId="username">
              <Form.Control
                className="input"
                type="email"
                value={username}
                placeholder="Email"
                onChange={(ev) => setUsername(ev.target.value)}
                required={true}
              />
            </Form.Group>
            <Form.Group className="mb-5" controlId="password">
              <Form.Control
                className="input"
                type="password"
                value={password}
                placeholder="Password"
                onChange={(ev) => setPassword(ev.target.value)}
                required={true}
                minLength={6}
              />
            </Form.Group>
            <CtaButton text="Login" action={handleSubmit}/>
          </Form>
        </div>
      </Row>
    </Container>
  );
};

LoginPage.propTypes = {
  login: PropType.func.isRequired,
};
