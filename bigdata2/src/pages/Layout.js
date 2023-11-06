import { Outlet } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";

const Layout = () => {
  return (
    <>
      <Navbar>
        <Container>
          <Navbar.Brand href="/">Matt Braun AWS Project</Navbar.Brand>
          <Nav className="me-auto" variant="pills">
            <Nav.Item>
              <LinkContainer to="/">
                <Button className="main-nav-button">Home</Button>
              </LinkContainer>
            </Nav.Item>
          </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
};

export default Layout;
