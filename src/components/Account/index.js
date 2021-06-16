import React, { Component } from 'react';
import { Form, Button, Card, Alert } from "react-bootstrap"
import { compose } from 'recompose';

import {
    AuthUserContext,
    withAuthorization,
    withEmailVerification,
} from '../Session';
import { withFirebase } from '../Firebase';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';

const SIGN_IN_METHODS = [
    {
        id: 'password',
        provider: null,
    },
    {
        id: 'google.com',
        provider: 'googleProvider',
    },
    {
        id: 'facebook.com',
        provider: 'facebookProvider',
    },
    {
        id: 'twitter.com',
        provider: 'twitterProvider',
    },
];

const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <div>
                <Card>
                    <Card.Body>
                        <h1 className="text-center mb-2">Account: {authUser.email}</h1>
                        <h4 className="text-center mb-2 text-muted">Reset Password using Email</h4>
                        <PasswordForgetForm />
                        <h4 className="text-center mb-2 text-muted">Reset Password</h4>
                        <PasswordChangeForm />
                        <LoginManagement authUser={authUser} />
                    </Card.Body>
                </Card>
            </div>
        )}
    </AuthUserContext.Consumer>
);

class LoginManagementBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeSignInMethods: [],
            error: null,
        };
    }

    componentDidMount() {
        this.fetchSignInMethods();
    }

    fetchSignInMethods = () => {
        this.props.firebase.auth
            .fetchSignInMethodsForEmail(this.props.authUser.email)
            .then(activeSignInMethods =>
                this.setState({ activeSignInMethods, error: null }),
            )
            .catch(error => this.setState({ error }));
    };

    onSocialLoginLink = provider => {
        this.props.firebase.auth.currentUser
            .linkWithPopup(this.props.firebase[provider])
            .then(this.fetchSignInMethods)
            .catch(error => this.setState({ error }));
    };

    onDefaultLoginLink = password => {
        const credential = this.props.firebase.emailAuthProvider.credential(
            this.props.authUser.email,
            password,
        );

        this.props.firebase.auth.currentUser
            .linkAndRetrieveDataWithCredential(credential)
            .then(this.fetchSignInMethods)
            .catch(error => this.setState({ error }));
    };

    onUnlink = providerId => {
        this.props.firebase.auth.currentUser
            .unlink(providerId)
            .then(this.fetchSignInMethods)
            .catch(error => this.setState({ error }));
    };

    render() {
        const { activeSignInMethods, error } = this.state;

        return (
            <div>
                {error && <Alert variant="danger">{error.message}</Alert>}
                Sign In Methods:
                <ul>
                    {SIGN_IN_METHODS.map(signInMethod => {
                        const onlyOneLeft = activeSignInMethods.length === 1;
                        const isEnabled = activeSignInMethods.includes(
                            signInMethod.id,
                        );

                        return (
                            <li key={signInMethod.id}>
                                {signInMethod.id === 'password' ? (
                                    <DefaultLoginToggle
                                        onlyOneLeft={onlyOneLeft}
                                        isEnabled={isEnabled}
                                        signInMethod={signInMethod}
                                        onLink={this.onDefaultLoginLink}
                                        onUnlink={this.onUnlink}
                                    />
                                ) : (
                                    <SocialLoginToggle
                                        onlyOneLeft={onlyOneLeft}
                                        isEnabled={isEnabled}
                                        signInMethod={signInMethod}
                                        onLink={this.onSocialLoginLink}
                                        onUnlink={this.onUnlink}
                                    />
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

const SocialLoginToggle = ({
    onlyOneLeft,
    isEnabled,
    signInMethod,
    onLink,
    onUnlink,
}) =>
    isEnabled ? (
        <Button
            type="button"
            variant="outline-primary"
            className="mb-2"
            onClick={() => onUnlink(signInMethod.id)}
            disabled={onlyOneLeft}
        >
            Deactivate {signInMethod.id}
        </Button>
    ) : (
        <Button
            type="button"
            variant="outline-primary"
            className="w-100 mt-1 mb-1"
            onClick={() => onLink(signInMethod.provider)}
        >
            Link {signInMethod.id}
        </Button>
    );

class DefaultLoginToggle extends Component {
    constructor(props) {
        super(props);

        this.state = { passwordOne: '', passwordTwo: '' };
    }

    onSubmit = event => {
        event.preventDefault();

        this.props.onLink(this.state.passwordOne);
        this.setState({ passwordOne: '', passwordTwo: '' });
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const {
            onlyOneLeft,
            isEnabled,
            signInMethod,
            onUnlink,
        } = this.props;

        const { passwordOne, passwordTwo } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo || passwordOne === '';

        return isEnabled ? (
            <Button
                type="button"
                className="w-100 mt-1 mb-1"
                variant="outline-secondary"
                onClick={() => onUnlink(signInMethod.id)}
                disabled={onlyOneLeft}
            >
                Deactivate {signInMethod.id}
            </Button>
        ) : (
            <Form onSubmit={this.onSubmit}>
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    className="form-control mb-2"
                    placeholder="New Password"
                />
                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    className="form-control mb-2"
                    placeholder="Confirm New Password"
                />

                <Button className="w-100 mt-1 mb-1" disabled={isInvalid} type="submit">
                    Link {signInMethod.id}
                </Button>

            </Form>
        );
    }
}

const LoginManagement = withFirebase(LoginManagementBase);

const condition = authUser => !!authUser;

export default compose(
    withEmailVerification,
    withAuthorization(condition),
)(AccountPage);