const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors')


const app = express()
const port = process.env.DB_HOST || 5000

// Middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywuva.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        // console.log('connected')
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET API for Single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log("getting",id)
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query);
            console.log('Update', service);
            res.json(service)
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log("Hit the Post APi", service)
            const result = await servicesCollection.insertOne(service);
            console.log(result)
            res.json(result)
        })

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query);
            console.log('Deleting', result)
            res.json(result)

        })



    } finally {
        // await client.close();
    }

}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Running My CRUD Server')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})