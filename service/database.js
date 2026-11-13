const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

// PASSWORD COMES FROM DBCONFIG.JSON SO IT NEVER GOES ON GITHUB
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('biteclub');
const userCollection = db.collection('user');

// CHECKS THE CONNECTION WHEN THE SERVICE STARTS
(async function testConnection() {
    try {
        await db.command({ ping: 1 });
        console.log('Connected to the database');
    } catch (ex) {
        console.log(`Unable to connect to the database because ${ex.message}`);
        process.exit(1);
    }
})();

function getUser(email) {
    return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
    return userCollection.findOne({ token: token });
}

async function addUser(user) {
    await userCollection.insertOne(user);
}

async function updateUser(user) {
    await userCollection.updateOne({ email: user.email }, { $set: user });
}

module.exports = {
    getUser,
    getUserByToken,
    addUser,
    updateUser,
};
