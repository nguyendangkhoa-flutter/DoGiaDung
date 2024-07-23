import axios from 'axios';
import React, { Component } from 'react';
import '../css/Signup.css'; // Import file CSS mới

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
      errorMessage: ''
    };
  }

  render() {
    return (
      <div className="signup-container">
        <h2>SIGN UP</h2>
        <div className="signup-form">
          <form>
            <table className="form-table">
              <tbody>
                <tr>
                  <td>Username</td>
                  <td><input type="text" className="input-field" value={this.state.txtUsername} onChange={(e) => this.setState({ txtUsername: e.target.value })} /></td>
                </tr>
                <tr>
                  <td>Password</td>
                  <td><input type="password" className="input-field" value={this.state.txtPassword} onChange={(e) => this.setState({ txtPassword: e.target.value })} /></td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td><input type="text" className="input-field" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} /></td>
                </tr>
                <tr>
                  <td>Phone</td>
                  <td><input type="tel" className="input-field" value={this.state.txtPhone} onChange={(e) => this.setState({ txtPhone: e.target.value })} /></td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td><input type="email" className="input-field" value={this.state.txtEmail} onChange={(e) => this.setState({ txtEmail: e.target.value })} /></td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <button className="submit-button" onClick={(e) => this.btnSignupClick(e)}>SIGN UP</button>
                    {this.state.errorMessage && <div className="error-message">{this.state.errorMessage}</div>}
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </div>
      </div>
    );
  }

  // Event Handlers
  btnSignupClick = (e) => {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;
    if (txtUsername && txtPassword && txtName && txtPhone && txtEmail) {
      const account = { username: txtUsername, password: txtPassword, name: txtName, phone: txtPhone, email: txtEmail };
      this.apiSignup(account);
    } else {
      this.setState({ errorMessage: 'Please input all fields.' });
    }
  }

  // API Calls
  apiSignup = (account) => {
    axios.post('/api/customer/signup', account).then((res) => {
      const result = res.data;
      alert(result.message);
      if (result.success) {
        // Clear form or redirect user on success
        this.setState({
          txtUsername: '',
          txtPassword: '',
          txtName: '',
          txtPhone: '',
          txtEmail: '',
          errorMessage: ''
        });
      }
    }).catch(error => {
      this.setState({ errorMessage: 'An error occurred. Please try again.' });
    });
  }
}

export default Signup;
