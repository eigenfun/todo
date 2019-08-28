var MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://localhost:27017';
const MONGO_DBNAME = 'hcs'

var ObjectID = require('mongodb').ObjectID;

var client;
async function connect() { 
    if (!client) client = await MongoClient.connect(MONGO_URL, {useNewUrlParser: true});
    return client.db(MONGO_DBNAME)
}

let process_data = (data) => data

let query = async (collection_name, query={}, sort={}, processor=process_data) => {
    try {
        const db = await connect();
        const collection = db.collection(collection_name);
        const result = await collection.find( { $query: query, $orderby: sort } ).toArray();
        return processor(result);
    } catch (e) {
        console.log(e);
    }
}

let insert = async (collection_name, doc, callback=(data) => data) => {
    try {
        console.log(doc)
        const db = await connect();
        const collection = db.collection(collection_name);
        const result = await collection.insertOne(doc)
        return callback(result);
    } catch (e) {
        console.log(e);
    }
}

let update = async (collection_name, id, status) => {
    try {
        console.log(id)
        const db = await connect();
        const collection = db.collection(collection_name);
        const result = await collection.updateOne({_id: ObjectID(id)}, {$set: status});
        return result
    } catch (e) {
        console.log(e);
    }
}

let delete_doc = async (collection_name, id) => {
    try {
        console.log(id)
        const db = await connect();
        const collection = db.collection(collection_name);
        const result = await collection.deleteOne({_id: ObjectID(id)});
        return result
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    query: query,
    insert: insert,
    update: update,
    delete_doc: delete_doc
}
