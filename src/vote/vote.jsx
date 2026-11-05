import React from 'react';
import { useNavigate } from 'react-router-dom';

function getFriends() {
    const players = JSON.parse(localStorage.getItem('players') || '["You", "Kate", "Conner", "Lily"]');
    return players
        .filter((name) => name !== 'You')
        .map((name) => ({ name: name, progress: 0 }));
}

export function Vote() {
    const groupCode = localStorage.getItem('groupCode');
    const [restaurants, setRestaurants] = React.useState([]);
    const [index, setIndex] = React.useState(0);
    const [yesVotes, setYesVotes] = React.useState([]);
    const [finished, setFinished] = React.useState(false);
    const [allVoted, setAllVoted] = React.useState(false);
    const [friends, setFriends] = React.useState(getFriends());
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    const restaurant = restaurants[index];

    // GETS THE RESTAURANT LIST FROM THE SERVICE
    React.useEffect(() => {
        fetch(`/api/group/${groupCode}/restaurants`)
            .then((response) => response.json())
            .then((list) => {
                if (Array.isArray(list)) {
                    setRestaurants(list);
                } else {
                    setError(list.msg);
                }
            });
    }, []);

    // FAKE FRIEND PROGRESS UNTIL THE WEBSOCKET
    React.useEffect(() => {
        if (restaurants.length === 0) return;

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
    }, [restaurants]);

    // AFTER YOU VOTE, ASK THE SERVICE IF EVERYONE ELSE HAS TOO
    React.useEffect(() => {
        if (!finished) return;

        async function checkVotes() {
            const response = await fetch(`/api/group/${groupCode}/results`);
            const results = await response.json();
            if (results.voted >= results.playerCount) {
                setAllVoted(true);
            }
        }

        checkVotes();
        const timer = setInterval(checkVotes, 2000);
        return () => clearInterval(timer);
    }, [finished]);

    // EVERYONE IS DONE SO EVERY SCREEN GOES TO THE RESULTS
    React.useEffect(() => {
        const everyoneDone = friends.every((friend) => friend.progress >= restaurants.length);
        if (finished && allVoted && everyoneDone) {
            navigate('/results');
        }
    }, [finished, allVoted, friends]);

    async function vote(yes) {
        let votes = yesVotes;
        if (yes) {
            votes = [...yesVotes, restaurant.name];
            setYesVotes(votes);
        }

        if (index + 1 < restaurants.length) {
            setIndex(index + 1);
        } else {
            await fetch(`/api/group/${groupCode}/vote`, {
                method: 'POST',
                body: JSON.stringify({ votes: votes }),
                headers: { 'Content-Type': 'application/json' },
            });
            setFinished(true);
        }
    }

    if (error) {
        return <main className="vote"><p className="text-danger">{error}</p></main>;
    }

    if (!restaurant && !finished) {
        return <main className="vote"><h3>Loading restaurants...</h3></main>;
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
