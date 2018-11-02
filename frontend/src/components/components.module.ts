import { TimelineComponentModule } from './timeline/timeline.module';
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';


import { AccordionListComponent } from './accordion-list/accordion-list';


export const components = [

  AccordionListComponent,
];

@NgModule({
  declarations: [components],
  imports: [IonicModule],
  exports: [components, TimelineComponentModule]
})
export class ComponentsModule {}
