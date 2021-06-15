import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

class UserList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.users().on('value', snapshot => {
      const usersObject = snapshot.val();

      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));

      this.setState({
        users: usersList,
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div>

        <h2>Users</h2>

        {loading && <div>Loading ...</div>}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Uid</th>
              <th>E-Mail</th>
              <th>Username</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user.uid}>

                <td>
                  {user.uid}
                </td>

                <td>
                  {user.email}
                </td>

                <td>
                  {user.username}
                </td>

                <td>
                  <Link
                    to={{
                      pathname: `${ROUTES.ADMIN}/${user.uid}`,
                      state: { user },
                    }}
                  >
                    Details
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </Table>

      </div>

    );
  }
}

export default withFirebase(UserList);