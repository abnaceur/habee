import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PassionProvider } from '../../providers/passion/passion';
import { environment as ENV } from '../../environments/environment';

/**
 * Generated class for the PassionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-passion',
  templateUrl: 'passion.html',
})
export class PassionPage {
  public tabParams;
  public allPassions = [];
  public url = ENV.BASE_URL;

  constructor(public passionProvider : PassionProvider, public nav: NavController, public navCtrl: NavController, public navParams: NavParams) {
    this.tabParams = {
			userId: this.navParams.get("userId"), 
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get('activeCommunity')
		};
		console.log("UserIDss: ", this.tabParams);  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PassionPage');
    this.passionProvider.getAllPassions(this.tabParams.token, this.tabParams.activeCommunity)
    .subscribe(response => {
      console.log('Response 2131: ', response.passion);
      this.allPassions = response.passion;
    });
  }

  goToSubPassion(passionId) {
    this.nav.push("SubPassionPage");
  }
}
