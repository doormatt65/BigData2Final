import Container from "react-bootstrap/Container";
import HomeTable from "../components/HomeTable.js";

const Home = () => {
  return (
    <div className="App">
      <Container className="login-container">
        <HomeTable />
      </Container>
    </div>
  );
};
export default Home;
