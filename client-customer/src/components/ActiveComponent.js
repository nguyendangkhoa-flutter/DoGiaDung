import axios from 'axios';
import React, { Component } from 'react';
import '../css/Active.css'; // Import file CSS mới

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtToken: '',
      message: ''
    };
  }

  render() {
    return (
      <div className="active-container">
        <div className="active-form">
          <h2 className="text-center">Activate Account</h2>
          <form>
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input
                id="id"
                type="text"
                value={this.state.txtID}
                onChange={(e) => this.setState({ txtID: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="token">Token</label>
              <input
                id="token"
                type="text"
                value={this.state.txtToken}
                onChange={(e) => this.setState({ txtToken: e.target.value })}
              />
            </div>
            <div className="form-group">
              <input
                type="submit"
                value="Activate"
                onClick={(e) => this.btnActiveClick(e)}
              />
            </div>
            {this.state.message && (
              <div className={`alert ${this.state.message === 'OK BABY!' ? 'success' : ''}`}>
                {this.state.message}
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  btnActiveClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const token = this.state.txtToken;
    if (id && token) {
      this.apiActive(id, token);
    } else {
      this.setState({ message: 'Please input ID and token' });
    }
  }

  apiActive(id, token) {
    const body = { id: id, token: token };
    axios.post('/api/customer/active', body).then((res) => {
      const result = res.data;
      if (result) {
        this.setState({ message: 'Activation successful!' });
      } else {
        this.setState({ message: 'Activation failed!' });
      }
    });
  }
}

export default Active;
