const jwt = require('jsonwebtoken')
const con = require('../Database/database')
const Joi = require('joi');


exports.login = function (req, res) {
    try {
        const payload = req.body;
        var schema = Joi.object().keys({
            Email : Joi.string().required().email(),
            Password : Joi.string().required()
        });
      var {error} = schema.validate(payload);
      if(error) return res.status(200).json({status:400, message:error.details[0].message})
    
      con.query(`Select * from users where Email = '${payload.Email}'`, (err, rows, fields) => {

		if(err) return res.status(200).json({status:400, message:err.message })
        if(rows.length !== 1) return res.status(200).json({status:400, message:'user not exist' })
        if(rows[0].Password !== payload.Password) return res.status(200).json({status:400, message:'Invalid Credential' })
        const token = jwt.sign({
            data: payload.Email
        }, process.env.SECRET_KEY, { expiresIn: 86400 });

        // res.cookie('mytoken', token, {maxAge:86400, httpOnly: true})
        
        res.status(200).json({status:200, token:token, user:payload.Email, expires_in:86400}) 
        return;   
      })
        
      
    }
    catch(err) {
        console.log(err);
        res.send(err.message)
    }
    
}

