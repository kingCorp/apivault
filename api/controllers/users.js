const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const sendMail = require('./sendEmail');
const sendSms = require('./sendSMS');


//log user in
exports.user_login = (req, res, next) => {
    User.find({phone: req.body.phone.indexOf('0') === 0 ? '+234'+req.body.phone.substr(1) : '+234'+req.body.phone
})
    .exec()
    .then(user =>{
        if(user.length > 1){
            return res.status(402).json({
                message: 'Authentication failed'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if(err){
                return res.status(402).json({
                    message: 'Authentication failed',
                    error: err
                })
            }
            if(result){
                const token = jwt.sign(
                    {email: user[0].email, userId: user[0]._id },
                    "secret",
                    { expiresIn: "1h"}
                );

                return res.status(200).json({
                    message: 'Authentication Successful',
                    userId: user[0]._id,
                    token: token,
                    username: user[0].username
                })
            }
            return res.status(402).json({
                message: 'Authentication failed'
            })
        })
    })
    .catch(err =>{
        console.log(err)
        res.status(402).json({
            error: err,
            message: 'Phone or Password INVALID',
        })
    })
}


//register user
exports.user_signup = (req, res, next)=>{
    User.find({ phone: req.body.phone.indexOf('0') === 0 ? '+234'+req.body.phone.substr(1) : '+234'+req.body.phone })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(401).json({
                    message: 'Phone number already exist'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {

                        var smsCode = Math.floor(1000 + Math.random() * 9000);
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            username: req.body.username,
                            phone: req.body.phone.indexOf('0') === 0 ? '+234'+req.body.phone.substr(1) : '+234'+req.body.phone,
                            sms: smsCode
                        });
                        
                        user.save()
                            .then(result => {
                                const token = jwt.sign(
                                    {email: result.email, userId: result._id },
                                    "secret",
                                    { expiresIn: "1h"}
                                );
                                res.status(200).json({
                                    message: 'User created, Email has been sent to you',
                                    details: result,
                                    token: token,
                                    userId: result._id,
                                    username: result.username,
                                    smsCode: result.sms
                                })
                                const html = "<h1>Your files are easy to access anywhere</h1>"+
                                            "<p>and secure as FUCK</p>"+
                                            "<p>"+result.username+"</p>"+
                                            "<p>"+result.email+"</p>"+
                                            "<p>"+result.phone+"</p>"+
                                            "<p>"+result.password+"</p>"+
                                            "<p>"+result.sms+"</p>"
                                sendMail(result.email, "WELCOME to Vault APP...",html)
                                //sendSms(result.phone,'your vault sms code is '+result.sms+'\n');
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(500).json({ error: err, message: 'Could not save' });
                            });
                    }
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err });
        });
}

exports.verifyPhone = (req, res, next) => {
    User.find({phone: req.body.phone})
    .exec()
    .then(user => {
        if(user.length > 1){
            return res.status(404).json({
                message: 'Verification failed'
            })
        }
        //res.status(200).json(user)
        if(user[0].sms == req.body.sms){
            return res.status(200).json({
                message: 'Verification Success',
                phone: user[0].phone,
                smsCode: user[0].sms
            })
        }
        return res.status(402).json({
            message: 'Verification failed'
        })

    })
    .catch(err =>{
        return res.status(404).json(err)
    })
}

//get all user
exports.users_get_all =  (req, res, next)=>{
    User.find()
    .exec()
    .then(docs =>{
        res.status(200).json({
            count: docs.length,
            Users: docs
        });
    })
    .catch(err=>{
        res.status(409).json(err)
    })
}


//delete user
exports.user_delete = (req, res, next)=> {
    const id = req.params.userId;
    User.remove({_id: id})
    .exec()
    .then(result =>{
        res.status(200).json({
            messgae: 'User deleted',
            details: result
        })
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ error: err });
    });
}