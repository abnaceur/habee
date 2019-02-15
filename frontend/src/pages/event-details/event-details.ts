import { Component } from "@angular/core";

import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ModalController,
  ActionSheetController
} from "ionic-angular";

import { environment as ENV } from "../../environments/environment";

import { EventProvider } from "../../providers/event/event";

import { SocialSharing } from "@ionic-native/social-sharing";

import { Http } from "@angular/http";

import { UtilsProvider } from "../../providers/utils/utils";

/**
 * Generated class for the EventDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-event-details",
  templateUrl: "event-details.html"
})
export class EventDetailsPage {
  public userName;
  public tabParams;
  public subPassions;
  public url = ENV.BASE_URL;
  eventDetails: {
    eventId: string;
    eventCommunity: string;
    eventName: string;
    eventCreator: string;
    eventDescription: string;
    eventStartDate: string;
    eventLocation: string;
    nbrParticipants: 0;
    nbrSubscribedParticipants: number;
    participants: [
      {
        participantId: string;
      }
    ];
    eventIsOver: false;
    eventIsDeleted: false;
  };
  public months = [
    "Jan",
    "Fev",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jui",
    "Aout",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  public isSubscribed = "S'inscrir";
  quotes: any;

  constructor(
    private utils: UtilsProvider,
    public actionSheetCtrl: ActionSheetController,
    private http: Http,
    private socialSharing: SocialSharing,
    private toastController: ToastController,
    public eventProvider: EventProvider,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) {
    this.eventDetails = navParams.get("data");
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get("activeCommunity")
    };

    this.eventDetails.participants.map(pr => {
      if (pr != null) {
        if (pr.participantId == this.tabParams.userId)
          this.isSubscribed = "Desinscrir";
      }
    });
    this.getQuotes();
  }

  async getQuotes() {
    //TODO REPLACE IT WITH EVENT INFORMTION
    this.quotes = [
      {
        ID: 1998,
        title: "Helen Keller",
        content:
          "<p>The best and most beautiful things in the world cannot be seen or even touched. They must be felt with the heart.</p>\n",
        link: "https://quotesondesign.com/helen-keller/"
      },
      {
        ID: 1344,
        title: "Von Glitschka",
        content:
          "<p>A healthy creative process should be able to give a coherent rationale to a client as to why you designed what you designed.  </p>\n",
        link: "https://quotesondesign.com/von-glitschka-2/"
      },
      {
        ID: 473,
        title: "Joe Sparano",
        content:
          "<p>Good design is obvious. Great design is transparent.  </p>\n",
        link: "https://quotesondesign.com/joe-sparano/"
      },
      {
        ID: 580,
        title: "Kyle Steed",
        content:
          "<p>Take a walk. Dance a jig. Get some sun. Don&#8217;t take yourself to serious. Cook something ethnic. Play the 3 chords you know on guitar. Go get coffee. Tell a bad joke, to yourself, and laugh. Look at the way a leaf is made. Overhear someone else&#8217;s conversation. Write it down. Remember it later. Get some sleep.  </p>\n",
        link: "https://quotesondesign.com/kyle-steed/",
        custom_meta: {
          Source:
            '<a href="http://kylesteed.com/2009/im-the-worst-designer/">article</a>'
        }
      },
      {
        ID: 1200,
        title: "Chuck Klosterman",
        content:
          "<p>The worst thing you can do to anybody trying to be creative is to demand participation in their vision.  </p>\n",
        link: "https://quotesondesign.com/chuck-klosterman/",
        custom_meta: {
          Source:
            '<a href="http://nymag.com/daily/entertainment/2009/10/chuck_klosterman_on_why_the_un.html">interview</a>'
        }
      },
      {
        ID: 2233,
        title: "Kyle Matthew Hansen",
        content: "<p>Complexity is the enemy of reliability.</p>\n",
        link: "https://quotesondesign.com/kyle-matthew-hansen/"
      },
      {
        ID: 1736,
        title: "Asher Trotter",
        content:
          "<p>Creating something out of thin air is easy. It&#8217;s finding the air that&#8217;s hard.</p>\n",
        link: "https://quotesondesign.com/asher-trotter/"
      },
      {
        ID: 1383,
        title: "Mitch Hedberg",
        content:
          "<p>I was gonna get a candy bar; the button I was supposed to push was &#8220;HH&#8221;, so I went to the side, I found the &#8220;H&#8221; button, I pushed it twice. Fuckin&#8217;&#8230;potato chips came out, man, because they had an &#8220;HH&#8221; button for Christ&#8217;s sake! You need to let me know. I&#8217;m not familiar with the concept of &#8220;HH&#8221;. I did not learn my AA-BB-CC&#8217;s. God god, dammit dammit.  </p>\n",
        link: "https://quotesondesign.com/mitch-hedberg/"
      },
      {
        ID: 144,
        title: "Petrula Vrontikis",
        content: "<p>Practice safe design: Use a concept.  </p>\n",
        link: "https://quotesondesign.com/petrula-vrontikis/",
        custom_meta: {
          Source:
            '<a href="http://dailypoetics.typepad.com/daily_poetics/2005/10/wekaware_welcom.html">webpage</a>'
        }
      },
      {
        ID: 413,
        title: "Kim Goodwin",
        content:
          "<p>I think if you&#8217;re starting out early in the process by talking about your ideas for solutions, you&#8217;re already not listening. I think you need to enter into any design project with that zen learner&#8217;s mind of &#8216;I don&#8217;t know what I don&#8217;t know.&#8217;  </p>\n",
        link: "https://quotesondesign.com/kim-goodwin/"
      }
    ];
    console.log("quote : ", this.quotes);
  }

  doRefresh(refresher) {
    this.getQuotes();

    setTimeout(() => {
      console.log("Complete");
      refresher.complete();
    }, 2000);
  }

  compilemsg(index): string {
    var msg = this.quotes[index].content + "-" + this.quotes[index].title;
    return msg.concat(" \n sent from my awesome app");
  }
  regularShare(index) {
    var msg = this.compilemsg(index);
    this.socialSharing.share(msg, null, null, null);
  }
  twitterShare(index) {
    var msg = this.compilemsg(index);
    this.socialSharing.shareViaTwitter(msg, null, null);
  }
  whatsappShare(index) {
    var msg = this.compilemsg(index);
    this.socialSharing.shareViaWhatsApp(msg, null, null);
  }
  facebookShare(index) {
    var msg = this.compilemsg(index);
    this.socialSharing.shareViaFacebook(msg, null, null);
  }

  ionViewDidLoad() {
    console.log(
      "ionViewDidLoad EventDetailsPage",
      this.eventDetails,
      this.tabParams
    );
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: "Partager",
      buttons: [
        {
          icon: "logo-whatsapp",
          text: "Via Whatsapp",
          role: "Whatsapp",
          cssClass: "logo-whatsappClass",
          handler: () => {
            console.log("Whatsapp clicked");
          }
        },
        {
          icon: "logo-facebook",
          text: "Via facebook",
          role: "logo-facebook",
          cssClass: "logo-facebookClass",
          handler: () => {
            console.log("Archive clicked");
          }
        },
        {
          icon: "logo-twitter",
          text: "Via twitter",
          role: "logo-twitter",
          cssClass: "logo-twitterClass",
          handler: () => {
            console.log("Archive clicked");
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    actionSheet.present();
  }

  updateParticipantsList(value, eventId) {
    
    value == true ?
    (this.eventDetails.nbrSubscribedParticipants =
      this.eventDetails.nbrSubscribedParticipants + 1,
    this.isSubscribed = "Desinscrir")
    : (this.isSubscribed = "S'inscrir",
    this.eventDetails.nbrSubscribedParticipants =
      this.eventDetails.nbrSubscribedParticipants - 1);
    this.eventProvider
      .getEventById(eventId, this.tabParams.token)
      .subscribe(response => {
        this.eventDetails.participants = response.Event[0].participants;
      });
  }

  subscribeToEvent(eventId) {
    this.eventProvider
      .getEventSubscription(eventId, this.tabParams)
      .subscribe(response => {
        if (response.Subscribe == true) {
          this.updateParticipantsList(true, eventId);
          this.utils.notification("inscription reussie !", "top");
        } else if (response.Subscribe == false) {
          this.updateParticipantsList(false, eventId);
          this.utils.notification("Desinscription reussie !", "top");
        }
      });
  }

  openUserDetailsModal(userDetails) {
    let navInfo = {
      userInfo: this.tabParams,
      userDetails: userDetails
    };
    this.modalCtrl
      .create("PopupUserDetailModalPage", navInfo, { cssClass: "inset-modal" })
      .present();
  }
}
