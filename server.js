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
<<<<<<< HEAD
const categoryRouter = require('./routes/category');
const supplierRouter = require('./routes/supplier');
const sales_by_dateRouter = require('./routes/sales_by_date');
=======

>>>>>>> 38ace3fc3421c27ef805c7d16e7da8978d871aeb


const db = require ('./routes/database');
const PORT = process.env.PORT || 3001;

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.use(cors(corsOptions));
app.set('trust proxy',1);
app.use(bodyparser.json());



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
<<<<<<< HEAD
app.use(categoryRouter);
app.use(supplierRouter);
app.use(saleseRouter);
app.use(sales_by_dateRouter)
=======


>>>>>>> 38ace3fc3421c27ef805c7d16e7da8978d871aeb


app.get('/api', (req,res) => {
    res.json({message: 'Welcome to ARTW'});
});

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}/api');
});
