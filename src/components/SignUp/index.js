import React, { Component } from 'react';
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const SignUpPage = () => (
    <>
        <Card>
            <Card.Body>
                <h1 className="text-center mb-4">SignUp</h1>
                <SignUpForm />
            </Card.Body>
        </Card>
    </>
);

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    isAdmin: false,
    error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { username, email, passwordOne, isAdmin } = this.state;
        const roles = {};

        if (isAdmin) {
            roles[ROLES.ADMIN] = ROLES.ADMIN;
        }

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                // Create a user in your Firebase realtime database
                return this.props.firebase.user(authUser.user.uid).set({
                    username,
                    email,
                    roles,
                });
            })

            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })

            .catch(error => {
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }

                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onChangeCheckbox = event => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            isAdmin,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (

            <>
                <Card>
                    <Card.Body>
                        {error && <Alert variant="danger">{error.message}</Alert>}

                        <Form onSubmit={this.onSubmit}>

                            <Form.Label>Username</Form.Label>
                            <input
                                name="username"
                                value={username}
                                onChange={this.onChange}
                                type="text"
                                className="form-control mb-2"
                                placeholder="Username"
                            />

                            <Form.Label>Email</Form.Label>
                            <input
                                name="email"
                                value={email}
                                onChange={this.onChange}
                                type="email"
                                className="form-control mb-2"
                                placeholder="Email Address"
                            />

                            <Form.Label>Password</Form.Label>
                            <input
                                name="passwordOne"
                                value={passwordOne}
                                onChange={this.onChange}
                                type="password"
                                className="form-control mb-2"
                                placeholder="Password"
                            />

                            <Form.Label>Password</Form.Label>
                            <input
                                name="passwordTwo"
                                value={passwordTwo}
                                onChange={this.onChange}
                                type="password"
                                className="form-control mb-2"
                                placeholder="Confirm Password"
                            />

                            <>
                                <div className="d-flex align-items-center justify-content-center">
                                    <Form.Label> Admin :
                                        <input
                                            name="isAdmin"
                                            type="checkbox"
                                            className="mb-2" style={{ margin: 10 }}
                                            checked={isAdmin}
                                            onChange={this.onChangeCheckbox}
                                        />
                                    </Form.Label>

                                    <Form.Label> Admin :
                                        <input
                                            name="isAdmin"
                                            type="checkbox"
                                            className="mb-2" style={{ margin: 10 }}
                                            checked={isAdmin}
                                            onChange={this.onChangeCheckbox}
                                        />
                                    </Form.Label>

                                    <Form.Label> Admin :
                                        <input
                                            name="isAdmin"
                                            type="checkbox"
                                            className="mb-2" style={{ margin: 10 }}
                                            checked={isAdmin}
                                            onChange={this.onChangeCheckbox}
                                        />
                                    </Form.Label>

                                </div>
                            </>

                            <Button className="w-100" disabled={!isInvalid} type="submit">
                                Sign Up
                            </Button>

                        </Form>
                    </Card.Body>
                </Card>
            </>
        );

    }
}

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const SignUpForm = compose(
    withRouter,
    withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };