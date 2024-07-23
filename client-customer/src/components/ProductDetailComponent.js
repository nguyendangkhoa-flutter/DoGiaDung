import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';
import '../css/ProductDetail.css'; // Import file CSS mới

class ProductDetail extends Component {
  static contextType = MyContext;
  
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1
    };
  }

  render() {
    const prod = this.state.product;
    if (prod) {
      return (
        <div className="product-detail-container">
          <h2 className="product-detail-title">Product Details</h2>
          <div className="product-detail-figure">
            <img 
              src={"data:image/jpg;base64," + prod.image} 
              className="product-detail-image" 
              alt={prod.name} 
            />
            <div className="product-detail-info">
              <table>
                <tbody>
                  <tr>
                    <td>ID:</td>
                    <td>{prod._id}</td>
                  </tr>
                  <tr>
                    <td>Name:</td>
                    <td>{prod.name}</td>
                  </tr>
                  <tr>
                    <td>Price:</td>
                    <td>${prod.price.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Category:</td>
                    <td>{prod.category.name}</td>
                  </tr>
                  <tr>
                    <td>Quantity:</td>
                    <td>
                      <input 
                        type="number" 
                        min="1" 
                        max="99" 
                        value={this.state.txtQuantity} 
                        onChange={(e) => this.setState({ txtQuantity: e.target.value })} 
                      />
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td>
                      <input 
                        type="submit" 
                        value="Add to Cart" 
                        onClick={(e) => this.btnAdd2CartClick(e)} 
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
    return <div>Loading...</div>;
  }

  // Event Handlers
  btnAdd2CartClick(e) {
    e.preventDefault();
    const { product, txtQuantity } = this.state;
    const quantity = parseInt(txtQuantity);
    if (quantity && product) {
      const mycart = this.context.mycart.slice();
      const index = mycart.findIndex(x => x.product._id === product._id);
      if (index === -1) {
        mycart.push({ product, quantity });
      } else {
        mycart[index].quantity += quantity;
      }
      this.context.setMycart(mycart);
      alert('Item added to cart!');
    } else {
      alert('Please input a valid quantity');
    }
  }

  componentDidMount() {
    const { id } = this.props.params;
    this.apiGetProduct(id);
  }

  // APIs
  apiGetProduct(id) {
    axios.get(`/api/customer/products/${id}`).then((res) => {
      this.setState({ product: res.data });
    });
  }
}

export default withRouter(ProductDetail);
