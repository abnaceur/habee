import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopupUserDetailModalPage } from './popup-user-detail-modal';

@NgModule({
  declarations: [
    PopupUserDetailModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PopupUserDetailModalPage),
  ],
})
export class PopupUserDetailModalPageModule {}
