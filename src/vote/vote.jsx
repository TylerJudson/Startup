import React from 'react';
import { useNavigate } from 'react-router-dom';

// This will be replaced with a call to a third party restaurant API
function getRestaurants() {
    return [
        { name: "Cubby's", price: '$$$', cuisine: 'american', distance: '0.4 mi', address: '1496 n university ave', image: '/images/cubbys.jpg' },
        { name: 'Tucanos', price: '$$$', cuisine: 'brazilian', distance: '1.2 mi', address: '4801 n university ave', image: '/images/tucanos.jpg' },
        { name: 'Black Sheep Cafe', price: '$$', cuisine: 'southwest', distance: '0.8 mi', address: '19 n university ave', image: '/images/logo.png' },
        { name: 'India Palace', price: '$$', cuisine: 'indian', distance: '0.6 mi', address: '98 w center st', image: '/images/logo.png' },
        { name: 'Station 22', price: '$$', cuisine: 'american', distance: '0.7 mi', address: '22 w center st', image: '/images/logo.png' },
    ];
}

function getFriends() {
    const players = JSON.parse(localStorage.getItem('players') || '["You", "Kate", "Conner", "Lily"]');
    return players
        .filter((name) => name !== 'You')
        .map((name) => ({ name: name, progress: 0 }));
}

export function Vote() {
    const [restaurants] = React.useState(getRestaurants());
    const [index, setIndex] = React.useState(0);
    const [yesVotes, setYesVotes] = React.useState([]);
    const [finished, setFinished] = React.useState(false);
    const [friends, setFriends] = React.useState(getFriends());
    const navigate = useNavigate();

    const restaurant = restaurants[index];

    // This will be replaced with WebSocket messages from the other people voting
    React.useEffect(() => {
        const timer = setInterval(() => {
            setFriends((current) => {
                const updated = current.map((friend) => ({ ...friend }));
                const notDone = updated.filter((friend) => friend.progress < restaurants.length);
                if (notDone.length > 0) {
                    const pick = notDone[Math.floor(Math.random() * notDone.length)];
                    pick.progress++;
                }
                return updated;
            });
        }, 1500);

        return () => clearInterval(timer);
    }, []);

    // When everyone is done every screen jumps to the results
    React.useEffect(() => {
        const everyoneDone = friends.every((friend) => friend.progress >= restaurants.length);
        if (finished && everyoneDone) {
            navigate('/results');
        }
    }, [finished, friends]);

    function vote(yes) {
        let votes = yesVotes;
        if (yes) {
            votes = [...yesVotes, restaurant.name];
            setYesVotes(votes);
        }

        if (index + 1 < restaurants.length) {
            setIndex(index + 1);
        } else {
            localStorage.setItem('myVotes', JSON.stringify(votes));
            setFinished(true);
        }
    }

    return (
        <main className="vote">
            {finished ? (
                <h3>You're done! Waiting for everyone else to finish...</h3>
            ) : (
                <>
                    <div>
                        <h3>Restaurant {index + 1} of {restaurants.length}</h3>
                    </div>

                    <div className="card">
                        <img className="card-img-top" src={restaurant.image} alt={restaurant.name} />

                        <div className="card-body">
                            <h3>{restaurant.name}</h3>
                            <span>{restaurant.price}</span>
                            <span>{restaurant.cuisine}</span>
                            <span>{restaurant.distance}</span>
                            <span>{restaurant.address}</span>
                        </div>
                    </div>

                    <div className="vote-buttons">
                        <button className="btn btn-danger" onClick={() => vote(false)}>NO</button>
                        <button className="btn btn-success" onClick={() => vote(true)}>YES</button>
                    </div>
                </>
            )}

            <div className="status">
                {friends.map((friend) => (
                    <span key={friend.name}>
                        <b>{friend.name}: </b>
                        {friend.progress >= restaurants.length ? 'Done' : friend.progress + '/' + restaurants.length}
                    </span>
                ))}
            </div>
        </main>
    );
}
