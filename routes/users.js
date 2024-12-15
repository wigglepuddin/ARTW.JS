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

//register
router.post('/api/ARTWregister', async (req, res) => {

    try {

        const { name, username, password, role_id, status } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery = 'INSERT INTO users (name, username, password, role_id, status) VALUES (?,?,?,?,?)';
        await db.promise().execute(insertUserQuery, [name, username, hashedPassword, role_id, status]);

        res.status(201).json({ message: "Registered" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal error' });
    }
});


//login
router.post('/api/ARTWlogin', async (req,res) => {
    try{
        const {username,password} = req.body;

        const getUserQuery = 'SELECT * FROM users WHERE username = ?';
        const [rows] = await db.promise().execute(getUserQuery, [username]);
        
        if (rows.length === 0) {
            return res.status(401).json({error: 'Invalid username or password'});
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({error:'nvalid username or password'});
        }

        const token = jwt.sign({userId: user.id, username: user.username}, secretKey, {expiresIn: '1h'});
        
        res.status(200).json({token});
    } catch (error) {
        console.error('Error login', error);
        res.status(500).json({error:'Internal error '});
    }

});

//get user 
router.get('/api/ARTWusers',authenticateToken, (req, res) => {

    try {

        db.query('SELECT id, name, username, role_id FROM users', (err, result) =>{
            
            if(err){
                console.error('Error fetching items:', err);
                res.status(500).json({message:'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error){
        
        console.error('Error loading users:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    } 
});

//get user id
router.get('/api/ARTWuser/:id', authenticateToken,  async (req, res) => {

    let user_id = req.params.id;
    if (!user_id){
        return res.status(400).send({errpr: true, message: 'Please provide a user_id'});
    }

    try {
        db.query('SELECT id, name, username, role_id FROM users WHERE id = ?', user_id, (err, result) => {
            
            if (err){
                console.error('Dae ko makua ang mga items par:', err);
                res.status(500).json({message: 'Internal Server ang Error'});
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Nag eerror mag load ang users:', error);
        res.status(500).json({ error: 'Internal Server ang Error'});
    }
});

// Update user
router.put('/api/ARTWuser/:id', authenticateToken, async (req, res) => {
    let user_id = req.params.id;
    const { name, username, password, role_id } = req.body;
    
    if (!user_id || !name || !username || !role_id) {
        return res.status(400).send({ error: 'User data missing', message: 'Please provide name, username, and role_id' });
    }

    try {
        let sqlQuery;
        let params;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            sqlQuery = 'UPDATE users SET name = ?, username = ?, password = ?, role_id = ? WHERE id = ?';
            params = [name, username, hashedPassword, role_id, user_id];
        } else {
            sqlQuery = 'UPDATE users SET name = ?, username = ?, role_id = ? WHERE id = ?';
            params = [name, username, role_id, user_id];
        }
        db.query(sqlQuery, params, (err, result, fields) => {
            if (err) {
                console.error('Error updating user:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).json({ message: 'User updated successfully' });
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// Disable or enable user
router.put('/api/ARTWuser/disable/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Check if the user exists
        const [user] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);

        if (!user.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the current status of the user
        const currentStatus = user[0].status;

        // Toggle the status of the user
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

        // Update the user status in the database
        await db.promise().query('UPDATE users SET status = ? WHERE id = ?', [newStatus, userId]);

        // Send response with updated status message
        res.status(200).json({ message: `User ${currentStatus === 'active' ? 'disabled' : 'enabled'} successfully` });
    } catch (error) {
        console.error('Error toggling user status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Reset password
router.put('/api/ARTWresetPassword/:id', async (req, res) => {
    const userId = req.params.id;
    const { newPassword } = req.body;

    try {
        // Check if the user exists
        const [user] = await db.promise().query('SELECT * FROM users WHERE id = ?', [userId]);

        if (!user.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        await db.promise().query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        // Send response with success message
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





module.exports = router;