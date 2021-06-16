import React, { Component } from 'react';
import { Form, Button, Card, Alert } from "react-bootstrap"

import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

class PasswordChangeForm extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { passwordOne } = this.state;

        this.props.firebase
            .doPasswordUpdate(passwordOne)
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
        const { passwordOne, passwordTwo, error } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo || passwordOne === '';

        return (
            <>
                <Card>
                    <Card.Body>
                        {error && <Alert variant="danger">{error.message}</Alert>}
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
                            <Button className="w-100" disabled={isInvalid} type="submit">
                                Reset My Password
                            </Button>
                        </Form>
                    </Card.Body>

                </Card>
            </>
        );
    }
}

export default withFirebase(PasswordChangeForm);