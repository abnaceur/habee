import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopupEditModalPage } from './popup-edit-modal';

@NgModule({
  declarations: [
    PopupEditModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PopupEditModalPage),
  ],
})
export class PopupEditModalPageModule {}
