import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ListContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-contact',
  templateUrl: 'list-contact.html',
})
export class ListContactPage {

  contact = [
    {
      profilePhoto: 'assets/img/background/background-2.jpg',
      profileFullname: 'Doudou',
    },
    {
      profilePhoto: 'assets/img/background/background-3.jpg',
      profileFullname: 'myMimi',
    },
    {
      profilePhoto: 'assets/img/background/background-4.jpg',
      profileFullname: 'Mom',
    },
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListContactPage');
  }

}
