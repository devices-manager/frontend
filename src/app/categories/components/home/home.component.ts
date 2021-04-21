import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../interfaces/category';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public dataSource = new MatTableDataSource<Category>([]);
  public displayedColumns: string[] = ['name', 'createdAt', 'actions'];
  public selectedRow: any = null;
  public angForm: FormGroup;
  public error: any = null;
  public added = false;

  @ViewChild(MatTable, {static: false}) table!: MatTable<any>;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  constructor(
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder,
  ) {
    this.angForm = this.formBuilder.group({
      categoryName: ['', [
        Validators.required,
        Validators.maxLength(128),
        Validators.pattern(/^[a-z]+([\d\-_\s]|[a-z])/)
      ]]
    });
  }

  public removeElement(arr: Category[], value: Category): Category[] {
    console.log(arr);
    return arr.filter(ele => ele.id !== value.id);
  }


  public async addBrand(categoryName: string): Promise<boolean> {
    try {
      const categoryToAdd: Category = {
        name: categoryName
      };
      await this.categoriesService.addCategory(categoryToAdd)
        .then(res => {
          const category: Category = {
            id: res.id,
            name: res.name,
            createdAt: res.createdAt
          };
          this.dataSource.data.unshift(category);
          this.dataSource.data = this.dataSource.data.slice();
          this.table.renderRows();
          this.added = true;
          this.error = null;
          this.angForm.reset();
        })
        .catch(error => {
          console.log(error);
          this.error = error.error.details;
          this.added = false;
          return;
        });
      return true;
    } catch (_) {
      this.added = false;
      return false;
    }
  }

  public cancel(): boolean {
    try {
      this.selectedRow = null;
      this.added = false;
      this.angForm.reset();
      return true;
    } catch (_) {
      return false;
    }
  }

  public applyFilter(value: string): boolean {
    try {
      this.dataSource.filter = value.trim();
      return true;
    } catch (_){
      return false;
    }
  }

  public async deleteCategory(categoryName: string, categoryId: number): Promise<boolean> {
    try {
      const category: Category = {
        id: categoryId,
        name: categoryName
      };
      this.categoriesService.deleteCategory(category)
        .then(res => {
          this.dataSource.data = this.removeElement(this.dataSource.data, category);
          this.dataSource._updateChangeSubscription();
          this.table.renderRows();
        })
        .catch(error => {
          console.log(error);
          this.error = error.error.details;
          this.added = false;
          return;
        });
      return true;
    } catch (_) {
      this.added = false;
      return false;
    }
  }

  public loadCategories(): void {
    this.categoriesService.getCategories()
    .then( res => {
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

}
