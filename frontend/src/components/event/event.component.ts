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

  constructor() {
  }
}
