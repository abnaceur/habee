import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PassionPage } from './passion';

@NgModule({
  declarations: [
    PassionPage,
  ],
  imports: [
    IonicPageModule.forChild(PassionPage),
  ],
})
export class PassionPageModule {}
