import React from 'react';
import Nav from 'react-bootstrap/Nav';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

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

    <Nav className="justify-content-end">

        <Nav.Item as="li">
            <Nav.Link href={ROUTES.LANDING}>Landing</Nav.Link>
        </Nav.Item>

        <Nav.Item as="li">
            <Nav.Link href={ROUTES.HOME}>Home</Nav.Link>
        </Nav.Item>

        <Nav.Item as="li">
            <Nav.Link href={ROUTES.ACCOUNT}>Account</Nav.Link>
        </Nav.Item>

        {!!authUser.roles[ROLES.ADMIN] && (
            <Nav.Item as="li">
                <Nav.Link href={ROUTES.ADMIN}>Admin</Nav.Link>
            </Nav.Item>
        )}

        <Nav.Item as="li">
            <SignOutButton />
        </Nav.Item>

    </Nav>
);

const NavigationNonAuth = () => (

    <Nav className="justify-content-end">

        <Nav.Item as="li">
            <Nav.Link href={ROUTES.LANDING}>Landing</Nav.Link>
        </Nav.Item>

        <Nav.Item as="li">
            <Nav.Link href={ROUTES.SIGN_IN}>Sign In</Nav.Link>
        </Nav.Item>

    </Nav>
);

export default Navigation;