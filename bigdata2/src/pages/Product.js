import Container from "react-bootstrap/Container";
import ProductContent from "../components/ProductContent.js";

const Product = () => {
  return (
    <>
      <div className="App">
        <Container className="login-container">
          <ProductContent />
        </Container>
      </div>
    </>
  );
};
export default Product;
