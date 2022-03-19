import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProformasComponent } from './list-proformas.component';

describe('ListProformasComponent', () => {
  let component: ListProformasComponent;
  let fixture: ComponentFixture<ListProformasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListProformasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProformasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
