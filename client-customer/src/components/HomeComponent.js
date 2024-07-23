import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from './SliderComponent';
import '../css/Home.css'; // Import file CSS mới

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: []
    };
  }

  renderProductList(products) {
    return products.map((item) => (
      <div key={item._id} className="product-item">
        <figure>
          <Link to={'/product/' + item._id}>
            <img src={"data:image/jpg;base64," + item.image} alt={item.name} />
          </Link>
          <figcaption>
            <div>{item.name}</div>
            <div>Price: ${item.price}</div>
          </figcaption>
        </figure>
      </div>
    ));
  }

  render() {
    const { newprods, hotprods } = this.state;
    
    return (
      <div className="home-container">
        <div className="slider-container">
          <Slider />
        </div>
        
        <div className="product-section">
          <h2>New Products</h2>
          <div className="product-grid">
            {this.renderProductList(newprods)}
          </div>
        </div>
        
        {hotprods.length > 0 && (
          <div className="product-section">
            <h2>Hot Products</h2>
            <div className="product-grid">
              {this.renderProductList(hotprods)}
            </div>
          </div>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }

  // APIs
  apiGetNewProducts() {
    axios.get('/api/customer/products/new').then((res) => {
      this.setState({ newprods: res.data });
    });
  }

  apiGetHotProducts() {
    axios.get('/api/customer/products/hot').then((res) => {
      this.setState({ hotprods: res.data });
    });
  }
}

export default Home;
