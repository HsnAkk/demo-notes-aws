import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Routes from "./Routes";
import "./App.css";
import { AppContext } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./lib/errorLib";


function App() {

    const history = useHistory();

    const [isAuthenticated, userHasAuthenticated] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    useEffect(() => {
        onLoad();
    }, []);
      
    async function onLoad() {
        try {
            await Auth.currentSession();
            userHasAuthenticated(true);
        }
        catch(e) {
            if (e !== 'No current user') {
                onError(e);
            }
    }
      
        setIsAuthenticating(false);
    }

    async function handleLogout() {
        await Auth.signOut();
        userHasAuthenticated(false);
        history.push("/login");
    }

    return (
        !isAuthenticating && (
            <div className="App container py-3">
                <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
                    <Link to="/">
                        <Navbar.Brand className="font-weight-bold text-muted">
                            Scratch
                        </Navbar.Brand>
                    </Link>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Nav activeKey={window.location.pathname}>
                            {isAuthenticated ? (
                                <>
                                    <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
                                    <Nav.Link as={Link} onClick={handleLogout}>Logout</Nav.Link>
                                </>
                                ) : (
                                    <>
                                        <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                                        <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                    </>
                                )
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
                    <Routes />
                </AppContext.Provider>
            </div>
        )
    );
}

export default App;