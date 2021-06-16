import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from "react-bootstrap"

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const PasswordForgetPage = () => (
    <div>
        <h1 className="text-center mb-4">PasswordForget</h1>
        <PasswordForgetForm />
    </div>
);

const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email } = this.state;

        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
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
        const { email, error } = this.state;

        const isInvalid = email === '';

        return (
            <>
                <Card>
                    <Card.Body>
                        {error && <Alert variant="danger">{error.message}</Alert>}
                        <Form onSubmit={this.onSubmit}>
                            <input
                                name="email"
                                value={this.state.email}
                                onChange={this.onChange}
                                type="email"
                                className="form-control mb-2"
                                placeholder="Email Address"
                            />

                            <Button className="w-100 mb-1 mt-3" disabled={isInvalid} type="submit">
                                Reset My Password
                            </Button>

                        </Form>
                    </Card.Body>

                </Card>
            </>
        );
    }
}

const PasswordForgetLink = () => (
    <p>
        <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
    </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };