import { Component } from '@angular/core';
import { 
  ViewController,
  IonicPage, 
  NavController, 
  NavParams } from 'ionic-angular';

  import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl
  } from '@angular/forms';

  import {
    environment as ENV
  } from '../../environments/environment';
  

/**
 * Generated class for the EditPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-password',
  templateUrl: 'edit-password.html',
})
export class EditPasswordPage {
  modifyPasswordForm: FormGroup;
  public url = ENV.BASE_URL;
  private tabParams: Object;

  constructor(
    public formBuilder: FormBuilder,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController
    ) {

      this.modifyPasswordForm = formBuilder.group({
        oldPassword: ['', Validators.compose([Validators.required])],
        newPassword: ['', Validators.compose([Validators.required])],
        confirmPassword: ['', Validators.compose([Validators.required])],
      });
  
      this.tabParams = {
        userId: this.navParams.get("userId"),
        token: this.navParams.get("token"),
        activeCommunity: this.navParams.get('activeCommunity')
      };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPasswordPage');
  }


  dismiss() {
    this.viewCtrl.dismiss();
  }

}
