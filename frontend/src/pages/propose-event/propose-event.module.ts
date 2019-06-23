import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProposeEventPage } from './propose-event';
import { SharedModule } from '../../app/shared.module';

@NgModule({
  declarations: [
    ProposeEventPage,
  ],
  imports: [
    IonicPageModule.forChild(ProposeEventPage),
    SharedModule
  ],
})
export class ProposeEventPageModule {}
