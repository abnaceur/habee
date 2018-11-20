import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Item } from "ionic-angular";
import { PassionPage } from '../passion/passion';
import { Http, Headers, ResponseOptions } from '@angular/http';
import { environment as ENV } from '../../environments/environment';
import "rxjs/add/operator/map";
import { ProfileProvider } from '../../providers/profile/profile';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userName;
  public tabParams;
  public subPassions;
  public url = ENV.BASE_URL;

  following = false;
 public user = {
  name: '',
  profileImage: 'assets/img/avatar/girl-avatar.png',
  coverImage: 'assets/img/background/background-5.jpg',
  occupation: 'Designer',
  location: 'Seattle, WA',
  description: 'A wise man once said: The more you do something, the better you will become at it.',
  coeur: 456,
  proposed: 1052,
  participated: 35
};

  posts = [
    {
      postImageUrl: 'assets/img/background/background-2.jpg',
      text: `I believe in being strong when everything seems to be going wrong.
             I believe that happy girls are the prettiest girls.
             I believe that tomorrow is another day and I believe in miracles.`,
      date: 'November 5, 2016',
      likes: 12,
      comments: 4,
      timestamp: '11h ago'
    },
    {
      postImageUrl: 'assets/img/background/background-3.jpg',
      text: 'Do not go where the path may lead, go instead where there is no path and leave a trail.',
      date: 'October 23, 2016',
      likes: 30,
      comments: 64,
      timestamp: '30d ago'
    },
    {
      postImageUrl: 'assets/img/background/background-4.jpg',
      date: 'June 28, 2016',
      likes: 46,
      text: `Hope is the thing with feathers that perches in the soul
             and sings the tune without the words And never stops at all.`,
      comments: 66,
      timestamp: '4mo ago'
    },
  ];


  constructor(
    public profileProvider: ProfileProvider, 
    public http: Http, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public nav: NavController
  ) 
    {
     
      this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get('activeCommunity')
    };

    
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad ProfilePage');
    this.profileProvider.getUserProfileByCommunityId(this.tabParams.token, this.tabParams.userId, this.tabParams.activeCommunity)
      .subscribe(response => {
        console.log("User  : ", response.Users[0], response.Users[0].eventCreated )
        this.user.name = response.Users[0].profile[0].profileUsername,
        this.user.profileImage =  ENV.BASE_URL + '/' + response.Users[0].profile[0].profilePhoto,
        this.user.proposed = response.Users[0].eventCreated,
        
        this.user.participated = response.Users[0].nbrEventsParticipated,
        this.userName = response.Users[0].profile[0].profileUsername
      });

   // this.profileProvider.getUserPassionsByCommunityId(this.tabParams.token, this.tabParams.userId, this.tabParams.activeCommunity)
    //  .subscribe(response => {
    //  this.profileProvider.getUserSubPassionsByCommunityId(response, this.tabParams.token,this.tabParams.userId, this.tabParams.activeCommunity)
    //  .then(data => this.subPassions = data);
    //});
  }

  follow() {
    this.following = !this.following;
  }

  imageTapped(post) {
  }

  comment(post) {
  }

  like(post) {
  }

}
