import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PassionPage } from './passion';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PassionPage,
  ],
  imports: [
    FormsModule,
    IonicPageModule.forChild(PassionPage),
  ],
})
export class PassionPageModule {}
