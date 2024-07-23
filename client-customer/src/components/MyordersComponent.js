import React, { Component } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import '../css/Myorders.css'; // Import file CSS mới

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }

  componentDidMount() {
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    }
  }

  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);

    const ordersList = this.state.orders.map((item) => (
      <tr key={item._id} onClick={() => this.handleOrderClick(item)}>
        <td>{item._id}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.customer.name}</td>
        <td>{item.customer.phone}</td>
        <td>${item.total.toFixed(2)}</td>
        <td>{item.status}</td>
      </tr>
    ));

    const orderItems = this.state.order ? this.state.order.items.map((item, index) => (
      <tr key={item.product._id}>
        <td>{index + 1}</td>
        <td>{item.product._id}</td>
        <td>{item.product.name}</td>
        <td><img src={"data:image/jpg;base64," + item.product.image} width="70" height="70" alt={item.product.name} /></td>
        <td>${item.product.price.toFixed(2)}</td>
        <td>{item.quantity}</td>
        <td>${(item.product.price * item.quantity).toFixed(2)}</td>
      </tr>
    )) : null;

    return (
      <div className="myorders-container">
        <h2 className="text-center">Order List</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Creation Date</th>
                <th>Customer Name</th>
                <th>Customer Phone</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ordersList.length > 0 ? ordersList : (
                <tr className="empty-state">
                  <td colSpan="6">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {this.state.order && (
          <div className="order-detail-container">
            <h2 className="text-center">Order Detail</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.length > 0 ? orderItems : (
                    <tr className="empty-state">
                      <td colSpan="7">No items found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  handleOrderClick = (order) => {
    this.setState({ order });
  }

  apiGetOrdersByCustID = (cid) => {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get(`/api/customer/orders/customer/${cid}`, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
}

export default Myorders;
