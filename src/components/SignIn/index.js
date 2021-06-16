import React, { Component } from 'react';
import { Form, Button, Card, Alert } from "react-bootstrap"
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { IconContext } from "react-icons";
import { FaFacebook, FaGoogle, FaTwitter } from 'react-icons/fa';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInPage = () => (
    <>
        <Card>
            <Card.Body>
                <h1 className="text-center mb-4">Sign In</h1>
                <SignInForm />
                <SignInGoogle />
                <SignInFacebook />
                <SignInTwitter />
                <PasswordForgetLink />
                <SignUpLink />
            </Card.Body>
        </Card>
    </>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = 'An account with an E-Mail address to this social account already exists. Try to login from this account instead and associate your social accounts on your personal account page.';

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <>
                <Card>
                    <Card.Body>

                        {error && <Alert variant="danger">{error.message}</Alert>}

                        <Form onSubmit={this.onSubmit}>

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
                                name="password"
                                value={password}
                                onChange={this.onChange}
                                type="password"
                                className="form-control mb-2"
                                placeholder="Password"
                            />

                            <Button disabled={isInvalid} className="w-100 mb-1 mt-3" type="submit">
                                Log In
                            </Button>

                        </Form>

                    </Card.Body>
                </Card>
            </>
        );
    }
}

class SignInGoogleBase extends Component {
    constructor(props) {
        super(props);

        this.state = { error: null };
    }

    onSubmit = event => {
        this.props.firebase
            .doSignInWithGoogle()
            .then(socialAuthUser => {
                // Create a user in your Firebase Realtime Database too
                return this.props.firebase.user(socialAuthUser.user.uid).set({
                    username: socialAuthUser.user.displayName,
                    email: socialAuthUser.user.email,
                    roles: {},
                });
            })
            .then(() => {
                this.setState({ error: null });
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

    render() {
        const { error } = this.state;

        return (

            <Form className="d-flex align-items-center justify-content-center" onSubmit={this.onSubmit}>
                {error && <Alert variant="danger">{error.message}</Alert>}
                <Button
                    variant="outline-primary"
                    className="d-flex align-items-center justify-content-center w-70 mb-1 mt-2"
                    type="submit"
                >
                    <IconContext.Provider value={{ color: "red", className: "react-icons", style: "" }}>

                        <div>
                            <FaGoogle className="mb-1" style={{ marginRight: 10 }} />
                        </div>

                    </IconContext.Provider>

                    Sign In with Google

                </Button >

                {error && <p>{error.message}</p>}

            </Form >

        );
    }
}

class SignInFacebookBase extends Component {
    constructor(props) {
        super(props);

        this.state = { error: null };
    }

    onSubmit = event => {
        this.props.firebase
            .doSignInWithFacebook()
            .then(socialAuthUser => {
                // Create a user in your Firebase Realtime Database too
                return this.props.firebase.user(socialAuthUser.user.uid).set({
                    username: socialAuthUser.additionalUserInfo.profile.name,
                    email: socialAuthUser.additionalUserInfo.profile.email,
                    roles: {},
                });
            })
            .then(() => {
                this.setState({ error: null });
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

    render() {
        const { error } = this.state;

        return (
            <>
                {error && <Alert variant="danger">{error.message}</Alert>}
                <Form className="d-flex align-items-center justify-content-center" onSubmit={this.onSubmit}>

                    <Button
                        variant="outline-primary"
                        className="d-flex align-items-center justify-content-center w-70 mb-1 mt-2"
                        type="submit"
                    >

                        <IconContext.Provider value={{ color: "purple", className: "react-icons", style: "" }}>

                            <div>
                                <FaFacebook className="mb-1" style={{ marginRight: 10 }} />
                            </div>

                        </IconContext.Provider>

                        Sign In with Facebook

                    </Button >

                </Form >
            </>
        );
    }
}

class SignInTwitterBase extends Component {
    constructor(props) {
        super(props);

        this.state = { error: null };
    }

    onSubmit = event => {
        this.props.firebase
            .doSignInWithTwitter()
            .then(socialAuthUser => {
                // Create a user in your Firebase Realtime Database too
                return this.props.firebase.user(socialAuthUser.user.uid).set({
                    username: socialAuthUser.additionalUserInfo.profile.name,
                    email: socialAuthUser.additionalUserInfo.profile.email,
                    roles: {},
                });
            })
            .then(() => {
                this.setState({ error: null });
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

    render() {
        const { error } = this.state;

        return (
            <>
                {error && <Alert variant="danger">{error.message}</Alert>}
                <Form className="d-flex align-items-center justify-content-center" onSubmit={this.onSubmit}>
                    <Button
                        variant="outline-primary"
                        className="d-flex align-items-center justify-content-center w-70 mb-1 mt-2"
                        type="submit"
                    >

                        <IconContext.Provider value={{ color: "blue", className: "react-icons", style: "" }}>

                            <div>
                                <FaTwitter className="mb-1" style={{ marginRight: 10 }} />
                            </div>

                        </IconContext.Provider>

                        Sign In with Twitter

                    </Button >

                </Form >
            </>
        );
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase);

const SignInGoogle = compose(
    withRouter,
    withFirebase,
)(SignInGoogleBase);

const SignInFacebook = compose(
    withRouter,
    withFirebase,
)(SignInFacebookBase);

const SignInTwitter = compose(
    withRouter,
    withFirebase,
)(SignInTwitterBase);

export default SignInPage;

export { SignInForm, SignInGoogle, SignInFacebook, SignInTwitter };