import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  private userName: string;
  private userId: string;
  private jsonWebToken: string;


  //constructor(public http: HttpClient) {
  constructor() {
    // Hardcoded values to test
    this.userName = "Abdel";
    this.userId = "usr12;"
  }

  getUserName(): string {
    return this.userName;
  }

  getUserId(): string {
    return this.userId;
  }

}
