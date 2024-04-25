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
const { authenticateToken } = require ('../authentication/authenticate');

router.post('/api/ARTWproducts', async (req, res) => {
    try {
        const { inventory_list_id, product_name, quantity_in_stock, price, supplier } = req.body;

        const insertInventoryQuery = 'INSERT INTO products (inventory_list_id, product_name, quantity_in_stock, price, supplier, date) VALUES (?, ?, ?, ?, ?, NOW())';
        await db.promise().execute(insertInventoryQuery, [inventory_list_id, product_name, quantity_in_stock, price, supplier]);

        res.status(201).json({ message: "Inventory item added successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal error' });
    }
});


// Get all inventory items
router.get('/api/ARTWproducts', (req, res) => {
    try {
        db.query('SELECT * FROM products', (err, result) => {
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
router.get('/api/ARTWproducts/:productId', (req, res) => {
    let productId = req.params.productId;
    try {
        db.query('SELECT * FROM products WHERE product_id = ?', productId, (err, result) => {
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
router.put('/api/ARTWproducts/:productId', async (req, res) => {
    let productId = req.params.productId;
    const { product_name, quantity_in_stock, price, supplier } = req.body;

    if (!product_name || !quantity_in_stock || !price || !supplier) {
        return res.status(400).send({ error: true, message: 'Please provide all required fields' });
    }

    try {
        const updateInventoryQuery = 'UPDATE products SET product_name = ?, quantity_in_stock = ?, price = ?, supplier = ?, date = NOW(), updated_at = NOW() WHERE product_id = ?';
        await db.promise().execute(updateInventoryQuery, [product_name, quantity_in_stock, price, supplier, productId]);

        // Retrieve the updated product from the database
        const [updatedProductRows] = await db.promise().execute('SELECT * FROM products WHERE product_id = ?', [productId]);
        const updatedProduct = updatedProductRows[0];

        // Send the updated product in the response
        res.status(200).json({ message: "Inventory item updated successfully", updatedProduct });
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Disable/Undisable product
router.put('/api/ARTWproducts/disable/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        // Check the current status of the product
        const [product] = await db.promise().query('SELECT * FROM products WHERE product_id = ?', [productId]);

        if (!product.length) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const currentStatus = product[0].disabled;

        // Toggle the disabled status of the product in the database
        const newStatus = currentStatus ? 0 : 1;

        await db.promise().query('UPDATE products SET disabled = ? WHERE product_id = ?', [newStatus, productId]);

        res.status(200).json({ message: `Product ${currentStatus ? 'undisabled' : 'disabled'} successfully` });
    } catch (error) {
        console.error('Error toggling product status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete inventory item by ID
router.delete('/api/ARTWproducts/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        // Check if the product exists
        const [product] = await db.promise().query('SELECT * FROM products WHERE product_id = ?', [productId]);

        if (!product.length) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete the product from the database
        await db.promise().query('DELETE FROM products WHERE product_id = ?', [productId]);

        res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;