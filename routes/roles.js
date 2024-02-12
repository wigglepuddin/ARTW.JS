const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors());

const secretKey = 'rex-secret-key';

const db = require ('/database');
const {authenticateToken} = require ('../authentication/authenticate');

//register roles
router.post('/api/roles', async (req, res) => {
    try {
      const { role_code, role_name } = req.body;
  
      const existingRole = await db.promise().execute('SELECT * FROM roles WHERE role_code = ?', [role_code]);
  
      if (existingRole[0].length > 0) {
        return res.status(400).json({ error: 'Role code already taken' });
      }

      const insertRoleQuery = 'INSERT INTO roles (role_code, role_name) VALUES (?, ?)';
      await db.promise().execute(insertRoleQuery, [role_code, role_name]);
  
      res.status(201).json({ message: 'Role registered successfully' });
    } catch (error) {
     
        console.error('Error registering role:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//GET USERS
  router.get('/api/roles',authenticateToken, (req, res) => {

    try {

        db.query('SELECT role_id, role_code, role_name FROM roles', (err, result) =>{
            
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

//user id
router.get('/api/role/:id',authenticateToken, async (req, res) => {

    let role_id = req.params.id;

    if (!role_id) {
        return res.status(408).send({ error: true, message: 'Please provide role_id' });
    }

    try {

        db.query('SELECT role_id, role_code, role_name FROM roles WHERE role_id = ?', role_id, (err, result) => {

            if (err) {
                console.error('Error fetching items:, err');
                res.status(500).json({ message: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });

    } catch (error) {

        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  //UPDATE
router.put('/api/role/:id',authenticateToken, async (req, res) => {
    let role_id = req.params.id;

    const { role_code, role_name } = req.body;

    if (!role_id || !role_code || !role_name) {
        return res.status(400).send({ error: user, message: 'Please provide role_code and role_name' });
    }

    try {
        db.query('UPDATE roles SET role_code = ?, role_name = ? WHERE role_id = ?', [role_code, role_name, role_id], (err, result, fields) => {
            if (err) {
                console.error('Error updating item:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//DELETE
router.delete('/api/role/:id',authenticateToken, async (req, res) => {

    let role_id = req.params.id;

    if (!role_id) {
        return res.status(400).send({ error: true, message: 'provide  role_id'});
    }

    try{
        db.query('DELETE FROM roles WHERE role_id = ?', role_id, (err, result, fields) => {

            if(err) {
                console.error('Error deleting items:', err);
                res.status(500).json({ message: 'Internal Server Error'});
            } else {
                res.status(200).json(result);
            }
        });
    } catch (error) {
        console.error('Error loading users:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
});


  module.exports = router;
