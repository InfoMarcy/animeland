import { Component, Input } from '@angular/core';

import { CategoryService } from 'shared/services/product/category.service';

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent {
  categories;
  @Input('category') category;
  constructor(private categoryService: CategoryService) {
    this.getCategories();
   }

//get the list of categories
getCategories() {
 this.categoryService.getAll().subscribe(categories => {
   this.categories = categories;
 });

}
}
