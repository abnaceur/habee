import { NgModule } from '@angular/core';
import { EventComponent } from './event/event.component';
import  { IonicModule } from "ionic-angular";
@NgModule({
	declarations: [EventComponent],
	imports: [IonicModule],
	exports: [EventComponent]
})
export class ComponentsModule {}
