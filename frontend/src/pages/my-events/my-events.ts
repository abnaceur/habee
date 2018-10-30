import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MyEventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-events',
  templateUrl: 'my-events.html',
})
export class MyEventsPage {
  items1 = [
    {
      imageUrl: 'assets/img/lists/stadium.jpg',
      title: 'First Cup',
      place: 'Madison Square',
      date: '05/06/2016'
    },
    {
      imageUrl: 'assets/img/lists/stadium-3.png',
      title: 'Season',
      place: 'Hooli',
      date: '15/03/2016'
    },
    {
      imageUrl: 'assets/img/lists/stadium-2.jpg',
      title: '2nd Season',
      place: 'Castelão',
      date: '05/12/2015'
    },
  ];
  items = [
    {
      name: 'Evenement participer',
    },
    {
      name: 'Evenement proposer'
    },
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }
  
  delete(item) {
    alert('Deleted ' + item.title);
  }

  viewComments(item) {
    alert('Viewing comments of ' + item.title);
  }

  viewPlayers(item) {
    alert('Viewing players of ' + item.title);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyEventsPage');
  }

}
