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
    UtilsProvider
  } from '../../providers/utils/utils'

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
    private utils: UtilsProvider,
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
    if (values.email != values.confirmEmail)
      this.utils.notification("Emails sont differents!", "top");
    else {
      this.accountService.updateUserAccount(values, this.tabParams)
      .subscribe(data => {
        if (data === 200) this.utils.notification("Compte est mise ajour", "top")
        else if (data === 500) this.utils.notification("Une erreur est survenu", "top");
      })
    }
  }

}
