import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import { environment as ENV } from "../../environments/environment";
import { User } from "../../models/user.model";
import "rxjs/add/operator/map";

@Injectable()
export class RetrieveEventsProvider {
  public userObject;
  public user: User;

  constructor(public http: Http) {
    console.log('Hello RetrieveEventsProvider Provider');
  }

  getUserById(userId: string) {
    return this.http.get(ENV.BASE_URL + "/users/" + <string>userId);
  }

  retrieveEvents(userJson) {
    this.userObject = {
      userId: userJson.userId,
      token: userJson.token
    }
    console.log("retrieveEventsProvider params: ", this.userObject);

    this.getUserById(<string>this.userObject.userId)
    .subscribe((response) => {
      this.user= response.json();
      console.log("retreive-events: User: ", this.user);
    },
    (error) => console.log(error)
    )
  }
    //console.log("GETUSERBYID: ", this.getUserById(<string>this.userObject.userId));

    //return this.http.post(ENV.BASE_URL + "/users/" + communityId)
 }
