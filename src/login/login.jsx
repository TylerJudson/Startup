import React from 'react';

export function Login() {
  return (
    <main className="login">
      <img id="logo" src="/images/logo.png" alt="Image of the cookie logo." />
      <h2>The first rule of Bite Club is that EVERYONE EATS!</h2>

      <p>One person starts a group and gets a code, everyone joins on their phone,
        and the same restaurants show up for all of them. You tap through them yes
        or no, and you can watch how far along your friends are. When the last
        person finishes, every screen jumps to the results at the same time and the
        place with the most yeses wins.</p>

      <form method="get" action="/start">
        <div className="mb-3">
          <label htmlFor="email">Email</label>
          <input className="form-control" type="email" id="email" name="email" placeholder="your@email.com" />
        </div>
        <div className="mb-3">
          <label htmlFor="password">Password</label>
          <input className="form-control" type="password" id="password" name="password" placeholder="password" />
        </div>

        <button className="btn btn-primary" type="submit">Login</button>
        <button className="btn btn-outline-secondary" type="submit">Create</button>
      </form>
    </main>
  );
}
