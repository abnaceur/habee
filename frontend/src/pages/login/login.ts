import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";
import { LoginProvider } from '../../providers/login/login';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  authForm: FormGroup;

  constructor(private toastController: ToastController, public loginProvider: LoginProvider, public http: Http, public nav: NavController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
    this.nav = nav;

    this.authForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  onSubmit(value: any): void {

    this.loginProvider.loginUser(value.email, value.password)
      .subscribe(response => {
        if (response.code == "200") {
          console.log('response : ', response);
          this.nav.push("TabsPage");
        } else {
          let authFailedToast = this.toastController.create({
            message: "E-mail et/ou mot de pass non valid",
            duration: 2000,
            position: 'top',
            cssClass: "authFailedClass"
          });
          authFailedToast.present();
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}