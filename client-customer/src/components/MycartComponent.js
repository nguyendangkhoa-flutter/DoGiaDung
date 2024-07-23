import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import axios from 'axios';
import withRouter from '../utils/withRouter';
import '../css/Mycart.css'; // Import file CSS mới

class Mycart extends Component {
  static contextType = MyContext;

  render() {
    const { mycart } = this.context;
    const cartItems = mycart.map((item, index) => (
      <tr key={item.product._id}>
        <td>{index + 1}</td>
        <td>{item.product._id}</td>
        <td>{item.product.name}</td>
        <td>{item.product.category.name}</td>
        <td><img src={"data:image/jpg;base64," + item.product.image} width="70" height="70" alt={item.product.name} /></td>
        <td>${item.product.price.toFixed(2)}</td>
        <td>{item.quantity}</td>
        <td>${(item.product.price * item.quantity).toFixed(2)}</td>
        <td><span className="link" onClick={() => this.handleRemove(item.product._id)}>Remove</span></td>
      </tr>
    ));

    return (
      <div className="mycart-container">
        <h2 className="text-center">Your Cart</h2>
        <table className="mycart-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Image</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems}
            <tr className="total-row">
              <td colSpan="7">Total</td>
              <td>${CartUtil.getTotal(mycart).toFixed(2)}</td>
              <td><span className="link" onClick={this.handleCheckout}>Checkout</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  handleCheckout = () => {
    if (window.confirm('Are you sure you want to proceed?')) {
      if (this.context.mycart.length > 0) {
        const total = CartUtil.getTotal(this.context.mycart);
        const items = this.context.mycart;
        const customer = this.context.customer;
        if (customer) {
          this.apiCheckout(total, items, customer);
        } else {
          this.props.navigate('/login');
        }
      } else {
        alert('Your cart is empty');
      }
    }
  };

  apiCheckout = (total, items, customer) => {
    const body = { total, items, customer };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/customer/checkout', body, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('Checkout successful!');
        this.context.setMycart([]);
        this.props.navigate('/home');
      } else {
        alert('Checkout failed!');
      }
    });
  };

  handleRemove = (id) => {
    const mycart = this.context.mycart.filter(item => item.product._id !== id);
    this.context.setMycart(mycart);
  };
}

export default withRouter(Mycart);
