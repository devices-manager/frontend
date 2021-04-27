import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HomeComponent } from './home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CategoriesService } from '../../services/categories.service';
import { MatTableModule } from '@angular/material/table';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj(
      'CategoriesService',
      ['getCategories', 'addCategory']
    );
    spy.getCategories.and.returnValue(
      Promise.resolve([
        {
          id: 5,
          name: 'test',
          createdAt: '2021-04-27T12:46:26.000Z',
          updatedAt: '2021-04-27T12:46:26.000Z'
        }
      ])
    );
    // spy.deleteCategory.and.returnValue(
    //   Promise.resolve([
    //     {
    //       "id":5,
    //       "name":"test",
    //       "createdAt":"2021-04-27T12:46:26.000Z",
    //       "updatedAt":"2021-04-27T12:46:26.000Z"
    //     }
    //   ])
    // );
    spy.addCategory.and.returnValue(
      Promise.resolve([
        {
          id: 5,
          name: 'test',
          createdAt: '2021-04-27T12:46:26.000Z',
          updatedAt: '2021-04-27T12:46:26.000Z'
        }
      ])
    );
    await TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MatPaginatorModule,
        MatTableModule
      ],
      providers: [
        { provide: CategoriesService, useValue: spy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create category home', () => {
    expect(component).toBeTruthy();
  });

  it('should be add category', async () => {
    expect(await component.addCategory('test')).toEqual(true);
  });
});
