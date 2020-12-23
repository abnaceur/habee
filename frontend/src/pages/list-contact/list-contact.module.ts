import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListContactPage } from './list-contact';

@NgModule({
  declarations: [
    ListContactPage,
  ],
  imports: [
    IonicPageModule.forChild(ListContactPage),
  ],
})
export class ListContactPageModule {}
