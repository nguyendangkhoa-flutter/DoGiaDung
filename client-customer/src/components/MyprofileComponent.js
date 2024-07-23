import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import '../css/Myprofile.css'; // Import file CSS mới

class Myprofile extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: ''
    };
  }

  componentDidMount() {
    if (this.context.customer) {
      this.setState({
        txtUsername: this.context.customer.username,
        txtPassword: this.context.customer.password,
        txtName: this.context.customer.name,
        txtPhone: this.context.customer.phone,
        txtEmail: this.context.customer.email
      });
    }
  }

  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);

    return (
      <div className="myprofile-container">
        <h2>My Profile</h2>
        <div className="form-container">
          <form>
            <table className="form-table">
              <tbody>
                <tr>
                  <th>Username</th>
                  <td><input type="text" className="input-field" value={this.state.txtUsername} onChange={(e) => this.setState({ txtUsername: e.target.value })} /></td>
                </tr>
                <tr>
                  <th>Password</th>
                  <td><input type="password" className="input-field" value={this.state.txtPassword} onChange={(e) => this.setState({ txtPassword: e.target.value })} /></td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td><input type="text" className="input-field" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} /></td>
                </tr>
                <tr>
                  <th>Phone</th>
                  <td><input type="tel" className="input-field" value={this.state.txtPhone} onChange={(e) => this.setState({ txtPhone: e.target.value })} /></td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td><input type="email" className="input-field" value={this.state.txtEmail} onChange={(e) => this.setState({ txtEmail: e.target.value })} /></td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <button className="submit-button" onClick={(e) => this.btnUpdateClick(e)}>Update</button>
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
  btnUpdateClick = (e) => {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = this.state;

    if (txtUsername && txtPassword && txtName && txtPhone && txtEmail) {
      const customer = { username: txtUsername, password: txtPassword, name: txtName, phone: txtPhone, email: txtEmail };
      this.apiPutCustomer(this.context.customer._id, customer);
    } else {
      alert('Please input all fields.');
    }
  }

  // API Calls
  apiPutCustomer = (id, customer) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/customer/customers/' + id, customer, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Profile updated successfully!');
        this.context.setCustomer(result);
      } else {
        alert('Update failed. Please try again.');
      }
    });
  }
}

export default Myprofile;
