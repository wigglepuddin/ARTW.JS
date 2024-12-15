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

router.put('/api/ARTWproduct/disable/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        // Check the current status of the product
        const [product] = await db.promise().query('SELECT * FROM products WHERE product_id = ?', [productId]);

        if (!product.length) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const currentStatus = product[0].status;

        // Toggle the status of the product in the database
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

        await db.promise().query('UPDATE products SET status = ? WHERE product_id = ?', [newStatus, productId]);

        res.status(200).json({ message: `Product ${currentStatus === 'active' ? 'disabled' : 'enabled'} successfully` });
    } catch (error) {
        console.error('Error toggling product status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router;
