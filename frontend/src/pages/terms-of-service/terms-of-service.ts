import { Component } from '@angular/core';
import { 
  ViewController, 
  IonicPage, 
  NavController, 
  NavParams  } from 'ionic-angular';

/**
 * Generated class for the TermsOfServicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-terms-of-service',
  templateUrl: 'terms-of-service.html',
})
export class TermsOfServicePage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    ) {
  }

  dismiss() {
    this.viewCtrl.dismiss(false);
  }

  termsAccepted() {
    this.viewCtrl.dismiss(true);   
  }

  declineTerms() {
    this.navCtrl.push("LoginPage")
  }
  
  showtermsScripts() {
    this.navCtrl.push("TermsOfServiceScriptPage")   
  }

}
  