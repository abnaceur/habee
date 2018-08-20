import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from "ionic-angular";
import { PassionPage } from '../passion/passion';
import { Http, Headers } from '@angular/http';
import { environment as ENV } from '../../environments/environment' ;
import "rxjs/add/operator/map";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public tabParams;
  constructor(public http: Http, public navCtrl: NavController, public navParams: NavParams,  public nav: NavController) {
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
    console.log('Token 12:', this.tabParams.token);
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('Accept', 'application/json');
    header.append('Authorization', 'Bearer ' + this.tabParams.token);
    this.http.get(ENV.BASE_URL + '/users/' + this.tabParams.userId + '/' + this.tabParams.activeCommunity,
      { headers: header })
      .subscribe(response => console.log(response));
  }
}
