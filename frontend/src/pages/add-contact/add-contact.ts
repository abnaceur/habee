import { Component } from "@angular/core";

import {
  IonicPage,
  NavController,
  NavParams,
  ViewController
} from "ionic-angular";

import { CommunityProvider } from "../../providers/community/community";

import { AddContactProvider } from "../../providers/add-contact/add-contact";

import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';

import {
  UtilsProvider
} from '../../providers/utils/utils';


@IonicPage()
@Component({
  selector: "page-add-contact",
  templateUrl: "add-contact.html"
})
export class AddContactPage {
  public contactArray: any[];
  public contactArrayLenght: Number;
  public validateInput: any;
  public tabParams;
  public allCommunities = [];
  public myContact = "";

  constructor(
    public utils: UtilsProvider,
    private contacts: Contacts,
    private communityProvider: CommunityProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public addContactProvider: AddContactProvider,
    public viewCtrl: ViewController
  ) {
    this.tabParams = {
      userId: this.navParams.get("userId"),
      token: this.navParams.get("token"),
      activeCommunity: this.navParams.get("activeCommunity"),
      notificationStatus: this.navParams.get("notificationStatus")
    };
  }

  ionViewWillEnter() {
    if (this.tabParams.activeCommunity != "") {
      this.communityProvider
        .getCommunitiesbyCreator(this.tabParams)
        .subscribe(dataCreator => {
          this.allCommunities = this.allCommunities.concat(
            dataCreator.communities
          );
          if (this.allCommunities.length == 1)
            this.contactArray = [
              {
                value: "",
                check: "",
                status: "",
                communities: [this.allCommunities[0].communityId]
              }
            ];
          else
            this.contactArray = [
              {
                value: "",
                check: "",
                status: "",
                communities: []
              }
            ];
          this.contactArrayLenght = 0;
          this.validateInput = 0;
        });
    }
  }

  AddContact() {
    if (this.allCommunities.length == 1)
      this.contactArray.push({
        value: "",
        check: "",
        status: "",
        communities: [this.allCommunities[0].communityId]
      });
    else
      this.contactArray.push({
        value: "",
        check: "",
        status: "",
        communities: []
      });
    this.contactArrayLenght = this.contactArray.length;
  }

  dismiss() {
    this.contactArray = [{ value: "", check: "", status: "", communities: [] }];
    this.contactArrayLenght = 0;
    this.viewCtrl.dismiss();
  }

  DelItem(item) {
    this.contactArray.splice(item, 1);
  }

  async invitContacts() {
    let emailsList;

    emailsList = await this.addContactProvider.isFieldEmpty(
      this.contactArray,
      this.tabParams
    );
    this.contactArray = emailsList;
    
    if (this.contactArray[0].value != "" && this.contactArray[0].communities.length != 0) {
      this.utils.notification(this.contactArray[0].check, "top");
      this.dismiss()     
    }
  }

  getAllCommunities() {
    if (this.tabParams.activeCommunity != "") {
      this.communityProvider
        .getCommunitiesbyCreator(this.tabParams)
        .subscribe(dataCreator => {
          this.allCommunities = this.allCommunities.concat(
            dataCreator.communities
          );
        });
    }
  }

  getCommunity(checked, community, index) {
    if (checked.value == true) {
      this.contactArray[index].communities.push(community.communityId);
    } else if (checked.value == false) {
      this.contactArray[index].communities.splice(
        this.contactArray[index].communities.indexOf(community.communityId),
        1
      );
    }
  }
  
  invitContactfromMyContactList() {
    this.contacts.pickContact().then(data => {
      console.log("Contacts :", data)
      if (!data.emails)
        this.utils.notification("L'addresse email de votre contact est vide", "top");
      else {
        this.contactArray[0].value = data.emails[0].value;
      } 
    })
  }

}
