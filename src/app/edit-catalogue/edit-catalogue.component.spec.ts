import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCatalogueComponent } from './edit-catalogue.component';

describe('EditCatalogueComponent', () => {
  let component: EditCatalogueComponent;
  let fixture: ComponentFixture<EditCatalogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCatalogueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCatalogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
