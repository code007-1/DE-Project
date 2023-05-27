const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
const port = 5000;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/api', async (request, result) => {

    try {
        const query = request.query.query;
        const limit = request.query.limit;
        const collection_name = request.query.collection;

        const uri = "mongodb+srv://normaluser:OHex8SVzXsCiyyvh@clusternex.c1ok7xn.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri);
        client.startSession();

        const database = client.db('Stocks_Data');
        const collection = database.collection(collection_name);

        const data = await collection.find(query).limit(parseInt(limit)).toArray();
        result.json(data);
        client.close();
    } catch (error) {
        console.error('Error retrieving data:', error);
        result.status(500).send('Error retrieving data');
    }
});

app.get('/price', async (request, result) => {

    try {
        const query = request.query.query;//{ "symbol": "AAPL" };

        const uri = "mongodb+srv://normaluser:OHex8SVzXsCiyyvh@clusternex.c1ok7xn.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri);
        client.startSession();

        const database = client.db('Stocks_Data');
        const collection = database.collection("Real_Time_Data");

        const data = await collection.findOne(query);
        result.json(data);

        client.close();

    } catch (error) {
        console.error('Error retrieving data:', error);
        result.status(500).send('Error retrieving data');
    }
});

/*app.get('/series/information', async (request, result) => {

    try {
        const query = request.query.query; //{ "symbol": "AAPL" }
        const project = request.query.project; //{ "_id": 0, "series.eps": 1 }
        for (const [key, value] of Object.entries(project)) {
            project[key] = parseInt(value);
        }
        const type = request.query.type;

        const uri = "mongodb+srv://normaluser:OHex8SVzXsCiyyvh@clusternex.c1ok7xn.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri);
        client.startSession();

        const database = client.db('Stocks_Data');
        const collection = database.collection("Stocks_Information");

        const data = await collection.aggregate([{ "$match": query }, { "$project": project }]).toArray();
        k = data[0].series[type].map((item) => { return item });
        result.json(k);
        client.close();

    } catch (error) {
        console.error('Error retrieving data:', error);
        result.status(500).send('Error retrieving data');
    }
});*/

app.get('/basics', async (request, result) => {

    try {
        const query = request.query.query; //{ "symbol": "AAPL" }

        const uri = "mongodb+srv://normaluser:OHex8SVzXsCiyyvh@clusternex.c1ok7xn.mongodb.net/?retryWrites=true&w=majority";
        const client = new MongoClient(uri);
        client.startSession();

        const database = client.db('Stocks_Data');
        const collection = database.collection("Stocks_Information");

        const data = await collection.aggregate([{ "$match": query }, { "$project": { "_id": 0, "basics": 1 } }]).toArray();
        result.json(data[0]["basics"]);
        client.close();

    } catch (error) {
        console.error('Error retrieving data:', error);
        result.status(500).send('Error retrieving data');
    }
});


// Endpoint to retrieve data from MongoDB
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});