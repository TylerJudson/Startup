import React from 'react';

export function Vote() {
  return (
    <main className="vote">
      <div>
        <h3>Restaurant 3 of 7</h3>
      </div>

      {/* RESTAURANT DATA COMES FROM THIRD PARTY API */}
      <div className="card">
        <img className="card-img-top" src="/images/cubbys.jpg" alt="Cubby's - an image of a large hamburger and fries." />

        <div className="card-body">
          <h3>Cubby's</h3>
          <span>$$$</span>
          <span>american</span>
          <span>0.4 mi</span>
          <span>1496 n university ave</span>
        </div>
      </div>

      <div>
        <form className="vote-buttons" method="get" action="/results">
          <button className="btn btn-danger" type="submit">NO</button>
          <button className="btn btn-success" type="submit">YES</button>
        </form>
      </div>

      {/* THIS IS LIVE STATUS FROM THE OTHER PEOPLE WITH WEBSOCKET */}
      <div className="status">
        <span><b>Kate: </b>3/7</span>
        <span><b>Conner: </b>Done</span>
        <span><b>Lily: </b>5/7</span>
      </div>
    </main>
  );
}
