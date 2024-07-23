import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import '../css/Product.css'; // Import file CSS mới

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      sort: 'default',
    };
  }

  render() {
    const prods = this.state.products.map((item) => (
      <div key={item._id} className="product-item">
        <Link to={'/product/' + item._id}>
          <img src={"data:image/jpg;base64," + item.image} alt={item.name} />
        </Link>
        <div className="product-caption">
          <h3>{item.name}</h3>
          <p>Price: ${item.price.toFixed(2)}</p>
        </div>
      </div>
    ));

    return (
      <div className="product-container">
        <h2 className="product-title">List of Products</h2>
        <div className="product-sort">
          <select value={this.state.sort} onChange={(e) => {
            const sort = e.target.value;
            this.setState({ sort }, () => this.cmbSortChange(sort));
          }}>
            <option value="default">------Sort by------</option>
            <option value="nameASC">Name (A → Z)</option>
            <option value="nameDESC">Name (Z → A)</option>
            <option value="priceASC">Price (Low → High)</option>
            <option value="priceDESC">Price (High → Low)</option>
          </select>
        </div>
        <div className="product-list">
          {prods}
        </div>
      </div>
    );
  }

  // Event Handlers
  cmbSortChange(sort) {
    const sortedProducts = [...this.state.products];
    if (sort === 'nameASC') {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'nameDESC') {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'priceASC') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'priceDESC') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    this.setState({ products: sortedProducts });
  }

  componentDidMount() {
    const { params } = this.props;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  componentDidUpdate(prevProps) {
    const { params } = this.props;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  // APIs
  apiGetProductsByKeyword(keyword) {
    axios.get(`/api/customer/products/search/${keyword}`).then((res) => {
      this.setState({ products: res.data });
    });
  }

  apiGetProductsByCatID(cid) {
    axios.get(`/api/customer/products/category/${cid}`).then((res) => {
      this.setState({ products: res.data });
    });
  }
}

export default withRouter(Product);
