import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides, NavParams } from 'ionic-angular';

/**
 * Generated class for the HabeeWalkthroughPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-habee-walkthrough',
  templateUrl: 'habee-walkthrough.html',
})
export class HabeeWalkthroughPage {

  constructor(
    public nav: NavController, 
    public navParams: NavParams) 
    
    {
  }

  @ViewChild('slider') slider: Slides;
  slideIndex = 0;
  slides = [
    {
      title: 'Dream\'s Adventure',
      imageUrl: '../assets/imgs/Guide1.png',
      description: 'Take a look at our amazing options',
    },
    {
      title: 'For the Weekend',
      imageUrl: '../assets/imgs/Guide2.png',
      description: 'Take a look at our amazing options',
    },
    {
      title: 'Family Time',
      imageUrl: '../assets/imgs/Guide3.png',
      description: 'Take a look at our amazing options',
    },
    {
      title: 'My Trip',
      imageUrl: '../assets/imgs/Guide4.png',
      description: 'Take a look at our amazing options',
    }
  ];

  onSlideChanged() {
    this.slideIndex = this.slider.getActiveIndex();
  }

  goToApp() {
    this.nav.push('TabsPage', this.navParams);
  }

  skip() {
    this.nav.push('TabsPage', this.navParams);
  }

}