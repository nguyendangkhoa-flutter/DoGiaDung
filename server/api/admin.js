const express = require('express');
const router = express.Router();
// utils
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');
// daos
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');
const ProductDAO = require('../models/ProductDAO');
const CategoryDAO = require('../models/CategoryDAO');
const AdminDAO = require('../models/AdminDAO');
// login
router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
    if (admin) {
      const token = JwtUtil.genToken(admin._id);
      res.json({ success: true, message: 'Authentication successful', token: token });
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});
router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  const id = req.decoded.id;
  res.json({ success: true, message: 'Token is valid', token: token, id: id });
});
// category
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});
  // category
router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const category = { name: name };
  const result = await CategoryDAO.insert(category);
  res.json(result);
});
// category
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const category = { _id: _id, name: name };
  const result = await CategoryDAO.update(category);
  res.json(result);
});
router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.delete(_id);
  res.json(result);
});
// product
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  // pagination
  const noProducts = await ProductDAO.selectByCount();
  const sizePage = 4;
  const noPages = Math.ceil(noProducts / sizePage);
  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page); // /products?page=xxx
  const skip = (curPage - 1) * sizePage;
  const products = await ProductDAO.selectBySkipLimit(skip, sizePage);
  // return
  const result = { products: products, noPages: noPages, curPage: curPage };
  res.json(result);
});

  // product
router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = { name: name, price: price, image: image, cdate: now, category: category };
  const result = await ProductDAO.insert(product);
  res.json(result);
});
// product
router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = { _id: _id, name: name, price: price, image: image, cdate: now, category: category };
  const result = await ProductDAO.update(product);
  res.json(result);
});
// product
router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});
// order
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});
// order
router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});
// customer
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});
// order
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});
// customer
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 0);
  res.json(result);
});
// customer
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const cust = await CustomerDAO.selectByID(_id);
  if (cust) {
    const send = await EmailUtil.send(cust.email, cust._id, cust.token);
    if (send) {
      res.json({ success: true, message: 'Please check email' });
    } else {
      res.json({ success: false, message: 'Email failure' });
    }
  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});
//statistics
router.get('/statistics',JwtUtil.checkToken,async function(req, res) {
  const noCategories = await CategoryDAO.selectByCount();
  const noProducts = await ProductDAO.selectByCount();
  const noOrders = await OrderDAO.selectByCount();
  const noOrdersPending = await OrderDAO.selectByCountStatus('PENDING');
  const noOrdersApproved = await OrderDAO.selectByCountStatus('APPROVED');
  const noOrdersCanceled = await OrderDAO.selectByCountStatus('CANCELED');
  const noOrdersRevenue = await OrderDAO.sumTotalApproved();
  const noCustomers = await CustomerDAO.selectByCount();
  res.json ({
    noCategories : noCategories,
    noProducts : noProducts,
    noOrders : noOrders,
    noOrdersPending : noOrdersPending,
    noOrdersApproved : noOrdersApproved,
    noOrdersCanceled : noOrdersCanceled,
    noOrdersRevenue : noOrdersRevenue,
    noCustomers : noCustomers
  });
});
module.exports = router;
