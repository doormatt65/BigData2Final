import Container from "react-bootstrap/Container";
import HomeTable from "../components/HomeTable.js";
import { ToastContainer } from "react-toastify";

const Home = () => {
  return (
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
        <HomeTable />
      </Container>
    </div>
  );
};
export default Home;
