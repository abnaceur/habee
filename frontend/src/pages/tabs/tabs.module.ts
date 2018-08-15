import { NgModule } from "@angular/core";
import { IonicPageModule, Tab } from "ionic-angular";
import { TabsPage } from "./tabs";

@NgModule({
    declarations: [TabsPage],
    imports: [IonicPageModule.forChild(TabsPage)],
})
export class TabsPageModule {}