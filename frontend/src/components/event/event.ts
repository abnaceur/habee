import { Component, Input, AfterContentInit } from '@angular/core';
import { Event } from "../../models/event.model";
import { UserProvider } from "../../providers/user/user";

/**
 * Generated class for the EventComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'appEvent',
  templateUrl: 'event.component.html'
})
export class EventComponent implements AfterContentInit {
  @Input()
  public event: Event = null;
  private focus: boolean = false;
  private focusText: string = "En savoir plus";
  private subscribed: boolean = false;
  private subscribeText: string = "je participe!";

  //private userProvider: UserProvider = new UserProvider();
  private userName: string;
  private userIsCreator: boolean;


  constructor() {
    //this.userName = this.userProvider.getUserName();
  }

  ngAfterContentInit() {
    if (this.event != null && this.event != undefined)
      this.userIsCreator = this.event.eventCreator == this.userName ? true : false;
  }

  displayMore(): void {
    if (!this.focus) {
      this.focusText = "Moins";
    } else {
      this.focusText = "En savoir plus";
    }
      this.focus = !this.focus;
  }

  subscribe(): void {
    if (!this.subscribed) {
      this.subscribeText = "Me désinscrire";
    } else {
      this.subscribeText = "Je participe!";
    }
      this.subscribed = !this.subscribed;
  }
}
