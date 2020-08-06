
/**
 * The main App
 *
 * @author Tim De Paepe <tim.depaepe@arteveldehs.be>
 */

import Tools from './core/Tools';
import Router from './core/Router';
import Renderer from './core/Renderer';
import FireBase from './core/FireBase';

class App {
  static initCore({ mainUrl, hash, element }) {
    this._router = new Router(mainUrl, hash);
    this._renderer = new Renderer(element, this.router);
  }

  static initFireBase({ apiKey, projectId, messagingSenderId }) {
    this._firebase = new FireBase(apiKey, projectId, messagingSenderId);
  }

  static get router() {
    return this._router;
  }

  static get renderer() {
    return this._renderer;
  }

  static get firebase() {
    if (!this._firebase) throw new Error('Firebase was not initialized!');
    return this._firebase;
  }

  static get hasFireBase() {
    return !Tools.isUndefined(this._firebase);
  }

  static render(html) {
    if (!this._renderer) throw new Error('The App Core was not initialized!');
    this._renderer.render(html);
  }

  static get tools() {
    return Tools;
  }
}

export default App;
