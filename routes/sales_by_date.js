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


// Route to create or update sales by date
router.post('/api/ARTWaddsales_by_date', async (req, res) => {
    const { sale_date, total_quantity_sold, total_amount } = req.body;

    try {
        // Check if a record for the sale_date already exists
        let record = await SalesByDate.findOne({ where: { sale_date } });

        if (record) {
            // Update the existing record
            record.total_quantity_sold += total_quantity_sold;
            record.total_amount += total_amount;
            await record.save();
            return res.status(200).json({ message: 'Sales record updated.', record });
        } else {
            // Create a new record
            record = await SalesByDate.create({ sale_date, total_quantity_sold, total_amount });
            return res.status(201).json({ message: 'Sales record created.', record });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving sales record.' });
    }
});

// Route to get sales by date
router.get('/api/ARTWsales_by_date/:date', async (req, res) => {
    const { date } = req.params;

    try {
        const records = await SalesByDate.findAll({ where: { sale_date: date } });
        res.status(200).json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching sales records.' });
    }
});

module.exports = router;