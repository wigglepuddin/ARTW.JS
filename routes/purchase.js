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


// Add a new purchase
router.post('/api/ARTWaddpurchases', async (req, res) => {
    try {
        const { product_id, quantity_purchased, purchase_date, total_cost } = req.body;

        const insertPurchaseQuery = 'INSERT INTO purchases (product_id, quantity_purchased, purchase_date, total_cost) VALUES (?, ?, ?, ?)';
        await db.promise().execute(insertPurchaseQuery, [product_id, quantity_purchased, purchase_date, total_cost]);

        res.status(201).json({ message: "Purchase added successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal error' });
    }
});

// Get all purchases
router.get('/api/ARTWpurchases', (req, res) => {
    try {
        db.query('SELECT * FROM purchases', (err, result) => {
            if (err) {
                console.error('Error fetching purchases:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading purchases:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get purchase by ID
router.get('/api/ARTWpurchase/:purchaseId', (req, res) => {
    let purchase_id = req.params.purchaseId;
    try {
        db.query('SELECT * FROM purchases WHERE purchase_id = ?', purchase_id, (err, result) => {
            if (err) {
                console.error('Error fetching purchase:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading purchase:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update purchase by ID
router.put('/api/ARTWpurchase/:purchaseId', async (req, res) => {
    let purchase_id = req.params.purchaseId;
    const { product_id, quantity_purchased, purchase_date, total_cost } = req.body;

    if (!purchase_id || !product_id || !quantity_purchased || !purchase_date || !total_cost) {
        return res.status(400).send({ error: true, message: 'Please provide product_id, quantity_purchased, purchase_date, and total_cost' });
    }

    try {
        db.query('UPDATE purchases SET product_id = ?, quantity_purchased = ?, purchase_date = ?, total_cost = ? WHERE purchase_id = ?', [product_id, quantity_purchased, purchase_date, total_cost, purchase_id], (err, result) => {
            if (err) {
                console.error('Error updating purchase:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading purchase:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete purchase by ID
router.delete('/api/ARTWpurchase/:purchaseId', async (req, res) => {
    let purchase_id = req.params.purchaseId;
    if (!purchase_id) {
        return res.status(400).send({ error: true, message: 'provide purchase_id' });
    }

    try {
        db.query('DELETE FROM purchases WHERE purchase_id = ?', purchase_id, (err, result) => {
            if (err) {
                console.error('Error deleting purchase:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading purchases:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
