const db = require("./db");

function authorize(app) {

    return async(req, res, next) => {

        console.log('Signed Cookies: ', req.signedCookies);

        let cookieData=req.signedCookies.email
        //But the user is logging in for the first time so there won't be any appropriate signed cookie for usage.
        if(!cookieData)//True for our case
        {   
            console.log("cookie missing");
            let authorizationHeader=req.headers.authorization
            if(!authorizationHeader)//No authentication info given
            {
                res.sendStatus(401);
            }else{
                step1=new Buffer.from(authorizationHeader.split(" ")[1], 'base64')
                //Extracting username:password from the encoding Authorization: Basic username:password
                step2=step1.toString().split(":")
                //Extracting the username and password in an array
                try {
                    const user = await db.pool.query('SELECT * FROM user_details WHERE email = ?',[step2[0]]);
                    if(user[0].password===step2[1]){
                        //Correct username and password given
                        console.log("WELCOME USER")
                        //Store a cookie with name=user and value=username
                        res.cookie('email', step2[0], {signed: true})
                        next();
                    }else{
                        res.sendStatus(401)
                    }
                } catch(error){
                    console.error(error);
                    //res.setHeader("WWW-Authenticate", "Basic")
                    res.sendStatus(401)
                }
            }
        }else{//Signed cookie already stored
            console.log("cookie present");
            try {
                const user = await db.pool.query('SELECT * FROM user_details WHERE email = ?',[req.signedCookies.email]);
                if(user){
                    next();
                }else{
                    res.sendStatus(401)
                }
            } catch(error){
                console.error(error);
                res.sendStatus(401)
            }
        }
    }
}

module.exports = authorize;