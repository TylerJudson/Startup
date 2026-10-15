import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Start() {
    const [joinCode, setJoinCode] = React.useState('');
    const navigate = useNavigate();

    // This will be replaced with a call to the service to create a group
    function startGroup(e) {
        e.preventDefault();
        const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += letters[Math.floor(Math.random() * letters.length)];
        }
        localStorage.setItem('groupCode', code);
        localStorage.setItem('isHost', 'true');
        navigate('/waiting');
    }

    // This will be replaced with a call to the service to join a group
    function joinGroup(e) {
        e.preventDefault();
        localStorage.setItem('groupCode', joinCode);
        localStorage.setItem('isHost', 'false');
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
        </main>
    );
}
