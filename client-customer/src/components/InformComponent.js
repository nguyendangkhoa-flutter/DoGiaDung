import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import '../css/Inform.css'; // Import file CSS mới

class Inform extends Component {
  static contextType = MyContext;

  render() {
    const { token, customer, mycart } = this.context;

    return (
      <div className="inform-container">
        <div className="inform-links">
          {token === '' ? (
            <>
              <Link to='/login'>Login</Link>
              <Link to='/signup'>Sign-up</Link>
              <Link to='/active'>Activate</Link>
            </>
          ) : (
            <div className="inform-welcome">
              <span>Hello, <b>{customer.name}</b></span>
              <Link to='/home' onClick={this.lnkLogoutClick}>Logout</Link>
              <Link to='/myprofile'>My Profile</Link>
              <Link to='/myorders'>My Orders</Link>
            </div>
          )}
        </div>
        <div className="inform-cart">
          <Link to='/mycart'>My Cart</Link> have <b>{mycart.length}</b> items
        </div>
      </div>
    );
  }

  // Event Handlers
  lnkLogoutClick = () => {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([]);
  }
}

export default Inform;
