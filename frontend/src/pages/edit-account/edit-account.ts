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

  import {
 AccountProvider
  } from '../../providers/account/account';

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
  public accInfo = {};

  constructor(
    private accountService: AccountProvider,
    public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    public navParams: NavParams
    ) {
      //TODO Validate phone number.
      this.editAccountForm = formBuilder.group({
        lastName: ['', Validators.compose([Validators.required])],
        firstName: ['', Validators.compose([Validators.required])],
        address: [''],
        phoneNumber: [''],
        email: ["", Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])],
        confirmEmail: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")])]
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

  ionViewWillEnter() {
    this.accountService.getAccountInfo(this.tabParams)
    .subscribe(accountInfo => {
      console.log("Account info : ", accountInfo.User);
      this.accInfo = accountInfo.User
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onSubmit(values) {

  }

}
