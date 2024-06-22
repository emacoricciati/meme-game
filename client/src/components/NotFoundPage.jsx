
import { Image, Container } from "react-bootstrap";
import pageNotFound from "/404pageNotFound.png";

export const NotFoundPage = () => {
    return (
        <Container className="d-flex justify-content-center mt-5">
            <Image src={pageNotFound} width={500}/>
        </Container>
    );
}