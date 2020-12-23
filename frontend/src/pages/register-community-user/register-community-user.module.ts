import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterCommunityUserPage } from './register-community-user';

@NgModule({
  declarations: [
    RegisterCommunityUserPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterCommunityUserPage),
  ],
})
export class RegisterCommunityUserPageModule {}
