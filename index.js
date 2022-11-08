const express = require('express') ;
const cors = require('cors') ;
const jwt = require('jsonwebtoken') ;

require('dotenv').config() ;
const app = express() ;
const port = process.env.PORT || 5000 ;
app.use(cors()) ;
app.use(express.json()) 

app.get('/' , (req,res)=>{
    res.send('Food api running') 
})

function verifyJWT(req,res,next){
    const authHeader = req.headers.authorization ;
    if(!authHeader){
        return res.status(401).send({message : 'Wrong authorization'})

    }
    const token= authHeader.split(' ')[1] ;
    jwt.verify(token, process.env.Token, function(err , decoded){
        if(err){
            return res.status(401).send({message : 'Wrong authorization'})
        }
        req.decoded = decoded ;
        next();
    })
    
}


