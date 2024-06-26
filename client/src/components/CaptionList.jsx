import { Row } from "react-bootstrap";
import { Caption } from "./Caption";
import PropTypes from "prop-types";

export const CaptionList = (props) => {
  return (
    <Row>
      <Row className="justify-content-between mb-5 pe-0">
        {props.captions.slice(0, 4).map((caption, index) => (
          <Caption
            caption={caption}
            key={index}
            handleAnswer={props.handleAnswer}
            showCorrect={props.showCorrect}
            correctCaptions={props.correctCaptions}
            round={props.round}
          />
        ))}
      </Row>
      <Row className="justify-content-around mb-5">
        {props.captions.slice(-3).map((caption, index) => (
          <Caption
            caption={caption}
            key={index}
            handleAnswer={props.handleAnswer}
            showCorrect={props.showCorrect}
            correctCaptions={props.correctCaptions}
            round={props.round}
          />
        ))}
      </Row>
    </Row>
  );
};

CaptionList.propTypes = {
  round: PropTypes.number.isRequired,
  correctCaptions: PropTypes.array,
  captions: PropTypes.array.isRequired,
  handleAnswer: PropTypes.func.isRequired,
  showCorrect: PropTypes.bool,
};
