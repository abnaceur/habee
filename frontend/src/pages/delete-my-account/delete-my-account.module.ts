import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeleteMyAccountPage } from './delete-my-account';

@NgModule({
  declarations: [
    DeleteMyAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(DeleteMyAccountPage),
  ],
})
export class DeleteMyAccountPageModule {}
