import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Results() {
    const [results, setResults] = React.useState(null);
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    // THE SERVICE ADDS UP EVERYONES VOTES
    React.useEffect(() => {
        const groupCode = localStorage.getItem('groupCode');
        fetch(`/api/group/${groupCode}/results`)
            .then((response) => response.json())
            .then((body) => {
                if (body.totals) {
                    setResults(body);
                } else {
                    setError(body.msg);
                }
            });
    }, []);

    if (error) {
        return <main className="results"><p className="text-danger">{error}</p></main>;
    }

    if (!results) {
        return <main className="results"><h3>Adding up the votes...</h3></main>;
    }

    const winner = results.totals[0];

    function openDirections() {
        window.open('https://www.google.com/maps/search/' + encodeURIComponent(winner.name + ' ' + winner.address));
    }

    // THE OLD GROUP ALREADY STARTED SO MAKE A NEW ONE
    function newRound(e) {
        e.preventDefault();
        navigate('/start');
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
