import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';


/*
  Generated class for the CameraProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CameraProvider {

  constructor(private camera: Camera) {
  }


  getPictureFromCamera() {
    return this.getImage(this.camera.PictureSourceType.CAMERA, true);
  }

  getPictureFromPhotoLibrary() {
    return this.getImage(this.camera.PictureSourceType.PHOTOLIBRARY);
  }

  // This method takes optional parameters to make it more customizable
  getImage(pictureSourceType, crop = false, quality = 50, allowEdit = false, saveToAlbum = true) {
    const options = {
      quality,
      allowEdit,
      mimeType: "image/jpg",                                                                                                  
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: pictureSourceType,
      encodingType: this.camera.EncodingType.PNG,
      saveToPhotoAlbum: saveToAlbum,
      mediaType: this.camera.MediaType.PICTURE,
    };

    // If set to crop, restricts the image to a square of 600 by 600
     //if (!crop) {
       options['targetWidth'] = 800;
       options['targetHeight'] = 800;
     //}


    return this.camera.getPicture(options).then(imageData => {
      const base64Image = 'data:image/jpg;base64,' + imageData;
      return base64Image;
    }, error => {
      console.log('CAMERA ERROR -> ' + JSON.stringify(error));
    });
  }


}
