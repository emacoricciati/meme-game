import { Col, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export const Caption = (props) => {
  const [isCorrect, setIsCorrect] = useState(null);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setIsCorrect(null);
    setSelected(false);
  }, [props.round]);
  

  useEffect(() => {
    if (props.showCorrect===null || !props.correctCaptions) return;

    const correctCaptionIds = props.correctCaptions.map(caption => caption.id);
    const isCaptionCorrect = correctCaptionIds.includes(props.caption.id);

    // selected caption is correct
    if(!props.showCorrect && selected){
      setIsCorrect(true);
    }
    // selected caption is not correct
    if(props.showCorrect){
      if (isCaptionCorrect) {
        setIsCorrect(true);
      } else if (selected) {
        setIsCorrect(false);
      }
    }

  }, [props.correctCaptions, props.caption.id, props.showCorrect, selected]);

  const checkAnswer = () => {
    setSelected(true);
    props.handleAnswer(props.caption.correct, props.caption.id, props.caption.text);
  };

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
  round: PropTypes.number.isRequired,
  correctCaptions: PropTypes.array,
  caption: PropTypes.object.isRequired,
  handleAnswer: PropTypes.func.isRequired,
  showCorrect: PropTypes.bool,
};
