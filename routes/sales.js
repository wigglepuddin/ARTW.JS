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

// Add a new sales item
router.post('/api/ARTWaddsales', async (req, res) => {
    try {
        const { product_id, quantity_sold, sale_date, total_amount } = req.body;

        const insertSalesQuery = 'INSERT INTO sales (product_id, quantity_sold, sale_date, total_amount) VALUES (?, ?, ?, ?)';
        await db.promise().execute(insertSalesQuery, [product_id, quantity_sold, sale_date, total_amount]);

        res.status(201).json({ message: "Sales item added successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal error' });
    }
});

// Get all sales items
router.get('/api/ARTWsales', (req, res) => {
    try {
        db.query('SELECT * FROM sales', (err, result) => {
            if (err) {
                console.error('Error fetching sales items:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading sales items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get sales item by ID
router.get('/api/ARTWsale/:saleId', (req, res) => {
    let sale_id = req.params.saleId;
    try {
        db.query('SELECT * FROM sales WHERE sale_id = ?', sale_id, (err, result) => {
            if (err) {
                console.error('Error fetching sales item:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading sales item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update sales item by ID
router.put('/api/ARTWsale/:saleId', async (req, res) => {
    let sale_id = req.params.saleId;
    const { product_id, quantity_sold, sale_date, total_amount } = req.body;

    if (!sale_id || !product_id || !quantity_sold || !sale_date || !total_amount) {
        return res.status(400).send({ error: true, message: 'Please provide product_id, quantity_sold, sale_date, and total_amount' });
    }

    try {
        db.query('UPDATE sales SET product_id = ?, quantity_sold = ?, sale_date = ?, total_amount = ? WHERE sale_id = ?', [product_id, quantity_sold, sale_date, total_amount, sale_id], (err, result) => {
            if (err) {
                console.error('Error updating sales item:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                // Check if any rows were affected by the update
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: true, message: 'Sale item not found' });
                }
                res.status(200).json({ success: true, message: 'Sale item updated successfully' });
            }
        });
    } catch (error) {
        console.error('Error updating sales item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Delete sales item by ID
router.delete('/api/ARTWsale/:saleId', async (req, res) => {
    let sale_id = req.params.saleId;
    if (!sale_id) {
        return res.status(400).send({ error: true, message: 'provide sale_id' });
    }

    try {
        db.query('DELETE FROM sales WHERE sale_id = ?', sale_id, (err, result) => {
            if (err) {
                console.error('Error deleting sales item:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading sale items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
