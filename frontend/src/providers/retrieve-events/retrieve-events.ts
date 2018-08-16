import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Htpp } from "@angular/http";
import { environment as ENV } from "../../environments/environment";

@Injectable()
export class RetrieveEventsProvider {

  constructor(public http: HttpClient) {
    console.log('Hello RetrieveEventsProvider Provider');
  }

  retrieveEvents(userId, jasonWebToken) {

  }

}
