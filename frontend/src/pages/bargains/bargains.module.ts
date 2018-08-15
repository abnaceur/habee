import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BargainsPage } from './bargains';

@NgModule({
  declarations: [
    BargainsPage,
  ],
  imports: [
    IonicPageModule.forChild(BargainsPage),
  ],
})
export class BargainsPageModule {}
