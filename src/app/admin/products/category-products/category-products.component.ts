import { Component, OnInit } from '@angular/core';

import { CategoryModel } from 'shared/models/category.model';
import { CategoryService } from 'shared/services/product/category.service';
import { AuthService } from 'auth/service/auth.service';
import { SubCategories } from 'shared/models/subcategories.model';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent implements OnInit {

  categories;
  category: CategoryModel = {
    id: '',
    name: '',
    description: ''
  };

  //edit the category
  editState = false;
  editSubState = false;
  categoryToEdit: CategoryModel;
  SubcategoryToEdit: CategoryModel;
  appUser;
  subCategories = new SubCategories();

  constructor(private categoryService: CategoryService, private auth: AuthService) { }
  ngOnInit() {
    this.getAll();

     // check if there is a user loggedin
     this.auth.user$.subscribe(appUser => { this.appUser = appUser; });
  }

  onSubmit(category: CategoryModel) {
this.categoryService.create(category);
this.category.name = '';
this.category.id = '';
  }

  // get a list of all the categories
  getAll() {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    });


  }

  //delete a category
  delete(id) {
    if (!confirm('Estas seguro/a que quires borrar este producto?')) { return; }
      this.categoryService.delete(id);

  }

  //update category
  update(category) {
    this.categoryService.update(category, category.id);
    this.clearState();
  }
  // edit a category
  edit(category) {
    this.editSubState = false;
   this.editState = true;
 this.categoryToEdit = category;

  }

  clearState() {
    this.editState = false;
    this.categoryToEdit = null;
    this.getAll();
    
  }


  editSubcategory(category){
    this.editState = false;
    this.editSubState = true;
 this.SubcategoryToEdit = category;
  }
  clearSubState(){
    this.editSubState = false;
    this.SubcategoryToEdit = null;
    this.subCategories = new SubCategories();
    this.getAll();
     
  }

  updateSubCategory(category, subCategory){

    this.categoryService.addSubcategory(category.id, subCategory);
    this.clearSubState();
   
  }

  removeSubCategory(subcategory, id){
    if (!confirm('Estas seguro/a que quieres borrar esta SubCategoria?')) { return; }
    this.categoryService.removeSubCategory(subcategory, id);
  }

}


