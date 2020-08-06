// import pages
import HomePage from './pages/home';
import FirebasePage from './pages/firebase';
import MapboxPage from './pages/mapbox';
import Game from './pages/game';
import Register from './pages/register';
import Homepage from './pages/homepage';
import Login from './pages/login';
import Player from './pages/player';
import Settings from './pages/settings';
import History from './pages/history';
import Admingame from './pages/admingame';
import Playergame from './pages/playergame';
import Lobby from './pages/lobby';


export default [
  { path: '/home', view: HomePage },
  { path: '/firebase', view: FirebasePage },
  { path: '/mapbox', view: MapboxPage },
  { path: '/game', view: Game },
  { path: '/register', view: Register },
  { path: '/homepage', view: Homepage },
  { path: '/login', view: Login },
  { path: '/player', view: Player },
  { path: '/settings', view: Settings },
  { path: '/history', view: History },
  { path: '/admingame', view: Admingame },
  { path: '/playergame', view: Playergame },
  { path : '/lobby', view: Lobby},
];
