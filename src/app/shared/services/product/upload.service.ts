import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as faker from 'faker';
import * as firebase from 'firebase';
import { Upload } from 'shared/models/products/product-images.model';

import { SnackbarService } from './../angular-material/snack-bar.service';


@Injectable()
export class UploadService {
    //firestore local storage folder
    private basePath = '/products';
        constructor(private db: AngularFirestore, private snackbarService: SnackbarService) {}

        // upload file to firebase Storage
        pushFileToStorage(fileUpload: Upload, progress: { percentage: number}, id: any) {
       const storageRef = firebase.storage().ref();
       const fileId = faker.random.alphaNumeric(16);
       const uploadTask = storageRef.child(`${this.basePath}/${fileId}`).put(fileUpload.file);

       uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
           //upload en progreso
           const snap = snapshot as firebase.storage.UploadTaskSnapshot;
           progress.percentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);

       },
       (error) => { // error exception
                  console.log(error);
       },
       () => {  // success uploading the file
          fileUpload.id = fileId;
          fileUpload.url = uploadTask.snapshot.downloadURL;
          fileUpload.name = fileUpload.file.name;


          this.saveFileData(fileUpload, id);


       });
        }


        // upload the image information for the product on the product upload collection
        saveFileData(fileUpload: Upload, id: any) {
            // get the reference of the product id document
           this.db.collection(`products`).doc(id).collection('uploads').doc(fileUpload.id).set({
    id: fileUpload.id,
    name: fileUpload.name,
    url: fileUpload.url
  });
  this.snackbarService.launch('Imagen subida correctamente', 'Subir Imagen', 5000);
        }

        //delete an image from firebase storage
        public removeFile(fileId) {
            return firebase.storage().ref().child(`${this.basePath}/${fileId}`).delete();
        }



}
