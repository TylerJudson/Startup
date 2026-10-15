import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Login({ userName, onLogin }) {
    const [email, setEmail] = React.useState(userName);
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();

    // This will be replaced with a call to the login service
    function login(e) {
        e.preventDefault();
        localStorage.setItem('userName', email);
        onLogin(email);
        navigate('/start');
    }

    return (
        <main className="login">
            <img id="logo" src="/images/logo.png" alt="Image of the cookie logo." />
            <h2>The first rule of Bite Club is that EVERYONE EATS!</h2>

            <p>One person starts a group and gets a code, everyone joins on their phone,
                and the same restaurants show up for all of them. You tap through them yes
                or no, and you can watch how far along your friends are. When the last
                person finishes, every screen jumps to the results at the same time and the
                place with the most yeses wins.</p>

            {userName ? (
                <div>
                    <p>Welcome back, {userName}!</p>
                    <button className="btn btn-primary" onClick={() => navigate('/start')}>Play</button>
                </div>
            ) : (
                <form onSubmit={login}>
                    <div className="mb-3">
                        <label htmlFor="email">Email</label>
                        <input className="form-control" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">Password</label>
                        <input className="form-control" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
                    </div>

                    <button className="btn btn-primary" type="submit" disabled={!email || !password}>Login</button>
                    <button className="btn btn-outline-secondary" type="submit" disabled={!email || !password}>Create</button>
                </form>
            )}
        </main>
    );
}
