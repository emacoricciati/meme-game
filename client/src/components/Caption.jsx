import { Col, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export const Caption = (props) => {
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    setIsCorrect(null);
  }, [props.caption]);

  const checkAnswer = () => {
    setIsCorrect(props.caption.correct);
    props.handleAnswer(props.caption.correct, props.caption.id);
  };

  useEffect(() => {
    if(props.showCorrect && props.caption.correct){
      setIsCorrect(props.caption.correct);
    }
  },[props.showCorrect])

  return (
    <Col className="d-flex justify-content-center align-items-center">
      <Button
        className={`h-100 fs-5 btn-custom${
            isCorrect === true ? "-correct" : 
            isCorrect === false ? "-incorrect" : ""
          }`}
        onClick={checkAnswer}
      >
        {props.caption.text}
      </Button>
    </Col>
  );
};

Caption.propTypes = {
  caption: PropTypes.object.isRequired,
  handleAnswer: PropTypes.func.isRequired,
  showCorrect: PropTypes.bool.isRequired,
};
