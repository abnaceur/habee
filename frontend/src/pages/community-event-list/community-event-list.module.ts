import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunityEventListPage } from './community-event-list';

@NgModule({
  declarations: [
    CommunityEventListPage,
  ],
  imports: [
    IonicPageModule.forChild(CommunityEventListPage),
  ],
})
export class CommunityEventListPageModule {}
