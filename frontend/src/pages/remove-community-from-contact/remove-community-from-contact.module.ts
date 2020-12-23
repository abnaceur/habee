import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RemoveCommunityFromContactPage } from './remove-community-from-contact';

@NgModule({
  declarations: [
    RemoveCommunityFromContactPage,
  ],
  imports: [
    IonicPageModule.forChild(RemoveCommunityFromContactPage),
  ],
})
export class RemoveCommunityFromContactPageModule {}
