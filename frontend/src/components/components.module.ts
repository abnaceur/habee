import { TimelineComponentModule } from './timeline/timeline.module';
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';


import { AccordionListComponent } from './accordion-list/accordion-list';
import { ExpandableHeaderComponent } from './expandable-header/expandable-header';
import { CalendarModule } from "ion2-calendar";

export const components = [

  AccordionListComponent,
];

@NgModule({
  declarations: [components,
    ExpandableHeaderComponent],
  imports: [IonicModule],
  exports: [components, TimelineComponentModule,
    ExpandableHeaderComponent, CalendarModule]
})
export class ComponentsModule {}
