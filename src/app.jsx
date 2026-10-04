import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Start } from './start/start';
import { Waiting } from './waiting/waiting';
import { Vote } from './vote/vote';
import { Results } from './results/results';

export default function App() {
  return (
    <BrowserRouter>
      <header>
        <h1>Bite Club</h1>
        <nav>
          <menu>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/start">Start</NavLink></li>
            <li><NavLink to="/waiting">Waiting</NavLink></li>
            <li><NavLink to="/vote">Vote</NavLink></li>
            <li><NavLink to="/results">Results</NavLink></li>
          </menu>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/start" element={<Start />} />
        <Route path="/waiting" element={<Waiting />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/results" element={<Results />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <footer>
        <span>Tyler Judson</span>
        <br />
        <a href="https://github.com/TylerJudson/Startup">Github</a>
      </footer>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main>404: Return to sender. Address unknown.</main>;
}
