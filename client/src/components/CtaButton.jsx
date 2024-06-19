import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
export const CtaButton = ({ text, action }) => {
  return (
    <Button className="cta-button m-0" onClick={action}>
      {text}
    </Button>
  );
};

CtaButton.propTypes = {
  text: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
};
