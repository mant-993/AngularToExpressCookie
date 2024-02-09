const express = require('express');
const policyRouter = express.Router();
const db = require("../db")

policyRouter.get('/', async(req,res)=>{
    try {
        const result = await db.pool.query("SELECT policy_type_id, policy_type_name, description, yearsofpayements, amount, fine, maturityperiod, maturityamount, validity FROM policy_sub_types LEFT JOIN policy_types on policy_types.policy_type_code = policy_sub_types.policy_type_code");
        res.send(result);
    } catch (err) {
        throw err;
    }	
})



policyRouter.get('/user/:userId', async(req,res)=>{
    try {
        let userId = req.params.userId;
        const result = await db.pool.query("select * from user_policies where user_id = ?", [userId]);
        res.send(result);
    } catch (err) {
        throw err;
    }	
})

policyRouter.get('/mypolicies', async(req,res)=>{
    try {
        const user = await db.pool.query('SELECT user_id FROM user_details WHERE email = ?',[req.signedCookies.email]);
        let userId = user[0]['user_id']
        const result = await db.pool.query(
            `SELECT policy_no,date_registered,description,policy_type_name,status FROM user_policies up 
            LEFT JOIN policy_sub_types pst ON pst.policy_type_id=up.Policy_type_id 
            LEFT JOIN policy_types pt ON pt.policy_type_code=pst.Policy_type_code 
            WHERE user_id = ?`, [userId]);
        res.send(result);
    } catch (err) {
        throw err;
    }	
})

policyRouter.post("/mypolicies", async(req,res) => {

    try {
        let body = req.body;
        console.log(body);
        const user = await db.pool.query('SELECT user_id FROM user_details WHERE email = ?',[req.signedCookies.email]);
        let userId = user[0]['user_id']
        const id = await db.pool.query(`INSERT INTO user_policies VALUES(NULL,?,NULL,?,DEFAULT) RETURNING policy_no;`, [userId, body.policy_type_id]);
        await db.pool.query(`INSERT INTO policy_payments VALUES(NULL,?,?,NULL,?,?,DEFAULT);`, [userId, id[0]['policy_no'], body.amount, body.fine]);
        res.sendStatus(201);
    } catch (err) {
        res.status(405).send(err);
    }	
})

policyRouter.post("/mypolicies/:policyNo", async(req,res) =>{
    try{
        let policyNo = req.params.policyNo;
        let body = req.body;
        console.log(body);
        await db.pool.query(`UPDATE policy_payments SET dateofpayment=?, status='paid' WHERE policy_no=?;`,[body.dateofpayment, policyNo]);
        await db.pool.query(`UPDATE user_policies SET date_registered=?, status='active' WHERE policy_no=?;`,[body.dateofpayment, policyNo]);
        res.sendStatus(200);
    }catch (err) {
        throw err;
    }	
})

// for some reason delete is blocked by cors
policyRouter.get("/mypolicies/:policyNo", async(req,res) => {  
    try {
        const policyNo = req.params.policyNo;
        await db.pool.query(`DELETE FROM user_policies WHERE policy_no = ?`, [policyNo]);
        await db.pool.query(`DELETE FROM policy_payments WHERE policy_no = ? AND status = 'unpaid'`, [policyNo]);
        res.sendStatus(204);
    } catch (err) {
        throw err;
    }	
})

policyRouter.get('/mypayments', async(req,res)=>{
    try {
        const user = await db.pool.query('SELECT user_id FROM user_details WHERE email = ?',[req.signedCookies.email]);
        let userId = user[0]['user_id']
        const result = await db.pool.query(
            `SELECT receipno,policy_no,dateofpayment,amount,fine,status FROM policy_payments WHERE user_id = ?`, [userId]);
        res.send(result);
    } catch (err) {
        throw err;
    }	
})

module.exports = policyRouter;