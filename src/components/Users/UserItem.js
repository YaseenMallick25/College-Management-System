import React, { Component } from 'react';
import { Button, Card } from "react-bootstrap"

import { withFirebase } from '../Firebase';

class UserItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            user: null,
            ...props.location.state,
        };
    }

    componentDidMount() {
        if (this.state.user) {
            return;
        }

        this.setState({ loading: true });

        this.props.firebase
            .user(this.props.match.params.id)
            .on('value', snapshot => {
                this.setState({
                    user: snapshot.val(),
                    loading: false,
                });
            });
    }

    componentWillUnmount() {
        this.props.firebase.user(this.props.match.params.id).off();
    }

    onSendPasswordResetEmail = () => {
        this.props.firebase.doPasswordReset(this.state.user.email);
    };

    render() {
        const { user, loading } = this.state;

        return (
            <div>
                <Card>
                    <h2 className="text-center mb-4">User : ({this.props.match.params.id})</h2>
                    {loading && <div>Loading ...</div>}

                    {user && (
                        <div>
                            <Card className="text-center m-4" >
                                <Card.Body>
                                    <span>
                                        <strong>ID:</strong> {user.uid}
                                    </span>
                                    <br></br>
                                    <span>
                                        <strong>E-Mail:</strong> {user.email}
                                    </span>
                                    <br></br>
                                    <span>
                                        <strong>Username:</strong> {user.username}
                                    </span>
                                    <span>
                                        <Button
                                            type="button"
                                            variant="outline-primary"
                                            onClick={this.onSendPasswordResetEmail}
                                        >
                                            Send Password Reset
                                        </Button>
                                    </span>
                                </Card.Body>

                            </Card>
                        </div>
                    )
                    }
                </Card>
            </div>
        );
    }
}

export default withFirebase(UserItem);