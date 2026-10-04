import React from 'react';

export function Waiting() {
  return (
    <main className="waiting">
      <div className="code-box">
        <h3>JOIN CODE: <span id="join-code">ABCD</span></h3>
        <span>Copy the code above and share it with your friends!</span>
      </div>

      {/* THIS WILL SHOW FOR THE HOST ONLY */}
      {/* THE BUTTON WILL AUTO USE THEIR LOCATION WHILE
          THE INPUT WILL ALLOW THE USER TO ENTER MANUALLY */}
      <div className="host-box">
        <span><b>Location:</b> not set</span>
        <button className="btn btn-outline-primary">Use my Location</button>
        <label htmlFor="location">Location</label>
        <input className="form-control" type="text" id="location" name="location" placeholder="Enter Location" />
      </div>

      {/* NAMES WILL APPEAR HERE WITH A WEBSOCKET */}
      <div>
        <h3>Joined: </h3>
        <ul className="joined">
          <li>You</li>
          <li>Kate</li>
          <li>Conner</li>
          <li>Lily</li>
        </ul>
      </div>

      <form method="get" action="/vote">
        <button className="btn btn-primary btn-lg" type="submit">Start Voting</button>
      </form>
    </main>
  );
}
