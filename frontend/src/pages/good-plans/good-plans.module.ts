import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoodPlansPage } from './good-plans';

@NgModule({
  declarations: [
    GoodPlansPage,
  ],
  imports: [
    IonicPageModule.forChild(GoodPlansPage),
  ],
})
export class GoodPlansPageModule {}
