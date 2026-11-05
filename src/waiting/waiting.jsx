import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Waiting() {
    const groupCode = localStorage.getItem('groupCode') || '????';
    const isHost = localStorage.getItem('isHost') === 'true';
    const userName = localStorage.getItem('userName');
    const [location, setLocation] = React.useState(localStorage.getItem('location') || '');
    const [members, setMembers] = React.useState(['You']);
    const [fakeFriends, setFakeFriends] = React.useState([]);
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    const joined = [...members, ...fakeFriends];

    // ASKS THE SERVICE WHO JOINED EVERY 2 SECONDS
    React.useEffect(() => {
        async function checkGroup() {
            const response = await fetch(`/api/group/${groupCode}`);
            if (!response.ok) {
                const body = await response.json();
                setError(body.msg);
                return;
            }

            const group = await response.json();
            const names = group.members.map((email) => (email === userName ? 'You' : email));
            setMembers(names);

            // THE HOST STARTED SO EVERYONE GOES TO VOTE
            if (group.started && !isHost) {
                localStorage.setItem('location', group.location);
                localStorage.setItem('players', JSON.stringify(names));
                navigate('/vote');
            }
        }

        checkGroup();
        const timer = setInterval(checkGroup, 2000);
        return () => clearInterval(timer);
    }, []);

    // FAKE FRIENDS UNTIL THE WEBSOCKET
    React.useEffect(() => {
        const friends = ['Kate', 'Conner', 'Lily'];
        let i = 0;
        const timer = setInterval(() => {
            if (i < friends.length) {
                const name = friends[i];
                setFakeFriends((names) => [...names, name]);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 2000);

        return () => clearInterval(timer);
    }, []);

    // BROWSER GIVES LAT AND LON, OPENSTREETMAP TURNS THEM INTO A CITY
    function useMyLocation() {
        setError('');
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                if (!response.ok) {
                    setError('Could not look up your city');
                    return;
                }

                const place = await response.json();
                const city = place.address.city || place.address.town || place.address.village;
                // US-UT TURNS INTO UT
                const state = place.address['ISO3166-2-lvl4'] ? place.address['ISO3166-2-lvl4'].split('-')[1] : place.address.state;
                setLocation(`${city}, ${state}`);
            },
            () => setError('Could not get your location')
        );
    }

    async function startVoting(e) {
        e.preventDefault();
        const response = await fetch(`/api/group/${groupCode}/start`, {
            method: 'PUT',
            body: JSON.stringify({ location: location }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            localStorage.setItem('location', location);
            localStorage.setItem('players', JSON.stringify(joined));
            navigate('/vote');
        } else {
            const body = await response.json();
            setError(body.msg);
        }
    }

    return (
        <main className="waiting">
            <div className="code-box">
                <h3>JOIN CODE: <span id="join-code">{groupCode}</span></h3>
                <span>Copy the code above and share it with your friends!</span>
            </div>

            {isHost && (
                <div className="host-box">
                    <label htmlFor="location"><b>Location</b></label>
                    <div className="input-group">
                        <input className="form-control" type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter Location" />
                        <button className="btn btn-primary" type="button" onClick={useMyLocation}>Use my Location</button>
                    </div>
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

            {error && <p className="text-danger">{error}</p>}

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
