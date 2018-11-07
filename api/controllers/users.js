const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


//log user in
exports.user_login = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user =>{
        if(user.length > 1){
            return res.status(402).json({
                message: 'Auth failed'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if(err){
                return res.status(402).json({
                    message: 'Auth failed'
                })
            }
            if(result){
                const token = jwt.sign(
                    {email: user[0].email, userId: user[0]._id },
                    "secret",
                    { expiresIn: "1h"}
                );

                return res.status(200).json({
                    message: 'Auth Successful',
                    userId: user[0]._id,
                    token: token
                })
            }
            return res.status(402).json({
                message: 'Auth failed 2'
            })
        })
    })
    .catch(err =>{
        console.log(err)
        res.status(402).json({
            error: err,
            message: 'Email or Password INVALID',
        })
    })
}


//register user
exports.user_signup = (req, res, next)=>{
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                res.status(401).json({
                    message: 'Email already exist'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            phone: '+234'+req.body.phone,
                            username: req.body.username
                        });
                        user.save()
                            .then(result => {
                                res.status(200).json({
                                    message: 'User created',
                                    details: result
                                })
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

//get all user
exports.users_get_all =  (req, res, next)=>{
    User.find()
    .exec()
    .then(docs =>{
        res.status(200).json(docs);
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