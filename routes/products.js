const express = require("express");
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors());

const secretKey = 'rex-secret-key';

const db = require ('/database');
const {authenticateToken} = require ('../authentication/authenticate');


// Add a new product
router.post('/api/ARTWaddproducts', async (req, res) => {

    try {

        const { product_name, quantity_in_stock, price } = req.body;

        const insertProductQuery = 'INSERT INTO products (product_name, quantity_in_stock, price) VALUES (?, ?, ?)';
        await db.promise().execute(insertProductQuery, [product_name, quantity_in_stock, price]);

        res.status(201).json({ message: "Product added successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal error' });
    }
});

// Get all products
router.get('/api/ARTWproducts', (req, res) => {

    try {

        db.query('SELECT * FROM products', (err, result) => {

            if (err) {
                console.error('Error fetching products:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get product ID
router.get('/api/ARTWproduct/:productId', (req, res) => {

    let product_id = req.params.productId;

    try {
        db.query('SELECT * FROM products WHERE product_id = ?', product_id, (err, result) => {

            if (err) {
                console.error('Error fetching product:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update product 
router.put('/api/ARTWproduct/:productId', async (req, res) => {

    let product_id = req.params.productId;

    const { product_name, quantity_in_stock, price } = req.body;

    if (!product_id || !product_name || !quantity_in_stock || !price) {
        return res.status(400).send({ error: true, message: 'Please provide product_name, quantity_in_stock, and price' });
    }

    try {
        db.query('UPDATE products SET product_name = ?, quantity_in_stock = ?, price = ? WHERE product_id = ?', [product_name, quantity_in_stock, price, product_id], (err, result) => {
            if (err) {
                console.error('Error updating product:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete product 
router.delete('/api/ARTWproduct/:productId', async (req, res) => {

    let product_id = req.params.productId;

    if (!product_id) {
        return res.status(400).send({ error: true, message: 'provide product_id' });
    }

    try {
        db.query('DELETE FROM products WHERE product_id = ?', product_id, (err, result) => {

            if (err) {
                console.error('Error deleting product:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  
  module.exports = router;
