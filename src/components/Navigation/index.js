import React from 'react';
import Nav from 'react-bootstrap/Nav';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
import { Navbar } from 'react-bootstrap';
import logo from '../../logo.svg';


const Navigation = () => (
    <AuthUserContext.Consumer>
        {authUser =>
            authUser ? (
                <NavigationAuth authUser={authUser} />
            ) : (
                <NavigationNonAuth />
            )
        }
    </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (

    <Navbar>
        <Navbar.Brand href={ROUTES.LANDING}>

            <img
                src={logo}
                width="80"
                height="80"
                alt="logo"
            />

        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end">

            <Nav.Item>
                <Nav.Link href={ROUTES.HOME}>Home</Nav.Link>
            </Nav.Item>

            <Nav.Item>
                <Nav.Link href={ROUTES.ACCOUNT}>Account</Nav.Link>
            </Nav.Item>

            {!!authUser.roles[ROLES.ADMIN] && (
                <Nav.Item>
                    <Nav.Link href={ROUTES.ADMIN}>Admin</Nav.Link>
                </Nav.Item>
            )}

            <Nav.Item>
                <SignOutButton />
            </Nav.Item>

        </Navbar.Collapse>

    </Navbar>
);

const NavigationNonAuth = () => (
    <Navbar>
        <Navbar.Brand href={ROUTES.LANDING}>

            <img
                src={logo}
                width="80"
                height="80"
                alt="logo"
            />

        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse className="justify-content-end">

            <Nav.Item>
                <Nav.Link href={ROUTES.SIGN_IN}>Sign In</Nav.Link>
            </Nav.Item>

        </Navbar.Collapse>

    </Navbar>
);

export default Navigation;