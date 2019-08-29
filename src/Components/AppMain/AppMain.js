import React from "react";
import {Redirect} from 'react-router-dom';
import { Container, Button, Navbar, Nav, Form } from "react-bootstrap"
import TaskCreateModal from "../TaskActions/NewTask"
import dateFormat from "dateformat"
import axios from 'axios';

import _ from "lodash";
import {getAuthConfig} from '../../util'

// Import React Table
import ReactTable from "react-table";
import "react-table/react-table.css";

export default class AppMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: [],
      modalShow: false,
      token: localStorage.getItem('token'),
      logged_in: true,
      count: 0
    };
    console.log(this.state.token)
  }

  componentDidMount() {
    this.getTodos()
    this.markDone()
  }

  componentDidUpdate() {
    
    this.markDone()
  }

  getTodos = async () => {
    var bearer = `Bearer ${this.state.token}`;
    console.log('bearer is: ' + bearer)

    var config = getAuthConfig()

    try {
      const res = await axios.get("http://localhost:4000/api/tasks", config);
      console.log(res);
      if (res.status === 403) {
        console.log(">>> NO AUTH <<<" + res.status)
        this.setState({logged_in: false})
      } else {
        console.log(res)
        this.setState({
          isLoaded: true,
          data: res.data
        })
      }
    } catch (error) {
      console.error(error);
      this.setState({
        isLoaded: true,
        data: [],
        logged_in: false
      });
    }
  }

  find_id = (event) => {
    console.log(event.target)
    let id = event.target.dataset.tag
    console.log(id)
    var to_be_done = null
    var key = null
    this.state.data.forEach((o, i) => {
      if (o._id === id) {
        to_be_done = id
        key = i
      }
    })
    return {to_be_done, key}
  }

  handleDone = (event) => {
      event.preventDefault();
      event.target.closest('div[role=row]').style.color = '#8FBC8F'
      console.log(event.target)

      let {to_be_done, key} = this.find_id(event)
      let prop = this.state.data[key] 
      prop.status = 'done'
      this.setState({data: this.state.data})
      if (to_be_done) {
        console.log(to_be_done)
        var config = getAuthConfig()
        axios.put("http://localhost:4000/api/tasks/" + to_be_done, 
        {status: 'done'}, config)
        this.getTodos()
      }
  }

  handleDelete = (event) => {
    event.preventDefault();
    let {to_be_done, key} = this.find_id(event)
    delete this.state.data[key] 
    this.setState({data: this.state.data})
    if (to_be_done) {
      console.log(to_be_done)
      var config = getAuthConfig()
      axios.put("http://localhost:4000/api/tasks/" + to_be_done, 
      {status: 'delete'}, config)
    }
  }

  markDone() {
    let els = document.querySelectorAll('[task_state="done"]');
    els.forEach((e) => {
      console.log(e)
      e.parentElement.parentElement.parentElement.style.color = 'green'
    })
  }

  render() {
    const { data } = this.state;
    return (
      this.state.logged_in ?
      <Container>
          <link rel="stylesheet" 
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">Task Manager</Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">

          <Form inline style={{marginLeft: '70%'}}>
            <Button
                variant="primary"
                onClick={() => this.setState({modalShow:true})}>
                New Task
            </Button>
            <span>&nbsp;</span>
            <Nav.Link href='/logout'>Logout</Nav.Link>
          </Form>
        </Navbar.Collapse>
      </Navbar>

        <ReactTable
          data={data}
          columns={[
            {
              Header: "Task",
              id: "task",
              accessor: t => t.task + (t.status == 'done' ? " \u2713" : ""),
              headerStyle: {textAlign: 'left'}
            },
            {
              id: 'createdDate',
              Header: 'Created',
              accessor: d => dateFormat(d.createdDate, "dddd, mmmm dS"),
              headerStyle: {textAlign: 'left'}
            },
            {
              id: 'due_date',
              Header: "Due Date",
              accessor: d => dateFormat(d.dueDate, "dddd, mmmm dS"),
              headerStyle: {textAlign: 'left'}
            },
            {
              Header: "Priority",
              accessor: "priority",
              headerStyle: {textAlign: 'left'}
            },
            {
              Header: 'Actions',
              headerStyle: {textAlign: 'left'},
              accessor: '_id',
              Cell: props => (
                <span>
                  <Button variant="success" data-tag={props.original._id}
                      onClick={this.handleDone} task_state={props.original.status}> 
                      Done
                  </Button>

                  <span>&nbsp;</span>
                  
                  <Button variant="danger" onClick={this.handleDelete} data-tag={props.original._id} >
                      Delete
                  </Button>
                </span>
              )
            }]}

          defaultPageSize={10}
          className="-striped -highlight"
          
          SubComponent={row => {
            return (
              <div style={{ padding: "20px" }}>
                <b>Notes: </b>
                <p>
                  {row.original.notes}
                </p>
              </div>
            );
          }}
        />

        <TaskCreateModal
          show={this.state.modalShow}
          onHide={() => {
            this.setState({modalShow: false})
            this.getTodos()
          }}
        />
      </Container>
      :
      <Redirect to={{ pathname: "/login" }} />
    );
  }
}