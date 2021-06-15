import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button'

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
    <Button variant="link" onClick={firebase.doSignOut}>
        Sign Out
    </Button>
);

export default withFirebase(SignOutButton);