import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCommunityPage } from './add-community';

@NgModule({
  declarations: [
    AddCommunityPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCommunityPage),
  ],
})
export class AddCommunityPageModule {}
