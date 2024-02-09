const express = require("express");
const userRoute = express.Router();
const db = require("../db")

userRoute.get("/", async(req, res) => {
    try {
        const result = await db.pool.query("select * from user_details");
        res.send(result);
    } catch (err) {
        throw err;
    }	
});

userRoute.get("/:userId", async(req, res)=>{
    try {
        let userId = req.params.userId;
        const result = await db.pool.query('SELECT * FROM user_details WHERE user_id = ?',[userId]);
        res.send(result);
    } catch (err) {
        throw err;
    }	
})
/*
userRoute.get("/logout", (req,res) => {
   console.log("logout");
   res.clearCookie('email');
   res.redirect('/');
})*/

module.exports = userRoute;