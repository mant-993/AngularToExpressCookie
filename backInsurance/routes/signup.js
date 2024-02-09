const express = require('express');
const { check, validationResult } = require('express-validator')
const signupRouter = express.Router();
const db = require("../db")


signupRouter.post('/', 
[
    check('email').trim().notEmpty().withMessage('Empty form.').isEmail().withMessage('Invalid email.'),
    check('password').trim().notEmpty().withMessage('Empty form.').matches(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/).withMessage('Password not secure.'),
    check('mobileno').trim().notEmpty().withMessage('Empty form.').isNumeric().withMessage('Not numeric').isLength({ min: 12, max:12 }).withMessage('The mobile number has to be 12 digits long'),
    check('pin').trim().notEmpty().withMessage('Empty form.').isNumeric().withMessage('Not numeric').isLength({ min: 5, max:5 }).withMessage('The mobile number has to be 5 digits long')
],
async(req,res)=>{
  const result = validationResult(req);
  if (result.isEmpty()) {
    try {
        let body = req.body;
        const result = await db.pool.query("INSERT INTO user_details VALUES (NULL,?,?,?,?,DEFAULT,?,?,?,?,?,?)", [body.firstname, body.lastname, body.email, body.password, body.mobileno, body.dob, body.city, body.addressline1, body.state, body.pin]);
        res.sendStatus(201);   
    } catch (error) {
        res.status(405).send(error);
    }
  }else{
    res.status(405).send({ errors: result.array() });
  }
})

module.exports = signupRouter;