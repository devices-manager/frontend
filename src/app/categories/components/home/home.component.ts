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
  public dataSource = new MatTableDataSource<Category>();
  public displayedColumns: string[] = ['name', 'createdAt'];
  public selectedRow: any = null;
  public angForm: FormGroup;
  public error: any = null;
  public added = false;

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

  public async addBrand(categoryName: string): Promise<boolean> {
    try {
      const category: Category = {
        name: categoryName
      };
      this.categoriesService.addCategory(category)
        .then(res => {
          console.log(`Category Service: ${res}`);
          this.added = true;
          this.error = null;
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

  ngOnInit(): void {
  }

}
