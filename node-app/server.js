const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json())
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Newp@ssword1",
    "database": "bankusers"
});

con.connect((err) => {
    if (err) throw (err)
    console.log("MySQL Connected");
})

app.all("/*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.post("/addUser", (req, res) => {
    let data = {
        name: req.body.fullName,
        email: req.body.email,
        pwd: req.body.password
    }
    //console.log(data);
    // Checking duplicate:
    con.query(`Select * from userInfo where email = '${data.email}' ;`, (err, result) => {
        if (result.length > 0) {
            res.status(401).json({
                "msg": "Email already taken"
            })
        } else {
            con.query(`Select * from userInfo where pwd = '${data.pwd}' ;`, (err, result1) => {
                if (result1.length > 0) {
                    console.log("password already taken");
                    res.status(401).json({
                        "msg": "Password already taken"
                    })
                }
                else {
                    let sqlInsert = "INSERT INTO userInfo SET ?"
                    con.query(sqlInsert, data, (err, result2) => {
                        if (err) throw err;
                        return res.status(200).json({
                            "msg": "Added"
                        })
                    })
                }
            })
        }
    })

})

app.post("/validateUser", (req, res) => {
    let data = {
        email: req.body.email,
        pwd: req.body.password
    }
    //console.log(data);
    let sqlFind = `SELECT * from userInfo where email = '${data.email}';`;
    con.query(sqlFind, (err, result) => {
        if (result.length > 0) {
            let sqlFind2 = `SELECT * from userInfo where email = '${data.email}' and pwd = '${data.pwd}';`;
            // check if any email has that pwd. 
            // if yes then redirect to dashboard 
            //else, alert wrong pwd.
            con.query(sqlFind2, (err, result2) => {
                if (result2.length > 0) {
                    console.log("Correct pwd");
                    res.status(200).json({
                        "msg": "Logged succesfully!!",
                        "usrname": result2[0]['name'],
                        "balance": result2[0]['balance'],
                        "accnt_num": result2[0]['account_num'],
                    })
                }
                else {
                    res.status(401).json({ "msg": "Incorrect password" })
                }
            })
        } else {
            res.status(401).json({ "msg": "Incorrect email" })
        }
    })

})

app.post("/isUser", (req, res) => {
    let data = req.body.accnt_num_ben
    console.log(data)
    let sqlSelect = `SELECT * from userInfo where account_num = ${data} ;`;
    con.query(sqlSelect, (err, result) => {
        //if (err) throw err;
        //console.log(result);
        if (result.length > 0) {
            res.status(200).json({
                "msg": "Valid Account Number!!"
            })
        }
        else {
            res.status(401).json({
                "msg": "Invalid Account Number!!"
            })
        }
    })
})

app.post("/sendMoney", (req, res) => {
    let data = {
        accnt1: req.body.accnt1,
        accnt2: req.body.accnt2,
        amt: req.body.amt
    }
    console.log(data)
    let sqlSelect = `SELECT * from userInfo where account_num = ${data.accnt1};`;
    con.query(sqlSelect, (err, result) => {
        if (err) {
            res.status(401).json({
                "msg": "Transaction Failed!!"
            })
        }
        else if (result.length > 0) {
            var bal1 = result[0]['balance'] - data.amt
            con.query(`update userInfo set balance = ${bal1} where account_num = ${data.accnt1};`, (err) => {
                if (err) {
                    res.status(401).json({
                        "msg": "Transaction Failed!!"
                    })
                }
            })
            con.query(`SELECT * from userInfo where account_num = ${data.accnt2};`, (err, resul2) => {
                var bal2 = resul2[0][`balance`] + data.amt
                con.query(`update userInfo set balance = ${bal2} where account_num = ${data.accnt2};`, (err) => {
                    if (err) {
                        res.status(401).json({
                            "msg": "Transaction Failed!!"
                        })
                    }
                })
            })


            res.status(200).json({
                "msg": `Successfully sent Rs. ${data.amt} from ${data.accnt1} to ${data.accnt2} `
            })
        }
    })


    // con.query(sqlSelect, (err, result) => {
    //     if (result.length > 0) {
    //         var newBalance = result[0]['balance'] - data.amt
    //         con.query(`update userInfo set balance = ${newBalance} account_num = ${data.accnt1};`)
    //         con.query(`SELECT * from userInfo where account_num = ${data.accnt2} ;`, (err, result2) => {

    //             con.query(`update userInfo set balance = ${newBalance + data.amt * 2} account_num = ${data.accnt1};`)
    //         })
    //         res.status(200).json({
    //             "msg": `Added Money to ${data.account_num} `
    //         })
    //     }
    //     else {
    //         res.status(401).json({
    //             "msg": "Something went wrong!!"
    //         })
    //     }
    // })
})

// app.use((req, res) => {
//     res.render('404.ejs');
// })

app.listen(3000, () => {
    console.log("Server is running on 3000");
})