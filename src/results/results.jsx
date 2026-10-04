import React from 'react';

export function Results() {
  return (
    <main className="results">
      <div className="winner">
        <h2>Winner: Tucanos</h2>
        <img id="winner-photo" src="/images/tucanos.jpg" alt="Tucanos - An image of meet being cut on a skewer." />
        <span>4/4 votes</span>
        <button className="btn btn-primary">Directions</button>
      </div>

      <div className="table-responsive">
        {/* VOTE TOTALS READ FROM DB */}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Restaurant</th>
              <th>Cuisine</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tucanos</td>
              <td>brazilian</td>
              <td>4</td>
            </tr>
            <tr>
              <td>Cubby's</td>
              <td>american</td>
              <td>3</td>
            </tr>
            <tr>
              <td>Black Sheep Cafe</td>
              <td>southwest</td>
              <td>2</td>
            </tr>
            <tr>
              <td>India Palace</td>
              <td>indian</td>
              <td>2</td>
            </tr>
            <tr>
              <td>Station 22</td>
              <td>american</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>
      </div>

      <form method="get" action="/waiting">
        <button className="btn btn-outline-secondary" type="submit">Start a New Round</button>
      </form>
    </main>
  );
}
