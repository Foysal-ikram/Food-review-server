const express = require('express') ;
const cors = require('cors') ;
const app = express() ;
const port = process.env.PORT || 5000 ;

require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json())

app.get('/' , (req,res)=>{
    
    res.send('api running') ;
    
})

app.listen(port ,()=>console.log(port))
function verifyJWT(req,res , next){
    const authHeader = req.headers.authorization ;
    if(!authHeader){
        return res.send(401).send({message : 'unauthorized '})

    }
     const token = authHeader.split(' ')[1];
    jwt.verify(token , process.env.Token , function(err , decoded){
        if(err){
            return res.status(401).send({message : 'unauthorized access'});
        }
        req.decoded = decoded ;
        next();
    })

}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.tngy8ld.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('food-review').collection('services') ;
        const reviewCollection = client.db('food-review').collection('my-review');

        app.get('/service', async(req, res) => {
            const querry = {} ;
           
            const cursor = serviceCollection.find(querry);
            //const mobiles = await cursor.limit(size).toArray() ;
            // const service = await cursor.toArray() ; 
            const service = await cursor.limit(3).toArray()         
            res.send(service)
        })
        app.get('/services', async(req, res) => {
            const querry = {} ;
            const cursor = serviceCollection.find(querry);
            //const mobiles = await cursor.limit(size).toArray() ;
            // const service = await cursor.toArray() ; 
            const service = await cursor.toArray()         
            res.send(service)
        })

        app.get('/services/:id' , async(req,res)=>{
            const id= req.params.id ;
            console.log(id)
            const querry = {_id: ObjectId(id)}
            const result = await serviceCollection.findOne(querry) ;
            res.send(result) ;
        })

        // ----------------------------Post Review--------------------------
        app.post('/review' , async (req , res)=>{
            const review = req.body ;
            const result = await reviewCollection.insertOne(review) ;
            console.log(review)
            res.send(result) 
        })
        app.post('/addservice' , async(req,res)=>{
            const service = req.body ;
            const result = await serviceCollection.insertOne(service) ;
            res.send(result) 
        })

        
        // ----------------------------------------------------------------------------
        app.get('/reviews' , async(req,res)=>{
            let query ={} ;
            console.log(req.query.name)
             if(req.query.name){
                 query = {serviceName:req.query.name}
            }
            console.log(query)
            const cursor = await reviewCollection.find(query) ;
            const result = await cursor.toArray() ;
            console.log(result)
            res.send(result) 

        })
        

    }
    finally {

    }
}
run().catch(console.dir) ;