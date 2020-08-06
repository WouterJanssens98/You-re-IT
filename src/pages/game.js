/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable new-cap */
/* eslint-disable func-names */
/* eslint-disable no-restricted-globals */
/**
 * The Home Page
 */


import App from '../lib/App';


const homeTemplate = require('../templates/game.hbs');

export default () => {
  // set the title of this page
  const title = 'Title';

  // render the template
  App.render(homeTemplate({ title }));


  // test
  const canvas = document.querySelector('canvas');
  const c = canvas.getContext('2d');

  const maxRadius = 100;
  const minRadius = 40;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const mouse = {
    x: undefined,
    y: undefined,
  };
  const colorArray = [
    '#FFFFFF',
    '#999',
  ];

  window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });


  let circleArray = [];


  /**
   * Initialiseert een lege array met de naam circleArray en vult die daarna met 100 circle's
   */
  function init() {
    // lege array maken
    circleArray = [];

    // For loop die 100 keer gaat herhaalt worden
    for (let i = 0; i < 40; i++) {
      // willekeurige straal aanmaken
      const radius = Math.random() * 5 + 0.5;
      // Willekeurige X en Y coordinaten aanmaken
      const x = Math.random() * (innerWidth - radius * 2) + radius;
      const y = Math.random() * (innerHeight - radius * 2) + radius;

      const dx = (Math.random() - 0.5 * 2);
      const dy = (Math.random() - 0.5 * 2);

      // Gecreeërde circle in de array pushen/toevoegen
      circleArray.push(new circle(x, y, dx, dy, radius));
    }
  }


  /**
   * Creert een circle en tekent het op het canvas
   * @param  {} x x coordinaat
   * @param  {} y y coordinaat
   * @param  {} dx
   * @param  {} dy
   * @param  {} radius straal van de circle
   */
  function circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;

    // willekeurig kleur uit de kleuren array ophalen
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

    // Functie die de cicle op de canvas tekent
    // met de meegegeven kleur, cooördinaten en straal
    this.draw = function () {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.strokeStyle = this.color;
      c.fill();
      c.closePath();
      c.stroke();
    };

    // Functie die de grootte van de circle aanpast afhankelijk of de muis over de circle gaat.
    this.update = function () {
      // Twee if lussen die controleren of de circle aan de rand van het scherm zit of niet?
      // If true: richting veranderen
      if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
        this.dx = -this.dx;
      }
      if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
        this.dy = -this.dy;
      }

      this.x += this.dx; // snelheid
      this.y += this.dy; // snelheid

      // interactivity
      // Als de muis binnen de coordinaten van de circle ligt,  vergroot de straal van de circle
      // eslint-disable-next-line max-len

      this.draw();
    };
  }


  // oproepen draw
  // Start de animatie van de bewegende circles
  function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < circleArray.length; i++) {
      circleArray[i].update();
    }
  }

  // oproepen twee functies
  init();
  animate();
};
