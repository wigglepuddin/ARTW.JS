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
router.post('/api/ARTWregister', async (req,res) =>{

    try {

        const {name, username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUserQuery = 'INSERT INTO users (name, username, password, role_id) VALUES (?,?,?,?)';
        await db.promise().execute(insertUserQuery, [name, username, hashedPassword, role_id]);

        res.status(201).json({message: "Registered"});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'Internal error'});
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

        db.query('SELECT id, name, username FROM users', (err, result) =>{
            
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
        db.query('SELECT id, name, username FROM users WHERE id = ?', user_id, (err, result) => {
            
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

//update user
router.put('/api/ARTWuser/:id', authenticateToken, async (req, res) => {

    let user_id = req.params.id;

    const { name, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user_id || !name || !username || !password) {
        return res.status(400).send({ error: user, message: 'Please provide name, username, and password' });
    }

    try {
        db.query('UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?', [name, username, hashedPassword, user_id], (err, result, fields) => {
            if (err) {
                console.error('Error updating item:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading user:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

//delete user
router.delete('/api/ARTWuser/:id',authenticateToken, async (req, res) => {

    let user_id = req.params.id;

    if (!user_id) {
        return res.status(400).send({ error: true, message: 'provide  user_id'});
    }

    try{
        db.query('DELETE FROM users WHERE id = ?', user_id, (err, result, fields) => {

            if(err) {
                console.error('Error delete items:', err);
                res.status(500).json({ message: 'Internal Server ang Error Boi'});
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error mag loading ang users:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
});


module.exports = router;
