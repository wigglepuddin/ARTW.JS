const express = require("express");
const router = express.Router();
const db = require('./database');
const { authenticateToken } = require('../authentication/authenticate');

// Create a new supplier
router.post('/api/ARTWaddsupplier', (req, res) => {
    const { name, description, address, phone, email } = req.body;
    const query = 'INSERT INTO supplier (name, description, address, phone, email) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, description, address, phone, email], (err, result) => {
        if (err) {
            console.error('Error creating supplier:', err);
            res.status(500).send('Server error');
        } else {
            res.status(201).send(`Supplier added with name: ${name}`);
        }
    });
});

// Get all suppliers
router.get('/api/ARTWsupplier', (req, res) => {
    const query = 'SELECT * FROM supplier';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching suppliers:', err);
            res.status(500).send('Server error');
        } else {
            res.status(200).json(results);
        }
    });
});

// Get a single supplier by name
router.get('/api/ARTWsupplier/:name', (req, res) => {
    const { name } = req.params;
    const query = 'SELECT * FROM supplier WHERE name = ?';
    db.query(query, [name], (err, results) => {
        if (err) {
            console.error('Error fetching supplier:', err);
            res.status(500).send('Server error');
        } else if (results.length === 0) {
            res.status(404).send('Supplier not found');
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// Update a supplier by name
router.put('/api/ARTWupdatesupplier/:name', (req, res) => {
    const { name } = req.params;
    const { description, address, phone, email } = req.body;
    const query = 'UPDATE supplier SET description = ?, address = ?, phone = ?, email = ? WHERE name = ?';
    db.query(query, [description, address, phone, email, name], (err, result) => {
        if (err) {
            console.error('Error updating supplier:', err);
            res.status(500).send('Server error');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Supplier not found');
        } else {
            res.status(200).send('Supplier updated successfully');
        }
    });
});

// Delete a supplier by name
router.delete('/api/ARTWdeletesupplier/:name', (req, res) => {
    const { name } = req.params;
    const query = 'DELETE FROM supplier WHERE name = ?';
    db.query(query, [name], (err, result) => {
        if (err) {
            console.error('Error deleting supplier:', err);
            res.status(500).send('Server error');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Supplier not found');
        } else {
            res.status(200).send('Supplier deleted successfully');
        }
    });
});

module.exports = router;
