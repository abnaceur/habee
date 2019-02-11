import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyEventsPage } from './my-events';
import { SharedModule } from '../../app/shared.module';

@NgModule({
  declarations: [
    MyEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyEventsPage),
    SharedModule
  ],
  exports: [
    MyEventsPage
  ]
})
export class MyEventsPageModule {}
