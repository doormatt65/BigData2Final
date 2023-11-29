import Container from "react-bootstrap/Container";
import ProductContent from "../components/ProductContent.js";
import { ToastContainer } from "react-toastify";

const Product = () => {
  return (
    <>
      <div className="App">
        <ToastContainer
          position="top-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Container className="login-container">
          <ProductContent />
        </Container>
      </div>
    </>
  );
};
export default Product;
