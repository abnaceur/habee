import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventFilterPage } from './event-filter';

@NgModule({
  declarations: [
    EventFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(EventFilterPage),
  ],
})
export class EventFilterPageModule {}
