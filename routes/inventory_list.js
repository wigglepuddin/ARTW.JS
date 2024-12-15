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


// Add a new inventory list entry
router.post('/api/ARTWinventory_list', async (req, res) => {
    try {
        const { title, date, time } = req.body;

        // Create a new inventory table name based on the title and current timestamp
        const inventoryTableName = `inventory_${title.replace(/\s+/g, '_')}_${Date.now()}`;

        // Create the new inventory list entry
        const insertInventoryListQuery = 'INSERT INTO inventory_list (title, date, time, table_name) VALUES (?, ?, ?, ?)';
        
        // Replace undefined values with null to prevent bind parameter error
        const params = [title, date || null, time || null, inventoryTableName];
        
        await db.promise().execute(insertInventoryListQuery, params);

        // Create a new inventory table with a dynamic name
        const createInventoryTableQuery = `CREATE TABLE ${inventoryTableName} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_name VARCHAR(255) NOT NULL,
            quantity_in_stock INT NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            supplier VARCHAR(255),
            date DATE NOT NULL
        )`;
        await db.promise().execute(createInventoryTableQuery);

        res.status(201).json({ message: "Inventory list entry and table added successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal error' });
    }
});

// Function to fetch inventory items by list ID
const fetchInventoryByListId = async (listId) => {
    try {
        const response = await axios.get(`http://localhost:3001/api/ARTWproducts/list/${listId}`);
        setInventory(response.data);
    } catch (error) {
        console.error('Error fetching inventory items by list ID:', error);
    }
};





// Get all inventory list entries
router.get('/api/ARTWinventory_list', (req, res) => {
    try {
        db.query('SELECT * FROM inventory_list', (err, result) => {
            if (err) {
                console.error('Error fetching inventory list entries:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading inventory list entries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get inventory list entry by ID
router.get('/api/ARTWinventory_list/:inventoryListId', (req, res) => {
    let inventory_list_id = req.params.inventoryListId;
    try {
        db.query('SELECT * FROM inventory_list WHERE inventory_list_id = ?', inventory_list_id, (err, result) => {
            if (err) {
                console.error('Error fetching inventory list entry:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading inventory list entry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Update inventory list entry
router.put('/api/ARTWinventory_list/:id', async (req, res) => {
    const inventoryListId = req.params.id;
    const { title, date, time } = req.body;

    try {
        const updateInventoryListQuery = 'UPDATE inventory_list SET title = ?, date = ?, time = ? WHERE inventory_list_id = ?';
        const params = [title, date || null, time || null, inventoryListId];

        await db.promise().execute(updateInventoryListQuery, params);

        res.status(200).json({ message: "Inventory list entry updated successfully" });
    } catch (error) {
        console.error('Error updating inventory list entry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// Delete inventory list entry by ID
router.delete('/api/ARTWinventory_list/:inventoryListId', async (req, res) => {
    let inventory_list_id = req.params.inventoryListId;
    if (!inventory_list_id) {
        return res.status(400).send({ error: true, message: 'provide inventory_list_id' });
    }

    try {
        db.query('DELETE FROM inventory_list WHERE inventory_list_id = ?', inventory_list_id, (err, result) => {
            if (err) {
                console.error('Error deleting inventory list entry:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading inventory list entries:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get inventory items by list ID
router.get('/api/ARTWproducts/list/:listId', (req, res) => {
    let listId = req.params.listId;
    try {
        db.query('SELECT * FROM inventory_table_name WHERE list_id = ?', listId, (err, result) => {
            if (err) {
                console.error('Error fetching inventory items by list ID:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error fetching inventory items by list ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Add selected product items to an inventory list
router.post('/api/ARTWinventory_list/:listId/add-products', async (req, res) => {
    const inventoryListId = req.params.listId;
    const { productIds } = req.body;

    if (!inventoryListId || !productIds || !Array.isArray(productIds)) {
        return res.status(400).json({ error: true, message: 'Invalid request body' });
    }

    try {
        // Check if the inventory list exists
        const inventoryList = await getInventoryListById(inventoryListId);
        if (!inventoryList) {
            return res.status(404).json({ error: true, message: 'Inventory list not found' });
        }

        // Add the product IDs to the inventory list
        await addProductsToInventoryList(inventoryListId, productIds);

        res.status(200).json({ message: 'Selected product items added to inventory list successfully' });
    } catch (error) {
        console.error('Error adding products to inventory list:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to get inventory list by ID
const getInventoryListById = async (inventoryListId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM inventory_list WHERE inventory_list_id = ?', inventoryListId, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]); // Return the first (and only) result
            }
        });
    });
};

// Function to add product IDs to inventory list
const addProductsToInventoryList = async (inventoryListId, productIds) => {
    return new Promise((resolve, reject) => {
        // Assuming you have a table structure like inventory_list_products (inventory_list_id, product_id)
        const insertQuery = 'INSERT INTO product_inventory (inventory_list_id, product_id) VALUES ?';
        const values = productIds.map(productId => [inventoryListId, productId]);
        db.query(insertQuery, [values], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};


module.exports = router;
