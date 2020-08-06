/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
class Dataseeder {
  constructor() {
    this.long = 3.7219431; // vaste waarde, wordt in spel vertrekpunt van het spel
    this.lat = 51.054633;
    this.interval = 25;
  }


  rotateLocation() {
    const randomLongitude = Math.random() * 2 - 1 * 0.001;
    const randomLatitude = Math.random() * 2 - 1 * 0.001;
    console.log(`Adding${randomLongitude}to longitude`);
    console.log(`Adding${randomLatitude}to latitude`);

    this.long += randomLongitude;
    this.lat += randomLongitude;

    console.log(`New longitude : ${this.long}`);
    console.log(`New latitude : ${this.lat}`);
  }


  startRotation() {
    console.log("Starting game : rotating player position's");
    setInterval(function () { this.rotateLocation(); }, this.interval);
  }

  stopRotation() {
    clearInterval(this.interval);
  }
}


const players = ['Admin', 'Player1', 'Player2', 'Player3']; // players[0] zijnde de admin van het spel

function startGame() {
  for (let i = 0; i < players.length; i++) {
    players[i] = new Dataseeder();
    players[i].startRotation();
  }
}
/*
let person = new Dataseeder();
person.startRotation();

*/
