import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getRestaurants } from '../vote/vote';

// This will be replaced with the vote totals from the database
function getTotals() {
    const restaurants = getRestaurants();
    const myVotes = JSON.parse(localStorage.getItem('myVotes') || '[]');
    const players = JSON.parse(localStorage.getItem('players') || '["You", "Kate", "Conner", "Lily"]');

    const totals = restaurants.map((restaurant) => {
        let votes = 0;
        if (myVotes.includes(restaurant.name)) {
            votes++;
        }
        // Pretend each friend voted yes about half the time
        for (let i = 1; i < players.length; i++) {
            if (Math.random() < 0.5) {
                votes++;
            }
        }
        return { ...restaurant, votes: votes };
    });

    totals.sort((a, b) => b.votes - a.votes);
    return { totals: totals, playerCount: players.length };
}

export function Results() {
    const [results] = React.useState(getTotals());
    const navigate = useNavigate();

    const winner = results.totals[0];

    function openDirections() {
        window.open('https://www.google.com/maps/search/' + encodeURIComponent(winner.name + ' ' + winner.address));
    }

    function newRound(e) {
        e.preventDefault();
        localStorage.removeItem('myVotes');
        navigate('/waiting');
    }

    return (
        <main className="results">
            <div className="winner">
                <h2>Winner: {winner.name}</h2>
                <img id="winner-photo" src={winner.image} alt={winner.name} />
                <span>{winner.votes}/{results.playerCount} votes</span>
                <button className="btn btn-primary" onClick={openDirections}>Directions</button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Restaurant</th>
                            <th>Cuisine</th>
                            <th>Votes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.totals.map((restaurant) => (
                            <tr key={restaurant.name}>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.cuisine}</td>
                                <td>{restaurant.votes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <form onSubmit={newRound}>
                <button className="btn btn-outline-secondary" type="submit">Start a New Round</button>
            </form>
        </main>
    );
}
