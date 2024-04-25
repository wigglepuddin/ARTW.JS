const express = require("express");
const router = express.Router();
const db = require('./database');

// Create a new product inventory entry
router.post('/api/product_inventory', async (req, res) => {
    try {
        const { product_id, inventory_list_id } = req.body;

        // Validate that product_id and inventory_list_id are provided
        if (!product_id || !inventory_list_id) {
            return res.status(400).json({ error: 'Please provide product_id and inventory_list_id' });
        }

        // Insert the product inventory entry into the database
        const insertProductInventoryQuery = 'INSERT INTO product_inventory (product_id, inventory_list_id) VALUES (?, ?)';
        await db.promise().execute(insertProductInventoryQuery, [product_id, inventory_list_id]);

        res.status(201).json({ message: 'Product inventory entry added successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal error' });
    }
});


// Get all product inventory entries
router.get('/api/product_inventory', async (req, res) => {
    try {
        const getProductInventoryQuery = 'SELECT * FROM product_inventory';
        const [rows] = await db.promise().execute(getProductInventoryQuery);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching product inventory entries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get product inventory entry by ID
router.get('/api/product_inventory/:productInventoryId', async (req, res) => {
    const product_inventory_id = req.params.productInventoryId;
    try {
        const getProductInventoryByIdQuery = 'SELECT * FROM product_inventory WHERE product_inventory_id = ?';
        const [rows] = await db.promise().execute(getProductInventoryByIdQuery, [product_inventory_id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching product inventory entry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update product inventory entry by ID
router.put('/api/product_inventory/:productInventoryId', async (req, res) => {
    const product_inventory_id = req.params.productInventoryId;
    const { product_id, inventory_list_id } = req.body;

    if (!product_inventory_id || !product_id || !inventory_list_id) {
        return res.status(400).send({ error: true, message: 'Please provide product_id and inventory_list_id' });
    }

    try {
        const updateProductInventoryQuery = 'UPDATE product_inventory SET product_id = ?, inventory_list_id = ? WHERE product_inventory_id = ?';
        await db.promise().execute(updateProductInventoryQuery, [product_id, inventory_list_id, product_inventory_id]);
        res.status(200).json({ message: "Product inventory entry updated successfully" });
    } catch (error) {
        console.error('Error updating product inventory entry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete product inventory entry by ID
router.delete('/api/product_inventory/:productInventoryId', async (req, res) => {
    const product_inventory_id = req.params.productInventoryId;
    if (!product_inventory_id) {
        return res.status(400).send({ error: true, message: 'provide product_inventory_id' });
    }

    try {
        const deleteProductInventoryQuery = 'DELETE FROM product_inventory WHERE product_inventory_id = ?';
        await db.promise().execute(deleteProductInventoryQuery, [product_inventory_id]);
        res.status(200).json({ message: "Product inventory entry deleted successfully" });
    } catch (error) {
        console.error('Error deleting product inventory entry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
