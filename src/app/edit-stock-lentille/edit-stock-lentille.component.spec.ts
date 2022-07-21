import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockLentilleComponent } from './edit-stock-lentille.component';

describe('EditStockLentilleComponent', () => {
  let component: EditStockLentilleComponent;
  let fixture: ComponentFixture<EditStockLentilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStockLentilleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStockLentilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
