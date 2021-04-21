import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DevicesService } from '../../services/devices.service';
import { Device } from '../../interfaces/device';
import { Category } from 'src/app/categories/interfaces/category';
import { CategoriesService } from 'src/app/categories/services/categories.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public dataSource = new MatTableDataSource<Device>([]);
  public displayedColumns: string[] = ['color', 'partNumber', 'category', 'createdAt', 'actions'];
  public selectedRow: any = null;
  public angForm: FormGroup;
  public error: any = null;
  public added = false;
  public categories: Category[] = [];
  public selectedCategory!: Category;


  @ViewChild(MatTable, {static: false}) table!: MatTable<any>;
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  constructor(
    private devicesService: DevicesService,
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService
  ) {
    this.angForm = this.formBuilder.group({
      deviceColor: ['', [
        Validators.required,
        Validators.maxLength(16),
        Validators.pattern(/^[a-z]+([\d\-_\s]|[a-z])/)
      ]],
      partNumber: ['', [
        Validators.required,
        Validators.pattern(/^-?[0-9]+(\.[0-9]*){0,1}$/g)
      ]]
    });
  }

  public removeElement(arr: Device[], value: Device): Device[] {
    console.log(arr);
    return arr.filter(ele => ele.id !== value.id);
  }


  public async addDevice(color: string, partNumber: string, category: Category): Promise<boolean> {
    try {
      const deviceToAdd: Device = {
        color,
        partNumber: Number(partNumber),
        categoryId: category.id || 0,
      };
      await this.devicesService.addDevice(deviceToAdd)
        .then(res => {
          const device: Device = {
            id: res.id,
            color: res.color,
            categoryId: res.categoryId,
            partNumber: res.partNumber,
            Category: res.Category,
            createdAt: res.createdAt
          };
          this.dataSource.data.unshift(device);
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

  public async deleteDevice(
    color: string,
    deviceId: number,
    partNumber: number,
    categoryId: number
  ): Promise<boolean> {
    try {
      const device: Device = {
        id: deviceId,
        color,
        partNumber,
        categoryId
      };
      this.devicesService.deleteDevice(device)
        .then(_ => {
          this.dataSource.data = this.removeElement(this.dataSource.data, device);
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
      this.categories = res;
    });
  }

  public loadDevices(): void {
    this.devicesService.getDevices()
    .then( res => {
      console.log(res);
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadDevices();
  }

}
