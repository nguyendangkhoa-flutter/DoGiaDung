import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import '../css/Menu.css'; // Import file CSS mới

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: ''
    };
  }

  render() {
    const cates = this.state.categories.map((item) => (
      <li key={item._id} className="menu-list-item">
        <Link to={'/product/category/' + item._id}>{item.name}</Link>
      </li>
    ));

    return (
      <div className="menu-container">
        <ul className="menu-list">
          <li><Link to='/'>Home</Link></li>
          {cates}
          <li><Link to='/gmap'>Gmap</Link></li>
        </ul>
        <div className="switch-container">
          <input
            type="checkbox"
            onChange={(e) => this.ckbChangeMode(e)}
          />
          <span>Light / Dark mode</span>
        </div>
        <div className="search-container">
          <input
            type="search"
            placeholder="Enter keyword"
            value={this.state.txtKeyword}
            onChange={(e) => { this.setState({ txtKeyword: e.target.value }) }}
          />
          <input
            type="submit"
            value="SEARCH"
            onClick={(e) => this.btnSearchClick(e)}
          />
        </div>
      </div>
    );
  }

  ckbChangeMode(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }

  btnSearchClick(e) {
    e.preventDefault();
    this.props.navigate('/product/search/' + this.state.txtKeyword);
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  apiGetCategories() {
    axios.get('/api/customer/categories').then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}

export default withRouter(Menu);
