const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

// USERS ARE IN MEMORY FOR NOW, WILL MOVE TO THE DB
let users = [];
let groups = {};

// SAME RESTAURANTS THE VOTE PAGE HAD HARD CODED
const restaurants = [
    { name: "Cubby's", price: '$$$', cuisine: 'american', distance: '0.4 mi', address: '1496 n university ave', image: '/images/cubbys.jpg' },
    { name: 'Tucanos', price: '$$$', cuisine: 'brazilian', distance: '1.2 mi', address: '4801 n university ave', image: '/images/tucanos.jpg' },
    { name: 'Black Sheep Cafe', price: '$$', cuisine: 'southwest', distance: '0.8 mi', address: '19 n university ave', image: '/images/logo.png' },
    { name: 'India Palace', price: '$$', cuisine: 'indian', distance: '0.6 mi', address: '98 w center st', image: '/images/logo.png' },
    { name: 'Station 22', price: '$$', cuisine: 'american', distance: '0.7 mi', address: '22 w center st', image: '/images/logo.png' },
];

// HAS TO BE PORT 4000 FOR THE STARTUP
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(cookieParser());

// SERVES THE REACT BUILD
app.use(express.static('public'));

const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// JUST TO CHECK THE SERVICE IS UP
apiRouter.get('/health', (_req, res) => {
    res.send({ status: 'ok' });
});

// REGISTER
apiRouter.post('/auth/create', async (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({ msg: 'Missing email or password' });
    } else if (await findUser('email', req.body.email)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await createUser(req.body.email, req.body.password);

        setAuthCookie(res, user.token);
        res.send({ email: user.email });
    }
});

// LOGIN
apiRouter.put('/auth/login', async (req, res) => {
    const user = await findUser('email', req.body.email);
    if (user && (await bcrypt.compare(req.body.password, user.password))) {
        user.token = uuid.v4();
        setAuthCookie(res, user.token);
        res.send({ email: user.email });
        return;
    }
    res.status(401).send({ msg: 'Unauthorized' });
});

// LOGOUT
apiRouter.delete('/auth/logout', async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        delete user.token;
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
});

// BLOCKS ANYONE WITHOUT A VALID TOKEN
const verifyAuth = async (req, res, next) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        req.user = user;
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};

// NEEDS YOU TO BE LOGGED IN
apiRouter.get('/user/me', verifyAuth, (req, res) => {
    res.send({ email: req.user.email });
});

// START A GROUP, YOU ARE THE HOST
apiRouter.post('/group', verifyAuth, (req, res) => {
    const group = {
        code: makeCode(),
        host: req.user.email,
        members: [req.user.email],
        location: '',
        started: false,
        votes: {},
    };
    groups[group.code] = group;
    res.send(group);
});

// JOIN A GROUP WITH THE CODE
apiRouter.post('/group/:code/join', verifyAuth, (req, res) => {
    const group = groups[req.params.code];
    if (!group) {
        res.status(404).send({ msg: 'No group with that code' });
    } else if (group.started) {
        res.status(409).send({ msg: 'That group already started voting' });
    } else {
        if (!group.members.includes(req.user.email)) {
            group.members.push(req.user.email);
        }
        res.send(group);
    }
});

// THE WAITING PAGE CHECKS THIS FOR WHO JOINED
apiRouter.get('/group/:code', verifyAuth, (req, res) => {
    const group = groups[req.params.code];
    if (group) {
        res.send(group);
    } else {
        res.status(404).send({ msg: 'No group with that code' });
    }
});

// ONLY THE HOST CAN START THE VOTING
apiRouter.put('/group/:code/start', verifyAuth, (req, res) => {
    const group = groups[req.params.code];
    if (!group) {
        res.status(404).send({ msg: 'No group with that code' });
    } else if (group.host !== req.user.email) {
        res.status(403).send({ msg: 'Only the host can start' });
    } else if (!req.body.location) {
        res.status(400).send({ msg: 'Missing location' });
    } else {
        group.location = req.body.location;
        group.started = true;
        res.send(group);
    }
});

// EVERYONE IN THE GROUP GETS THE SAME LIST
apiRouter.get('/group/:code/restaurants', verifyAuth, (req, res) => {
    if (groups[req.params.code]) {
        res.send(restaurants);
    } else {
        res.status(404).send({ msg: 'No group with that code' });
    }
});

// SAVES THE NAMES YOU SAID YES TO
apiRouter.post('/group/:code/vote', verifyAuth, (req, res) => {
    const group = groups[req.params.code];
    if (!group) {
        res.status(404).send({ msg: 'No group with that code' });
    } else if (!group.members.includes(req.user.email)) {
        res.status(403).send({ msg: 'You are not in this group' });
    } else {
        group.votes[req.user.email] = req.body.votes || [];
        res.send({ voted: Object.keys(group.votes).length, playerCount: group.members.length });
    }
});

// ADDS UP EVERYONES YES VOTES, MOST VOTES FIRST
apiRouter.get('/group/:code/results', verifyAuth, (req, res) => {
    const group = groups[req.params.code];
    if (!group) {
        res.status(404).send({ msg: 'No group with that code' });
        return;
    }

    const allVotes = Object.values(group.votes);
    const totals = restaurants.map((restaurant) => {
        const votes = allVotes.filter((yesList) => yesList.includes(restaurant.name)).length;
        return { ...restaurant, votes: votes };
    });
    totals.sort((a, b) => b.votes - a.votes);

    res.send({ totals: totals, voted: allVotes.length, playerCount: group.members.length });
});

app.use(function (err, req, res, next) {
    res.status(500).send({ type: err.name, message: err.message });
});

// ANY OTHER PATH GETS THE REACT APP SO THE ROUTER WORKS
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

async function createUser(email, password) {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        email: email,
        password: passwordHash,
        token: uuid.v4(),
    };
    users.push(user);

    return user;
}

async function findUser(field, value) {
    if (!value) return null;

    return users.find((u) => u[field] === value);
}

// NO I OR O SO PEOPLE DONT MIX THEM UP WITH 1 AND 0
function makeCode() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    do {
        code = '';
        for (let i = 0; i < 4; i++) {
            code += letters[Math.floor(Math.random() * letters.length)];
        }
    } while (groups[code]);
    return code;
}

// HTTPONLY SO JAVASCRIPT CANT READ THE TOKEN
function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
