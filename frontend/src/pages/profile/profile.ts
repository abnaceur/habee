import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from "ionic-angular";


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public tabParams;
  constructor(public navCtrl: NavController, public navParams: NavParams,  public nav: NavController) {
    this.tabParams = {
			userId: this.navParams.get("userId"), 
			token: this.navParams.get("token")
		};
		console.log("UserIDss: ", this.tabParams.userId);  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  addPassion() {
    this.nav.push("PassionPage");
  }
}
