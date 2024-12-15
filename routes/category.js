const express = require("express");
const router = express.Router();
const db = require('./database');
const { authenticateToken } = require('../authentication/authenticate');

// Create a new category
router.post('/api/ARTWaddcategory', (req, res) => {
    const { name, description } = req.body;
    const query = 'INSERT INTO category (name, description) VALUES (?, ?)';
    db.query(query, [name, description], (err, result) => {
        if (err) {
            console.error('Error creating category:', err);
            res.status(500).send('Server error');
        } else {
            res.status(201).send(`Category added with name: ${name}`);
        }
    });
});

// Get all categories
router.get('/api/ARTWcategory', (req, res) => {
    const query = 'SELECT * FROM category';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching categories:', err);
            res.status(500).send('Server error');
        } else {
            res.status(200).json(results);
        }
    });
});

// Get a single category by name
router.get('/api/ARTWcategory/:name', (req, res) => {
    const { name } = req.params;
    const query = 'SELECT * FROM category WHERE name = ?';
    db.query(query, [name], (err, results) => {
        if (err) {
            console.error('Error fetching category:', err);
            res.status(500).send('Server error');
        } else if (results.length === 0) {
            res.status(404).send('Category not found');
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// Update a category by name
router.put('/api/ARTWupdatecategory/:name', (req, res) => {
    const { name } = req.params;
    const { description } = req.body;
    const query = 'UPDATE category SET description = ? WHERE name = ?';
    db.query(query, [description, name], (err, result) => {
        if (err) {
            console.error('Error updating category:', err);
            res.status(500).send('Server error');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Category not found');
        } else {
            res.status(200).send('Category updated successfully');
        }
    });
});

// Delete a category by name
router.delete('/api/ARTWdeletecategory/:name', (req, res) => {
    const { name } = req.params;
    const query = 'DELETE FROM category WHERE name = ?';
    db.query(query, [name], (err, result) => {
        if (err) {
            console.error('Error deleting category:', err);
            res.status(500).send('Server error');
        } else if (result.affectedRows === 0) {
            res.status(404).send('Category not found');
        } else {
            res.status(200).send('Category deleted successfully');
        }
    });
});


module.exports = router;
