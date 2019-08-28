import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import AppContent from './AppContent/AppContent';
import styles from './App.module.css';
import Login from './Login/Login';
import AppMain from './AppMain/AppMain';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: false, 
      token: localStorage.getItem('token')
    }
    console.log(this.state.token)
  }

  setToken = (token) => {
    this.setState({token: token})
  }

  logout = () => {
    localStorage.removeItem('token')
    this.setState({logged_in: false, token: ''})
  }

  render() {
  return (
    <Router token={this.state.token}>
      <div className={styles.app}>
        <AppContent>
          <Route path='/' component={AppMain} />  
          <Route path='/login' component={Login} />
          <Route path='/tasklist' component={AppMain} />
        </AppContent>
        <Route path="/logout" render={() => {
          this.logout()
          return <Redirect to={{ pathname: "/login" }} />;
          }} />
      </div>
    </Router>
  );
  }
}

export default App