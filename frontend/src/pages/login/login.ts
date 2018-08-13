import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HomePage } from '../home/home';
import { Http } from '@angular/http';
import "rxjs/add/operator/map";

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

  constructor(public http: Http, public nav: NavController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
    this.nav = nav;

    this.authForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  onSubmit(value: any): void {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let data = {
      userId: "test_id1",
      credentials: {
        username: "Abdeljalil hero for ever",
        firstname: "Abn",
        birthDate: "12/12/1980",
        address: "test@admin.com",
        email: "test@this.com",
        phone: "00337563546",
        password: "abdeljalil"
      }
    }

    this.http.post('http://si.habee.local:3000/users/login',
    {
      userId: "test_id1",
      credentials: {
        username: "Abdeljalil hero for ever",
        firstname: "Abn",
        birthDate: "12/12/1980",
        address: "test@admin.com",
        email: "test@this.com",
        phone: "00337563546",
        password: "abdeljalil"
      }
    },
      { headers: headers })
      .map(response => response.json())
      .subscribe(data => console.log('data : ', data));

    if (this.authForm.valid) {
      window.localStorage.setItem('email', value.email);
      window.localStorage.setItem('password', value.password);

      this.nav.push(HomePage);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
