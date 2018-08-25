import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from "ionic-angular";
import { PassionPage } from '../passion/passion';
import { Http, Headers, ResponseOptions } from '@angular/http';
import { environment as ENV } from '../../environments/environment';
import "rxjs/add/operator/map";
import { ProfileProvider } from '../../providers/profile/profile';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userName;
  public tabParams;
  public subPassions;
  public url = ENV.BASE_URL;

  constructor(public profileProvider: ProfileProvider, public http: Http, public navCtrl: NavController, public navParams: NavParams, public nav: NavController) {
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get('activeCommunity')
    };
    console.log("UserIDss: ", this.tabParams);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.profileProvider.getUserProfileByCommunityId(this.tabParams.token, this.tabParams.userId, this.tabParams.activeCommunity)
      .subscribe(response => {
        this.userName = response.Users[0].profile[0].profileUsername
      });

    this.profileProvider.getUserPassionsByCommunityId(this.tabParams.token, this.tabParams.userId, this.tabParams.activeCommunity)
      .subscribe(response => {
      this.profileProvider.getUserSubPassionsByCommunityId(response, this.tabParams.token,this.tabParams.userId, this.tabParams.activeCommunity)
      .then(data => this.subPassions = data);
    });
  }



  goToPassion() {
    this.nav.push("PassionPage");
  }

  ChangePicture() {

  }
}
