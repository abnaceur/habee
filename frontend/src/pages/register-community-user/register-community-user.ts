import { 
  Component 
} from '@angular/core';

import {
   IonicPage,
  NavController, 
  NavParams 
} from 'ionic-angular';

/**
 * Generated class for the RegisterCommunityUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-community-user',
  templateUrl: 'register-community-user.html',
})
export class RegisterCommunityUserPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterCommunityUserPage');
  }

  goToLoginPage() {
    this.navCtrl.push("LoginPage");
  }

  goToRegisterPage() {
    this.navCtrl.push("RegisterPage");
  }

}
