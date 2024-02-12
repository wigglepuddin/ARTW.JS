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

const db = require ('/Users/wiggl/Desktop/Prelim/backend/routes/database');
const {authenticateToken} = require ('/Users/wiggl/Desktop/Prelim/backend/authentication/authenticate');

// Add a new inventory item
router.post('/api/ARTWinventory', async (req, res) => {
    try {
        const { product_id, item, stock_id, quantity } = req.body;

        const insertInventoryQuery = 'INSERT INTO inventory (product_id, item, stock_id, quantity) VALUES (?, ?, ?, ?)';
        await db.promise().execute(insertInventoryQuery, [product_id, item, stock_id, quantity]);

        res.status(201).json({ message: "Inventory item added successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal error' });
    }
});

// Get all inventory items
router.get('/api/ARTWinventory', (req, res) => {
    try {
        db.query('SELECT * FROM inventory', (err, result) => {
            if (err) {
                console.error('Error fetching inventory items:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading inventory items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get inventory item by ID
router.get('/api/ARTWinventory/:inventoryId', (req, res) => {
    let inventory_id = req.params.inventoryId;
    try {
        db.query('SELECT * FROM inventory WHERE inventory_id = ?', inventory_id, (err, result) => {
            if (err) {
                console.error('Error fetching inventory item:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading inventory item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update inventory item by ID
router.put('/api/ARTWinventory/:inventoryId', async (req, res) => {
    let inventory_id = req.params.inventoryId;
    const { product_id, item, stock_id, quantity } = req.body;

    if (!inventory_id || !product_id || !item || !stock_id || !quantity) {
        return res.status(400).send({ error: true, message: 'Please provide product_id, item, stock_id, and quantity' });
    }

    try {
        db.query('UPDATE inventory SET product_id = ?, item = ?, stock_id = ?, quantity = ? WHERE inventory_id = ?', [product_id, item, stock_id, quantity, inventory_id], (err, result) => {
            if (err) {
                console.error('Error updating inventory item:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading inventory item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete inventory item by ID
router.delete('/api/ARTWinventory/:inventoryId', async (req, res) => {
    let inventory_id = req.params.inventoryId;
    if (!inventory_id) {
        return res.status(400).send({ error: true, message: 'provide inventory_id' });
    }

    try {
        db.query('DELETE FROM inventory WHERE inventory_id = ?', inventory_id, (err, result) => {
            if (err) {
                console.error('Error deleting inventory item:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading inventory items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;