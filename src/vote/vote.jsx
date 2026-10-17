import React from 'react';
import { useNavigate } from 'react-router-dom';

// This will be replaced with a call to a third party restaurant API
function getRestaurants() {
    return [
        { name: "Cubby's", price: '$$$', cuisine: 'american', distance: '0.4 mi', address: '1496 n university ave', image: '/images/cubbys.jpg' },
        { name: 'Tucanos', price: '$$$', cuisine: 'brazilian', distance: '1.2 mi', address: '4801 n university ave', image: '/images/tucanos.jpg' },
        { name: 'Black Sheep Cafe', price: '$$', cuisine: 'southwest', distance: '0.8 mi', address: '19 n university ave', image: '/images/logo.png' },
        { name: 'India Palace', price: '$$', cuisine: 'indian', distance: '0.6 mi', address: '98 w center st', image: '/images/logo.png' },
        { name: 'Station 22', price: '$$', cuisine: 'american', distance: '0.7 mi', address: '22 w center st', image: '/images/logo.png' },
    ];
}

export function Vote() {
    const [restaurants] = React.useState(getRestaurants());
    const [index, setIndex] = React.useState(0);
    const [yesVotes, setYesVotes] = React.useState([]);
    const navigate = useNavigate();

    const restaurant = restaurants[index];

    function vote(yes) {
        let votes = yesVotes;
        if (yes) {
            votes = [...yesVotes, restaurant.name];
            setYesVotes(votes);
        }

        if (index + 1 < restaurants.length) {
            setIndex(index + 1);
        } else {
            localStorage.setItem('myVotes', JSON.stringify(votes));
            navigate('/results');
        }
    }

    return (
        <main className="vote">
            <div>
                <h3>Restaurant {index + 1} of {restaurants.length}</h3>
            </div>

            <div className="card">
                <img className="card-img-top" src={restaurant.image} alt={restaurant.name} />

                <div className="card-body">
                    <h3>{restaurant.name}</h3>
                    <span>{restaurant.price}</span>
                    <span>{restaurant.cuisine}</span>
                    <span>{restaurant.distance}</span>
                    <span>{restaurant.address}</span>
                </div>
            </div>

            <div className="vote-buttons">
                <button className="btn btn-danger" onClick={() => vote(false)}>NO</button>
                <button className="btn btn-success" onClick={() => vote(true)}>YES</button>
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
