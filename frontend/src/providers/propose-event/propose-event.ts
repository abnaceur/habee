import { HttpClient } from '@angular/common/http';

import {
  Injectable
} from '@angular/core';

import {
  Http,
  Headers
} from '@angular/http';

import { Socket } from 'ng-socket-io';

import {
  UtilsProvider
} from '../../providers/utils/utils';

import {
  environment as ENV
} from '../../environments/environment';

/*
  Generated class for the ProposeEventProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProposeEventProvider {

  constructor(
    public http: Http,
    private socket: Socket,
    public utils: UtilsProvider,
  ) {
    console.log('Hello ProposeEventProvider Provider');
  }

  emitnewCreatedEvent(event) {
    this.socket.connect();
    console.log("Event :", event)
    this.socket.emit("join", event.eventCommunity);
    this.socket.emit("new-event", event);
  }

}
