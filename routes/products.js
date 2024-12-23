
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
const { authenticateToken } = require ('../authentication/authenticate');

router.post('/api/ARTWproducts', async (req, res) => {
    try {
        const { inventory_list_id, product_name, quantity_in_stock, price, supplier } = req.body;
<<<<<<< HEAD
        const barcode = uuidv4(); // Generate a unique barcode

        const insertInventoryQuery = 'INSERT INTO products (inventory_list_id, product_name, quantity_in_stock, price, supplier, date, barcode) VALUES (?, ?, ?, ?, ?, NOW(), ?)';
        await db.promise().execute(insertInventoryQuery, [inventory_list_id, product_name, quantity_in_stock, price, supplier, barcode]);
=======

        const insertInventoryQuery = 'INSERT INTO products (inventory_list_id, product_name, quantity_in_stock, price, supplier, date) VALUES (?, ?, ?, ?, ?, NOW())';
        await db.promise().execute(insertInventoryQuery, [inventory_list_id, product_name, quantity_in_stock, price, supplier]);
>>>>>>> 38ace3fc3421c27ef805c7d16e7da8978d871aeb

        res.status(201).json({ message: "Inventory item added successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal error' });
    }
});


// Get all inventory items
<<<<<<< HEAD
// Get all non-archived inventory items
router.get('/api/ARTWproducts', (req, res) => {
    try {
        db.query('SELECT * FROM products WHERE status != "archived"', (err, result) => {
=======
router.get('/api/ARTWproducts', (req, res) => {
    try {
        db.query('SELECT * FROM products', (err, result) => {
>>>>>>> 38ace3fc3421c27ef805c7d16e7da8978d871aeb
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

<<<<<<< HEAD


=======
>>>>>>> 38ace3fc3421c27ef805c7d16e7da8978d871aeb
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
<<<<<<< HEAD
}); 
=======
});
>>>>>>> 38ace3fc3421c27ef805c7d16e7da8978d871aeb

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

<<<<<<< HEAD
// Archive inventory item by ID
router.put('/api/ARTWproducts/archive/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        // Check if the product exists
        const [product] = await db.promise().query('SELECT * FROM products WHERE product_id = ?', [productId]);

        if (!product.length) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Archive the product by setting its status to "archived"
        await db.promise().query('UPDATE products SET status = ? WHERE product_id = ?', ['archived', productId]);

        res.status(200).json({ message: 'Inventory item archived successfully' });
    } catch (error) {
        console.error('Error archiving inventory item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

=======
>>>>>>> 38ace3fc3421c27ef805c7d16e7da8978d871aeb

module.exports = router;