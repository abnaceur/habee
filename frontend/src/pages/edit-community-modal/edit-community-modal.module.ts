import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditCommunityModalPage } from './edit-community-modal';

@NgModule({
  declarations: [
    EditCommunityModalPage,
  ],
  imports: [
    IonicPageModule.forChild(EditCommunityModalPage),
  ],
})
export class EditCommunityModalPageModule {}
