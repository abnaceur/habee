import { 
  Component 
} from '@angular/core';

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
  } from "../../environments/environment";

/**
 * Generated class for the EditAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-account',
  templateUrl: 'edit-account.html',
})
export class EditAccountPage {
  editAccountForm: FormGroup;
  public url = ENV.BASE_URL;
  private tabParams: Object;


  constructor(
    public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public navParams: NavParams
    ) {
      this.editAccountForm = formBuilder.group({
        lastName: ['', Validators.compose([Validators.required])],
        firstName: ['', Validators.compose([Validators.required])],
        address: ['', Validators.compose([Validators.required])],
        phoneNumber: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required])],
        confirmEmail: ['', Validators.compose([Validators.required])]
      });
  
      this.tabParams = {
        userId: this.navParams.get("userId"),
        token: this.navParams.get("token"),
        activeCommunity: this.navParams.get('activeCommunity')
      };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditAccountPage');
  }

}
