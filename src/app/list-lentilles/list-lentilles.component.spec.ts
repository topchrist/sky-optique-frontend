import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLentillesComponent } from './list-lentilles.component';

describe('ListLentillesComponent', () => {
  let component: ListLentillesComponent;
  let fixture: ComponentFixture<ListLentillesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLentillesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLentillesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
