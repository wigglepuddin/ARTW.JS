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

// Add a new sales item
router.post('/api/ARTWaddsales', async (req, res) => {
    try {
<<<<<<< HEAD
        const { product_name, quantity_sold, sale_date, total_amount } = req.body;

        // Check if sale_date is provided, otherwise, default to the current date
        const dateToUse = sale_date || new Date().toISOString().split('T')[0];  // Default to today if no date is provided

        const insertSalesQuery = `
        INSERT INTO sales (product_name, quantity_sold, sale_date, total_amount) 
        SELECT product_name, ?, ?, price * ? as total_amount
        FROM stocks 
        WHERE product_name = ?
        `;

        await db.promise().execute(insertSalesQuery, [quantity_sold, dateToUse, quantity_sold, product_name]);
=======
        const { product_id, quantity_sold, sale_date, total_amount } = req.body;

        const insertSalesQuery = 'INSERT INTO sales (product_id, quantity_sold, sale_date, total_amount) VALUES (?, ?, ?, ?)';
        await db.promise().execute(insertSalesQuery, [product_id, quantity_sold, sale_date, total_amount]);
>>>>>>> 38ace3fc3421c27ef805c7d16e7da8978d871aeb

        res.status(201).json({ message: "Sales item added successfully" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal error' });
    }
});

<<<<<<< HEAD

=======
>>>>>>> 38ace3fc3421c27ef805c7d16e7da8978d871aeb
// Get all sales items
router.get('/api/ARTWsales', (req, res) => {
    try {
        db.query('SELECT * FROM sales', (err, result) => {
            if (err) {
                console.error('Error fetching sales items:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading sales items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get sales item by ID
router.get('/api/ARTWsale/:saleId', (req, res) => {
    let sale_id = req.params.saleId;
    try {
        db.query('SELECT * FROM sales WHERE sale_id = ?', sale_id, (err, result) => {
            if (err) {
                console.error('Error fetching sales item:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading sales item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update sales item by ID
<<<<<<< HEAD
// Update only the quantity_sold by sale ID
router.put('/api/ARTWsale/:saleId', async (req, res) => {
    let sale_id = req.params.saleId;
    const { quantity_sold } = req.body;

    if (!sale_id || !quantity_sold) {
        return res.status(400).send({ error: true, message: 'Please provide quantity_sold and sale_id' });
    }

    try {
        // Fetch the existing sale item to retain the other fields
        db.query('SELECT * FROM sales WHERE sale_id = ?', [sale_id], (err, results) => {
            if (err) {
                console.error('Error fetching sales item:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // If no sale item is found
            if (results.length === 0) {
                return res.status(404).json({ error: true, message: 'Sale item not found' });
            }

            const existingSale = results[0]; // Get the current data for the sale item

            // Update only the quantity_sold, keeping the other fields unchanged
            db.query(
                'UPDATE sales SET quantity_sold = ? WHERE sale_id = ?', 
                [quantity_sold, sale_id], 
                (err, result) => {
                    if (err) {
                        console.error('Error updating sales item:', err);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({ error: true, message: 'Sale item not found' });
                    }

                    res.status(200).json({ success: true, message: 'Sale quantity updated successfully' });
                }
            );
        });
    } catch (error) {
        console.error('Error updating sale item:', error);
=======
router.put('/api/ARTWsale/:saleId', async (req, res) => {
    let sale_id = req.params.saleId;
    const { product_id, quantity_sold, sale_date, total_amount } = req.body;

    if (!sale_id || !product_id || !quantity_sold || !sale_date || !total_amount) {
        return res.status(400).send({ error: true, message: 'Please provide product_id, quantity_sold, sale_date, and total_amount' });
    }

    try {
        db.query('UPDATE sales SET product_id = ?, quantity_sold = ?, sale_date = ?, total_amount = ? WHERE sale_id = ?', [product_id, quantity_sold, sale_date, total_amount, sale_id], (err, result) => {
            if (err) {
                console.error('Error updating sales item:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                // Check if any rows were affected by the update
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: true, message: 'Sale item not found' });
                }
                res.status(200).json({ success: true, message: 'Sale item updated successfully' });
            }
        });
    } catch (error) {
        console.error('Error updating sales item:', error);
>>>>>>> 38ace3fc3421c27ef805c7d16e7da8978d871aeb
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Delete sales item by ID
router.delete('/api/ARTWsale/:saleId', async (req, res) => {
    let sale_id = req.params.saleId;
    if (!sale_id) {
<<<<<<< HEAD
        return res.status(400).send({ error: true, message: 'Provide sale_id' });
=======
        return res.status(400).send({ error: true, message: 'provide sale_id' });
>>>>>>> 38ace3fc3421c27ef805c7d16e7da8978d871aeb
    }

    try {
        db.query('DELETE FROM sales WHERE sale_id = ?', sale_id, (err, result) => {
            if (err) {
                console.error('Error deleting sales item:', err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
<<<<<<< HEAD
        console.error('Error deleting sales item:', error);
=======
        console.error('Error loading sale items:', error);
>>>>>>> 38ace3fc3421c27ef805c7d16e7da8978d871aeb
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

<<<<<<< HEAD
// Get all sales items with profit calculation
router.get('/api/ARTWsales', async (req, res) => {
    try {
        // Make sure to adjust the table and field names according to your actual database schema
        const query = `
            SELECT 
                sale_id, 
                product_name, 
                quantity_sold, 
                sale_date, 
                total_amount, 
                (total_amount - cost_price) AS profit 
            FROM 
                sales
        `;

        // Execute the query
        const [rows] = await db.promise().execute(query);

        // Send the response back with the sales data
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching sales items:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get profit data by time period (weekly, monthly, yearly)
router.get('/api/ARTWprofits', async (req, res) => {
    const { timeframe } = req.query;  // timeframe can be 'weekly', 'monthly', or 'yearly'

    let query = '';
    if (timeframe === 'weekly') {
        query = `
            SELECT 
                DATE_FORMAT(sale_date, '%Y-%u') AS period, 
                SUM(total_amount - cost_price) AS profit 
            FROM sales
            GROUP BY period
        `;
    } else if (timeframe === 'monthly') {
        query = `
            SELECT 
                DATE_FORMAT(sale_date, '%Y-%m') AS period, 
                SUM(total_amount - cost_price) AS profit 
            FROM sales
            GROUP BY period
        `;
    } else if (timeframe === 'yearly') {
        query = `
            SELECT 
                DATE_FORMAT(sale_date, '%Y') AS period, 
                SUM(total_amount - cost_price) AS profit 
            FROM sales
            GROUP BY period
        `;
    }

    try {
        const [results] = await db.promise().execute(query);
        res.json(results);
    } catch (err) {
        console.error('Error fetching profit data:', err);
        res.status(500).json({ error: 'Failed to fetch profit data' });
    }
});



=======
>>>>>>> 38ace3fc3421c27ef805c7d16e7da8978d871aeb
module.exports = router;
