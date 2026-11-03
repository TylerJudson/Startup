import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Start() {
    const [joinCode, setJoinCode] = React.useState('');
    const [error, setError] = React.useState('');
    const navigate = useNavigate();

    // THE SERVICE MAKES THE CODE NOW
    async function startGroup(e) {
        e.preventDefault();
        const response = await fetch('/api/group', { method: 'POST' });
        if (response.ok) {
            const group = await response.json();
            goToWaiting(group.code, true);
        } else {
            const body = await response.json();
            setError(body.msg);
        }
    }

    async function joinGroup(e) {
        e.preventDefault();
        const response = await fetch(`/api/group/${joinCode}/join`, { method: 'POST' });
        if (response.ok) {
            goToWaiting(joinCode, false);
        } else {
            const body = await response.json();
            setError(body.msg);
        }
    }

    function goToWaiting(code, isHost) {
        localStorage.setItem('groupCode', code);
        localStorage.setItem('isHost', isHost ? 'true' : 'false');
        localStorage.removeItem('location');
        navigate('/waiting');
    }

    return (
        <main className="choices">
            <form className="panel" onSubmit={startGroup}>
                <h2>Start a Group</h2>

                <p>You are the host. You set the location, and you start the voting
                    once everybody has joined.</p>

                <button className="btn btn-primary" type="submit">Start</button>
            </form>

            <form className="panel" onSubmit={joinGroup}>
                <h2>Join a Group</h2>

                <p>Get the code from whoever started the group and type it in. You get
                    the exact same restaurant list as everyone else.</p>

                <label htmlFor="joincode">Join code</label>
                <input className="form-control mb-2" type="text" id="joincode" maxLength={4} value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="JOIN CODE" />
                <button className="btn btn-secondary" type="submit" disabled={joinCode.length !== 4}>Submit</button>
            </form>

            {error && <p className="text-danger">{error}</p>}
        </main>
    );
}
