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

const db = require ('./database');
const {authenticateToken} = require ('../authentication/authenticate');

// Add a new stock
router.post('/api/ARTWstocks', async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        const insertStockQuery = 'INSERT INTO stocks (product_id, quantity) VALUES (?, ?)';
        await db.promise().execute(insertStockQuery, [product_id, quantity]);

        res.status(201).json({ message: "Stock added successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal error' });
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
        db.query('SELECT * FROM stocks WHERE stock_id = ?', stock_id, (err, result) => {
            if (err) {
                console.error('Error fetching stock:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading stock:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Delete stock by ID
router.delete('/api/ARTWstocks/:stockId', async (req, res) => {
    let stock_id = req.params.stockId;
    if (!stock_id) {
        return res.status(400).send({ error: true, message: 'provide stock_id' });
    }

    try {
        db.query('DELETE FROM stocks WHERE stock_id = ?', stock_id, (err, result) => {
            if (err) {
                console.error('Error deleting stock:', err);
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

module.exports = router;
