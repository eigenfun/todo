import React from "react";
import { Button, Modal, Form, Container, Row, Col } from "react-bootstrap"
import "react-datepicker/dist/react-datepicker.css";

class LoginErrorModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    handleSubmit = (event) => {
    }

    render() {
      return (

        <Modal
          {...this.props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered>

          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Login Error</Modal.Title>
          </Modal.Header>

          <Modal.Body>
              <Container> 
              <Row>
              <Col>     
                Incorrect login or password!
              </Col>
              </Row>
              </Container>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
        

      );
    }

  }
  
  export default LoginErrorModal