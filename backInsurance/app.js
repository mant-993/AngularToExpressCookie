const express = require("express");
const db = require('./db');
var cors = require('cors')
const session = require('express-session');
const policyRoute = require("./routes/policies");
const userRoute = require("./routes/users");
const signupRoute = require("./routes/signup");
let cookie_parser=require("cookie-parser")



const app = express();

app.use(cookie_parser('s3cr3tK3y'))
app.use(express.json());

const corsConfig = {
    credentials: true,
    origin: "http://localhost:4200",
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};
app.use(cors(corsConfig));

const authorize = require("./authorize")(app)

app.get("/", (req, res) => {
    res.sendStatus(200);
})


app.use('/signup', signupRoute);
app.use(authorize);     // authorize middleware in between free routes and protected routes
app.use('/policies', policyRoute);
app.use('/users', userRoute);



app.get("/signin", (req,res) => {
    res.sendStatus(200);
})


app.listen(3000, () => console.log('Server ready'))