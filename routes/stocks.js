const express = require("express");
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const app = express();
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
app.use(cors());

const secretKey = 'rex-secret-key';

const db = require ('./database');
const {authenticateToken} = require ('../authentication/authenticate');

// Add a new stock
router.post('/api/ARTWaddstocks', async (req, res) => {
    try {
        const { product_name, product_description, quantity, price, supplier, category, } = req.body;
        const barcode = uuidv4(); // Generate a unique barcode

        const insertStockQuery = `
            INSERT INTO stocks (product_name, product_description, quantity, price, supplier, category, barcode) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await db.promise().execute(insertStockQuery, [product_name, product_description, quantity, price, supplier, category, barcode]);

        res.status(201).json({ message: "Stock added successfully" });
    } catch (error) {
        console.error('Error adding stock:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Get all stocks
router.get('/api/ARTWstocks', (req, res) => {
    try {
        db.query('SELECT * FROM stocks', (err, result) => {
            if (err) {
                console.error('Error fetching stocks:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading stocks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get stock by ID
router.get('/api/ARTWstocks/:stockId', (req, res) => {
    let stock_id = req.params.stockId;
    try {
        db.query('SELECT * FROM stocks WHERE stock_id = ?', [stock_id], (err, result) => {
            if (err) {
                console.error('Error fetching stock:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                if (result.length === 0) {
                    res.status(404).json({ message: 'Stock not found' });
                } else {
                    res.status(200).json(result[0]);
                }
            }
        });
    } catch (error) {
        console.error('Error loading stock:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Update stock by ID
router.put('/api/ARTWupdatestocks/:stockId', async (req, res) => {
    let stock_id = req.params.stockId;
    const { product_name, product_description, quantity, price, supplier, category } = req.body;

    if (!stock_id) {
        return res.status(400).json({ error: true, message: 'Provide stock_id' });
    }

    try {
        const updateStockQuery = `
            UPDATE stocks 
            SET product_name = ?, product_description = ?, quantity = ?, price = ?, supplier = ?, category = ?
            WHERE stock_id = ?
        `;
        const [result] = await db.promise().execute(updateStockQuery, [product_name, product_description, quantity, price, supplier, category, stock_id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Stock not found' });
        } else {
            res.status(200).json({ message: 'Stock updated successfully' });
        }
    } catch (error) {
        console.error('Error updating stock:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Delete stock by ID
router.delete('/api/ARTWdeletestocks/:stockId', async (req, res) => {
    let stock_id = req.params.stockId;
    if (!stock_id) {
        return res.status(400).json({ error: true, message: 'Provide stock_id' });
    }

    try {
        db.query('DELETE FROM stocks WHERE stock_id = ?', [stock_id], (err, result) => {
            if (err) {
                console.error('Error deleting stock:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                if (result.affectedRows === 0) {
                    res.status(404).json({ message: 'Stock not found' });
                } else {
                    res.status(200).json({ message: 'Stock deleted successfully' });
                }
            }
        });
    } catch (error) {
        console.error('Error deleting stock:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get stock by product name
router.get('/api/ARTWstocks/price/:productName', (req, res) => {
    const product_name = req.params.productName;

    try {
        db.query('SELECT price FROM stocks WHERE product_name = ?', [product_name], (err, result) => {
            if (err) {
                console.error('Error fetching stock price:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                if (result.length === 0) {
                    res.status(404).json({ message: 'Product not found' });
                } else {
                    res.status(200).json(result[0]);
                }
            }
        });
    } catch (error) {
        console.error('Error loading stock price:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
