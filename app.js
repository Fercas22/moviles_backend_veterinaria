const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

// MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'moviles',
    password: 'Fer22nando',
    database: 'prueba'
});

// Route
app.get('/', (req, res) => {
    res.send('Welcome to my API!');
});

// All customers
app.get('/user', (req, res) => {
    const sql = 'SELECT * FROM user';

    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Not result');
        }
    });
});

app.post('/login', (req, res)=>{
    const login_JSON = {
        email : req.body.email,
        password : req.body.password
    };

    const sql = `SELECT * FROM user WHERE email = '${login_JSON.email}' and password = '${login_JSON.password}'`;

    connection.query(sql, (error, resul) =>{
        if(error) throw error;
        if (resul.length > 0 ) {
            const payload = {
                check:true
            };
            
            const token = jwt.sign(payload,'clavesecreta123',{
                expiresIn:'7d'
            });

            let lista = []
            let  resultado_token ={}
            resultado_token.iduser =  resul[0].iduser
            resultado_token.fullname =  resul[0].fullname
            resultado_token.email =  resul[0].email
            resultado_token.password =  resul[0].password
            resultado_token.token =  token    
            console.log(resultado_token)
            lista.push(resultado_token)
            res.json(lista)
            res.status(200)
        }else{
            res.json(['incorrecto'])
        }
    }); 
});

app.post('/newUser', (req, res) => {
    const sql = 'INSERT INTO user SET ?';
    const customersObj = {
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password
    };

    connection.query(sql, customersObj, error => {
        if (error) throw error;
        res.send('User created!');
    });
});

app.put('/update/:iduser', (req, res) => {
    const { iduser } = req.params;
    const { name, city, password } = req.body;
    const sql = `UPDATE user SET fullname = '${name}', email = '${city}', password = '${password}' WHERE iduser = '${iduser}'`
});

app.delete('/delete/:iduser', (req, res) => {
    const { iduser } = req.params;
    const sql = `DELETE FROM user WHERE iduser = ${iduser}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('Delete user');
    });
});

// Check connect
connection.connect(error => {
    if (error) throw error;
    console.log('Database server running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
