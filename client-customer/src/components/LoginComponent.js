import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import '../css/Login.css'; // Import file CSS mới

class Login extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: ''
    };
  }

  render() {
    return (
      <div className="login-container">
        <h2>CUSTOMER LOGIN</h2>
        <form className="login-form">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={this.state.txtUsername}
            onChange={(e) => this.setState({ txtUsername: e.target.value })}
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={this.state.txtPassword}
            onChange={(e) => this.setState({ txtPassword: e.target.value })}
          />
          <input
            type="submit"
            value="LOGIN"
            onClick={(e) => this.btnLoginClick(e)}
          />
          <div className="forgot-password">
            <Link to='/resetpwd'>Forgot password?</Link>
          </div>
        </form>
      </div>
    );
  }

  btnLoginClick(e) {
    e.preventDefault();
    const { txtUsername: username, txtPassword: password } = this.state;
    if (username && password) {
      const account = { username, password };
      this.apiLogin(account);
    } else {
      toast.warning('Please input username and password');
    }
  }

  apiLogin(account) {
    axios.post('/api/customer/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
        this.context.setCustomer(result.customer);
        this.props.navigate('/home');
        toast.success('Welcome to ShoppingOnline');
      } else {
        toast.error(result.message);
      }
    });
  }
}

export default withRouter(Login);
