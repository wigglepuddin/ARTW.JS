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


//Product router
const ProductsRouter = require('./routes/products');


//Purchase router
const PurchaseRouter = require('./routes/purchase');


//Customer router
const CustomerRouter = require('./routes/customer');


//Inventory router
const InventoryRouter = require('./routes/inventory');


//Stocks router
const StocksRouter = require('./routes/stocks');


//Inventory_list router
const Inventory_listRouter = require('./routes/inventory_list');


//Roles router
const rolesRouter = require('./routes/roles');



const db = require ('./routes/database');


const PORT = process.env.PORT || 3001;

app.use(bodyparser.json());

//User router
app.use(UserRouter);



//Products router
app.use(ProductsRouter);


//Purchase router
app.use(PurchaseRouter);


//Customer router
app.use(CustomerRouter);


//Inventory Router
app.use(InventoryRouter);


//Stocks router
app.use(StocksRouter);


//Inventory_list router
app.use(Inventory_listRouter);


//Roles router
app.use(rolesRouter);





app.get('/api', (req,res) => {
    res.json({message: 'Welcome to ARTW'});
});

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}/api');
});
