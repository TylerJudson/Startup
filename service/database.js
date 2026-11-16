const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

// PASSWORD COMES FROM DBCONFIG.JSON SO IT NEVER GOES ON GITHUB
const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('biteclub');
const userCollection = db.collection('user');
const groupCollection = db.collection('group');
// VOTES GET THEIR OWN COLLECTION SO TWO PEOPLE VOTING AT ONCE DONT OVERWRITE EACH OTHER
const voteCollection = db.collection('vote');
const restaurantCollection = db.collection('restaurant');

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

async function addGroup(group) {
    await groupCollection.insertOne(group);
}

function getGroup(code) {
    return groupCollection.findOne({ code: code });
}

// $ADDTOSET ONLY ADDS THEM IF THEYRE NOT ALREADY IN THE LIST
async function addMember(code, email) {
    await groupCollection.updateOne({ code: code }, { $addToSet: { members: email } });
}

async function startGroup(code, location) {
    await groupCollection.updateOne({ code: code }, { $set: { location: location, started: true } });
}

// UPSERT MAKES A NEW VOTE OR REPLACES YOUR OLD ONE
async function saveVote(code, email, yesVotes) {
    await voteCollection.replaceOne({ code: code, email: email }, { code: code, email: email, yesVotes: yesVotes }, { upsert: true });
}

function getVotes(code) {
    return voteCollection.find({ code: code }).toArray();
}

// ONLY ADDS THEM IF THE COLLECTION IS EMPTY SO RESTARTING DOESNT MAKE DOUBLES
async function seedRestaurants(restaurants) {
    if ((await restaurantCollection.countDocuments()) === 0) {
        await restaurantCollection.insertMany(restaurants);
    }
}

// LEAVES OUT _ID SINCE THE FRONTEND DOESNT NEED IT
function getRestaurants() {
    return restaurantCollection.find({}, { projection: { _id: 0 } }).toArray();
}

module.exports = {
    getUser,
    getUserByToken,
    addUser,
    updateUser,
    addGroup,
    getGroup,
    addMember,
    startGroup,
    saveVote,
    getVotes,
    seedRestaurants,
    getRestaurants,
};
