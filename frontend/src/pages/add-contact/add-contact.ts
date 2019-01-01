import {
  Component
} from '@angular/core';

import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';


/**
 * Generated class for the AddContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({
  selector: 'page-add-contact',
  templateUrl: 'add-contact.html',
})

export class AddContactPage {
  public contactArray: any [];
  public contactArrayLenght: Number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddContactPage');
  }

  ionViewDidEnter() {
    this.contactArray = [{value: ""}];
    this.contactArrayLenght = 0;
  }


  AddContact() {
    this.contactArray.push({ 'value': '' });
    this.contactArrayLenght = this.contactArray.length;
    console.log("ARRAY :", this.contactArray, this.contactArrayLenght);
  }

  dismiss() {
    this.contactArray = [{value: ""}];
    this.contactArrayLenght = 0;
    this.viewCtrl.dismiss();
  }

  DelItem(item) {
    this.contactArray.splice(item, 1)
  }

}
