import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { UtilsProvider } from '../../providers/utils/utils';
import { environment as ENV } from '../../environments/environment';

/*
  Generated class for the EventProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EventProvider {

  constructor(public http: Http, public utils: UtilsProvider) {
    console.log('Hello EventProvider Provider');
  }

  getEventsByCommunityId(token, userId, activeCommunity) {

    const header = this.utils.inihttpHeaderWIthToken(token);

    return this.http.get(ENV.BASE_URL + '/events/community/' + activeCommunity,
      { headers: header })
      .map(response => response.json());
  }

  getEventSubscription(eventId, token, userId, communityId) {
    console.log("inside inscription peovider ");
    const header = this.utils.inihttpHeaderWIthToken(token);

    return this.http.put(ENV.BASE_URL + '/events/' + eventId + '/user/' + userId + '/community/' + communityId,
      { headers: header })
      .map(response => response.json());
  }

  getEventById(eventId, token) {
    const header = this.utils.inihttpHeaderWIthToken(token);

    return this.http.get(ENV.BASE_URL + '/events/' + eventId,
      { headers: header })
      .map(response => response.json());
  }
}

