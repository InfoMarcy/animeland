import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as faker from 'faker';
import { Observable } from 'rxjs/Rx';

import { CategoryModel } from 'shared/models/category.model';
import { SnackbarService } from './../angular-material/snack-bar.service';


@Injectable()
export class CategoryService {

    // for working with firebase firestore collection
    categoryCollection: AngularFirestoreCollection<CategoryModel>;
    // get  a list of documents as observables from firebase
    category$: Observable<CategoryModel[]>;
    // get the reference for the document id for delete and getById or Update
    categoryDoc: AngularFirestoreDocument<CategoryModel>;

    // inject angular firebase database
    constructor(private asf: AngularFirestore, private snackbarService: SnackbarService) {
        // get the collection from firebase and sort it by name
        this.categoryCollection = this.asf.collection('categories', ref => ref.orderBy('name', 'asc'));
    }

    // retreave the list of products from firestore
    getAll() {
        this.getCategories();
        return this.category$;
    }

    //add a record to firebase
    create(category: CategoryModel) {
        const id = faker.random.alphaNumeric(16);
        return this.asf.collection('categories').doc(id).set(
            {
                id: id,
                dateCreated: new Date().getTime(),
                name: category.name,
                subcategories: []
            }
        );
    }

    //update a record from firebase
    update(category, id) {
        this.categoryDoc = this.asf.doc('categories/' + id);
        this.categoryDoc.update(category);
        this.snackbarService.launch("Categoria Actualizada", "Categoria", 2000);
    }

    //delete a record from firebase
    delete(id: string) {
        this.categoryDoc = this.asf.doc('categories/' + id);
        this.categoryDoc.delete();
        this.snackbarService.launch("Categoria Eliminada", "Categoria", 2000);
    }



    // get the list of records from firestoree
    private getCategories() {
        this.category$ = this.categoryCollection.snapshotChanges().map(changes => {
            return changes.map(db => {
                const category = db.payload.doc.data() as CategoryModel;
                category.id = db.payload.doc.id;
                return category;
            });
        });
    }


    // this one is to know if the product exist on the cart using a key
    static findSubcategoryByKey(array, key, value) {
        for (let i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }


    // get the reference for the cart that will be use for adding, updating and deleting
    myCartRef(id) {


        return this.asf.collection(`categories`).doc(id).ref;
    }

    // add product to cart
    addSubcategory(id, subcategory) {
        const subid = faker.random.alphaNumeric(16);
        subcategory.id = subid;
        return new Promise((resolve, reject) => {
            const ref = this.myCartRef(id);
            ref.get().then(doc => {
                //get the cart data
                console.log(doc.data());
                const category = doc.data();

                // all the product on hte cart
                const subcategoryInDb = category.subcategories;
                const categoryItems = {
                    id: id,
                    name: subcategory.name
                };
                const exist = CategoryService.findSubcategoryByKey(subcategoryInDb, 'id', subcategory.id);
                if (!exist) {
                    //  const subcategoryInDb = category.products;
                    subcategoryInDb.push(subcategory);
                    this.snackbarService.launch("Sub Categoria Agregada", "SubCategoria", 2000);
                }

                return ref.update(category).then(() => {
                    resolve(true);
                }).catch((error) => { reject(error); })



            })
        })
    }


    // remove product from shoppingCart
    removeSubCategory(subcategory, categoryId): Promise<any> {  
        return new Promise((resolve, reject) => {
            const ref = this.myCartRef(categoryId);
            ref.get().then(doc => {
                const category = doc.data();
                const subCategoryInDB = category.subcategories;


                const exists = CategoryService.findSubcategoryByKey(subCategoryInDB, 'id', subcategory.id);
                if (exists) {
                    const index = subCategoryInDB.findIndex(obj => obj.id === subcategory.id);
                    category.subcategories = [
                        ...subCategoryInDB.slice(0, index),
                        ...subCategoryInDB.slice(index + 1)
                    ];
                    return ref.update(category).then(() => {
                        resolve(true);
                        this.snackbarService.launch("SubCategoria Eliminada", "Categoria", 2000);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
        });
    }

} 