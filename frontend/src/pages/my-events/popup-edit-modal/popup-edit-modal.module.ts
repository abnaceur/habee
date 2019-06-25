import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopupEditModalPage } from './popup-edit-modal';
import { SharedModule } from '../../../app/shared.module';

@NgModule({
  declarations: [
    PopupEditModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PopupEditModalPage),
    SharedModule
  ],
})
export class PopupEditModalPageModule {}
