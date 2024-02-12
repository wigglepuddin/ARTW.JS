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

const db = require ('/database');
const {authenticateToken} = require ('../authentication/authenticate');


// Add new customer
router.post('/api/ARTWaddcustomer', async (req, res) => {

    try {

        const { customer_name, contact_number } = req.body;

        const insertProductQuery = 'INSERT INTO customers (customer_name, contact_number) VALUES (?, ?)';
        await db.promise().execute(insertProductQuery, [ customer_name, contact_number ]);

        res.status(201).json({ message: "Customer added successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal error' });
    }
});


//Get customers
router.get('/api/ARTWcustomers', async (req, res) => {

    try {

        db.query('SELECT * FROM customers', (err, result) => {

            if (err) {
                console.error('Error fetching customers:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading customers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//Get customer_id
router.get('/api/ARTWcustomer/:customerId', (req, res) => {

    let customer_id = req.params.customerId;

    try {
        db.query('SELECT * FROM customers WHERE customer_id = ?', customer_id, (err, result) => {

            if (err) {
                console.error('Error fetching product:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Update customer
router.put('/api/ARTWcustomer/:customerId', async (req, res) => {
    let customer_id = req.params.customerId;

    const { customer_name, contact_number } = req.body;

    if (!customer_id || !customer_name || !contact_number) {
        return res.status(400).send({ error: true, message: 'Please provide customer name and contact number' });
    }

    try {
        db.query('UPDATE customers SET customer_name = ?, contact_number = ? WHERE customer_id = ?', [customer_name, contact_number, customer_id], (err, result) => {
            if (err) {
                console.error('Error updating customer:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




//Delete customer
router.delete('/api/ARTWcustomer/:customerId', async (req, res) => {

    let customer_id = req.params.customerId;

    if (!customer_id) {
        return res.status(400).send({ error: true, message: 'provide customer id' });
    }

    try {
        db.query('DELETE FROM customers WHERE customer_id = ?', customer_id, (err, result) => {

            if (err) {
                console.error('Error deleting customer:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading customer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router;
