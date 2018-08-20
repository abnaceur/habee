import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from "ionic-angular";
import { PassionPage } from '../passion/passion';
import { Http, Headers } from '@angular/http';
import { environment as ENV } from '../../environments/environment' ;
import "rxjs/add/operator/map";
import { ProfileProvider } from '../../providers/profile/profile';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public tabParams;
  constructor(public profileProvider: ProfileProvider, public http: Http, public navCtrl: NavController, public navParams: NavParams,  public nav: NavController) {
    this.tabParams = {
			userId: this.navParams.get("userId"), 
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get('activeCommunity')
		};
		console.log("UserIDss: ", this.tabParams);  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  goToPassion() { 
    this.nav.push("PassionPage");
  }

  ChangePicture() {
   this.profileProvider.getUserProfileByCommunityId(this.tabParams.token, this.tabParams.userId, this.tabParams.activeCommunity)
   .subscribe(response => console.log('respons 23: ', response));
}
}
