const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId


app.use(cors())
app.use(bodyParser.json())

var jsonParser = bodyParser.json()

//var urlencodedParser = bodyParser.urlencoded({ extended: false })

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.goub9.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const blogConnection = client.db("retro-tech").collection("blog");

    //Blog Add API
    app.post('/addBlog', (req, res) => {
        const newBlog = req.body
        console.log(req.body)
        blogConnection.insertOne(req.body)
            .then(result => {
                console.log('Data Inserted', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    //Show Blogs
    app.get('/blogs', (req, res) => {
        blogConnection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    //singleBlog
    app.get('/singleBlog/:id', (req, res) => {
        blogConnection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, document) => {
                res.send(document)
            })
    })

    //delete blog
    app.delete('/delete/:id', (req, res) => {
        blogConnection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log('Blog Deleted')
                res.send(result.deletedCount > 0)
            })
    });

});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server Running`)
})