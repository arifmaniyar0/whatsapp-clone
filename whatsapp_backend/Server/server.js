require('dotenv').config()
const express = require('express');
const {login} = require('../auth/login')
const {verify} = require('../middleware/verify')
const cors = require('cors');
const cookieParser = require('cookie-parser')

const fileupload = require('express-fileupload');


const app = express();

const route = require('../Route/route');

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileupload());


const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.json('welcome to node server');
})

app.post('/login', login)

app.use('/api', verify, route)


app.get('/home', (req, res) => {
    res.json({status : true, token : req.cookies.userToken})
})

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})

