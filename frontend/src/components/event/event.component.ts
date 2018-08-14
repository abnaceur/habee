import { Component, Input } from '@angular/core';
import { Event } from "../../models/event.model";

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
export class EventComponent {
  @Input()
  public event: Event = null;
  private focus: boolean = false;
  private focusText: string = "En savoir plus";
  private subscribed: boolean = false;

  constructor() {
  }

  displayMore(): void {
    if (!this.focus) {
      this.focusText = "Moins";
    } else {
      this.focusText = "En savoir plus";
    }
      this.focus = !this.focus;
  }
}
