import React from 'react';
import styles from './Login.module.css';
import LoginErrorModal from './LoginErrorModal'
import { Container, Button, Form } from "react-bootstrap"

const api_base = "http://localhost:4000"


export default class Login extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false
    };
  }

  handleSubmit = async e => {
    e.preventDefault();

    const { username, password } = e.target;

    // Login request
    try {
      const data = await fetch(api_base + '/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value
        })
      }).then(res => res.json());

      console.log(data.token);
      if (data.token) {
        localStorage.setItem('token', data.token);
        this.props.history.push('/tasklist')
      } else {
        this.setState({modalShow: true});
      }
    } catch (err) {
      console.log(err);
      this.setState({modalShow: true})
    }
  }

  render() {
    return (
      <Container style={{marginLeft: '40%'}}>
        <h2>TODO Login</h2>
        <Form onSubmit={this.handleSubmit}>
          <div className={`${styles.inputDiv} pb-1`}>
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" name='username' required />
          </div>
          <div className={`${styles.inputDiv} pb-1`}>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name='password' required />
          </div>
          <Button type='submit' onSubmit={this.handleSubmit}>Login</Button>
        </Form>

        <LoginErrorModal
          show={this.state.modalShow}
          onHide={() => {
            this.setState({modalShow: false})
          }}
        />
      </Container>

    );
  }

}
