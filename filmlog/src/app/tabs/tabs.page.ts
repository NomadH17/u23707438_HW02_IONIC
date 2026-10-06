import { Component } from '@angular/core';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search, bookmark, checkmarkCircle, pieChartOutline } from 'ionicons/icons'; 

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  constructor() {
    addIcons({search,bookmark,checkmarkCircle,pieChartOutline});
  }
}
