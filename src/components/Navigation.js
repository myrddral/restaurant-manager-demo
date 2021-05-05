import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Button, Alert } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Image } from "react-bootstrap";
import Logo from "../assets/deryne-logo-alter.png";

const Navigation = () => {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("A kijelentkezés nem sikerült!");
    }
  }
  return (
    <>
      {currentUser && (
        <Navbar collapseOnSelect bg="light" expand="lg" sticky="top">
          <Link to="/" style={{ width: "10%" }}>
            <Navbar.Brand style={{ padding: 0 }}>
              <Image src={Logo} style={{ width: 100 }}></Image>
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {/* <Link to="/" className="nav-link">Főoldal</Link> */}
              <NavDropdown title="Standolás" id="basic-nav-dropdown">
                <NavDropdown.Item>
                  <Link to="/measure-wine" className="nav-link">
                    Bor stand
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link to="/measure-spirit" className="nav-link">
                    Spirit stand
                  </Link>
                </NavDropdown.Item>
              </NavDropdown>
              <Link to="/stock" className="nav-link">Készlet</Link>
              <Link to="/add" className="nav-link">
                Új termék
              </Link>
              {/* <Link to="/reporting" className="nav-link">
                Riport
              </Link> */}
              {error && <Alert variant="danger">{error}</Alert>}
            </Nav>
            <Link to="/profile" className="nav-link">
              Profilom
            </Link>
            <Button variant="outline-primary" onClick={handleLogout}>
              Kijelentkezés
            </Button>
            {/* <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-success">Search</Button>
          </Form> */}
          </Navbar.Collapse>
        </Navbar>
      )}
    </>
  );
};

export default Navigation;
