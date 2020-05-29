import './assets/stylesheets/main.scss';
import './assets/img/favicon.ico';
import './assets/img/default-background1.jpg';
import './assets/img/default-background2.jpg';
import './assets/img/default-background3.jpg';
import './assets/img/default-background4.jpg';
import './assets/img/default-background5.jpg';


import AppController from './assets/js/Controller/AppController';
import AppView from './assets/js/View/AppView';
import AppModel from './assets/js/Model/AppModel';

const app = new AppController(new AppView(), new AppModel());
app.init();
