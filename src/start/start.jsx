import React from 'react';

export function Start() {
  return (
    <main className="choices">
      <form className="panel" method="get" action="/waiting">
        <h2>Start a Group</h2>

        <p>You are the host. You set the location, and you start the voting
          once everybody has joined.</p>

        <button className="btn btn-primary" type="submit">Start</button>
      </form>

      <form className="panel" method="get" action="/waiting">
        <h2>Join a Group</h2>

        <p>Get the code from whoever started the group and type it in. You get
          the exact same restaurant list as everyone else.</p>

        <label htmlFor="joincode">Join code</label>
        <input className="form-control mb-2" type="text" id="joincode" name="joincode" placeholder="JOIN CODE" />
        <button className="btn btn-secondary" type="submit">Submit</button>
      </form>
    </main>
  );
}
