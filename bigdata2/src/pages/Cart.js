import Container from "react-bootstrap/Container";
import CartList from "../components/CartList";

const Cart = () => {
  return (
    <>
      <div className="App">
        <Container className="login-container">
          <CartList />
        </Container>
      </div>
    </>
  );
};
export default Cart;
