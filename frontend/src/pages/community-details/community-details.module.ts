import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityDetailsPage } from './community-details';

@NgModule({
  declarations: [
    CommunityDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunityDetailsPage),
  ],
})
export class CommunityDetailsPageModule {}
