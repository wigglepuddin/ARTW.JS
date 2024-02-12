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


// Add a new inventory list entry
router.post('/api/ARTWinventory_list', async (req, res) => {
    try {
        const { inventory_id, date, time } = req.body;

        const insertInventoryListQuery = 'INSERT INTO inventory_list (inventory_id, date, time) VALUES (?, ?, ?)';
        await db.promise().execute(insertInventoryListQuery, [inventory_id, date, time]);

        res.status(201).json({ message: "Inventory list entry added successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal error' });
    }
});

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

// Update inventory list entry by ID
router.put('/api/ARTWinventory_list/:inventoryListId', async (req, res) => {
    let inventory_list_id = req.params.inventoryListId;
    const { inventory_id, date, time } = req.body;

    if (!inventory_list_id || !inventory_id || !date || !time) {
        return res.status(400).send({ error: true, message: 'Please provide inventory_id, date, and time' });
    }

    try {
        db.query('UPDATE inventory_list SET inventory_id = ?, date = ?, time = ? WHERE inventory_list_id = ?', [inventory_id, date, time, inventory_list_id], (err, result) => {
            if (err) {
                console.error('Error updating inventory list entry:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading inventory list entry:', error);
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

module.exports = router;