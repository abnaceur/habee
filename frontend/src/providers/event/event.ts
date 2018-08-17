import { Http, Headers } from "@angular/http";
import { Injectable } from '@angular/core';
import { environment as ENV } from "../../environments/environment";
import { Event } from "../../models/event.model";
import { Item, Header } from "ionic-angular/umd";

@Injectable()
export class EventProvider {
  eventsArray: Event[];

  constructor(public http: Http) {
    console.log('Hello EventProvider Provider');
  }

  // retrieve an array of events
  getEventsById(eventId: string, token: string) {
    const headers: Headers = new Headers({"authorization": token});
    return this.http.get(ENV.BASE_URL + "/events/" + eventId, {headers: headers});
  }

}
