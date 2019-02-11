import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProposeEventPage } from './propose-event';

@NgModule({
  declarations: [
    ProposeEventPage,
  ],
  imports: [
    IonicPageModule.forChild(ProposeEventPage),
  ],
})
export class ProposeEventPageModule {}
