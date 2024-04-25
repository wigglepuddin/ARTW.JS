const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors());

//User router
const UserRouter = require('./routes/users');
const ProductsRouter = require('./routes/products');
const PurchaseRouter = require('./routes/purchase');
const CustomerRouter = require('./routes/customer');
const InventoryRouter = require('./routes/inventory');
const StocksRouter = require('./routes/stocks');
const Inventory_listRouter = require('./routes/inventory_list');
const rolesRouter = require('./routes/roles');
const saleseRouter = require('./routes/sales');



const db = require ('./routes/database');
const PORT = process.env.PORT || 3001;

app.use(bodyparser.json());

//User router
app.use(UserRouter);
app.use(ProductsRouter);
app.use(PurchaseRouter);
app.use(CustomerRouter);
app.use(InventoryRouter);
app.use(StocksRouter);
app.use(Inventory_listRouter);
app.use(rolesRouter);
app.use(saleseRouter);




app.get('/api', (req,res) => {
    res.json({message: 'Restful API Backend Using ExpressJS'});
});

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}/api');
});
