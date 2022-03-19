import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCataloguesComponent } from './list-catalogues.component';

describe('ListCataloguesComponent', () => {
  let component: ListCataloguesComponent;
  let fixture: ComponentFixture<ListCataloguesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCataloguesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCataloguesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
