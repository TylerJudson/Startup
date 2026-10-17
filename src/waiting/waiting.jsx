import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Waiting() {
    const groupCode = localStorage.getItem('groupCode') || '????';
    const isHost = localStorage.getItem('isHost') === 'true';
    const [location, setLocation] = React.useState(localStorage.getItem('location') || '');
    const [joined, setJoined] = React.useState(['You']);
    const navigate = useNavigate();

    // This will be replaced with WebSocket messages when people join
    React.useEffect(() => {
        const friends = ['Kate', 'Conner', 'Lily'];
        let i = 0;
        const timer = setInterval(() => {
            if (i < friends.length) {
                const name = friends[i];
                setJoined((names) => [...names, name]);
                i++;
            } else {
                clearInterval(timer);
                // Pretend the host started the voting
                if (!isHost) {
                    navigate('/vote');
                }
            }
        }, 2000);

        return () => clearInterval(timer);
    }, []);

    // This will be replaced with a call to a location service
    function useMyLocation() {
        setLocation('Provo, UT');
    }

    function startVoting(e) {
        e.preventDefault();
        localStorage.setItem('location', location);
        localStorage.setItem('players', JSON.stringify(joined));
        navigate('/vote');
    }

    return (
        <main className="waiting">
            <div className="code-box">
                <h3>JOIN CODE: <span id="join-code">{groupCode}</span></h3>
                <span>Copy the code above and share it with your friends!</span>
            </div>

            {isHost && (
                <div className="host-box">
                    <span><b>Location:</b> {location || 'not set'}</span>
                    <button className="btn btn-outline-primary" onClick={useMyLocation}>Use my Location</button>
                    <label htmlFor="location">Location</label>
                    <input className="form-control" type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter Location" />
                </div>
            )}

            <div>
                <h3>Joined: </h3>
                <ul className="joined">
                    {joined.map((name) => (
                        <li key={name}>{name}</li>
                    ))}
                </ul>
            </div>

            {isHost ? (
                <form onSubmit={startVoting}>
                    <button className="btn btn-primary btn-lg" type="submit" disabled={!location}>Start Voting</button>
                </form>
            ) : (
                <p>Waiting for the host to start the voting...</p>
            )}
        </main>
    );
}
