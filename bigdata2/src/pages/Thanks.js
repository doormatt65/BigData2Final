import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
// import ThankYou from "../components/ThankYou.js";

const Thanks = () => {
  return (
    <>
      <div className="App">
        <Container className="login-container">
          <h1>Thanks for your purchase!</h1>
          <br />
          <Button href="/">Continue Shopping</Button>
        </Container>
      </div>
    </>
  );
};
export default Thanks;
