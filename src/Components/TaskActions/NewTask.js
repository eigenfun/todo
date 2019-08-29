import React from "react";
import { Button, Modal, Form, Container, Row, Col } from "react-bootstrap"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import {getAuthConfig} from '../../util'

class TaskCreateModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        status: "new",
        dueDate: new Date(),
        createDate: new Date(),
        task: "",
        priority: "High",
        notes: ""
      };
    }

    handleDateChange = (date) => {
      this.setState({
        dueDate: date
      });
    }

    handleChange = (event) => {
      let input_name = event.target.name
      let input_value = event.target.value
      let update = []
      update[input_name] = input_value
      this.setState(update)
    }

    handleSubmit = (event) => {
      event.preventDefault();
      
      this.setState({created: new Date()})

      var config = getAuthConfig()

      axios.post("http://localhost:4000/api/tasks", 
        this.state,         
        config)
        .then(() => {
        this.props.onHide()
      })
    }

    render() {
      return (

        <Modal
          {...this.props}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
        <form name="new-task" onSubmit={this.handleSubmit}>

          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">New Task</Modal.Title>
          </Modal.Header>

          <Modal.Body>
              <Container> 
              <Row>
              <Col>     
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Task Name</Form.Label>
                <Form.Control type="text" placeholder="Task" onChange={this.handleChange} name="task" />

              </Form.Group>
              </Col>
              </Row>
              <Row>
                <Col>            
                  <Form.Label>Priority</Form.Label>
                  <Form.Control as="select" name="priority" onChange={this.handleChange}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Label>Due Date</Form.Label>
                  <Form.Text className="text-muted"></Form.Text>
                  <DatePicker
                    selected={this.state.dueDate}
                    onChange={this.handleDateChange}
                  />
                </Col>
              </Row>

              <Row>
              <Col>
                <Form.Label>Notes</Form.Label>
                <Form.Control as="textarea" rows="3" onChange={this.handleChange} name="notes" />
              </Col>
              </Row>
              </Container>
          </Modal.Body>

          <Modal.Footer>

            <Button onClick={this.props.onHide}>Cancel</Button>
            <Button variant="primary" type="submit">
                Submit
            </Button>
          </Modal.Footer>
          </form>
        </Modal>
        

      );
    }

  }
  
  export default TaskCreateModal