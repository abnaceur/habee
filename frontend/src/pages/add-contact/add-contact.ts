import {
  Component
} from '@angular/core';

import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from 'ionic-angular';


import {
AddContactProvider
} from '../../providers/add-contact/add-contact'

@IonicPage()

@Component({
  selector: 'page-add-contact',
  templateUrl: 'add-contact.html',
})

export class AddContactPage {
  public contactArray: any [];
  public contactArrayLenght: Number;
  public validateInput: any;
  public tabParams;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public addContactProvider : AddContactProvider,
    public viewCtrl: ViewController
  ) {

    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get('activeCommunity')
    };
  }

  ionViewWillLoad() {
    this.contactArray = [{value: "", check: ""}];
    this.contactArrayLenght = 0;
    this.validateInput = 0;
 
  }

  AddContact() {
    this.contactArray.push({ 'value': '', 'check': ''});
    this.contactArrayLenght = this.contactArray.length;
  }

  dismiss() {
    this.contactArray = [{value: "", check:''}];
    this.contactArrayLenght = 0;
    this.viewCtrl.dismiss();
  }

  DelItem(item) {
    this.contactArray.splice(item, 1)
  }

  async invitContacts() {
    let emailsList;

    emailsList = await this.addContactProvider.isFieldEmpty(this.contactArray, this.tabParams)
    this.contactArray = emailsList;
  }

}
