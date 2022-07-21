import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStockMontureComponent } from './edit-stock-monture.component';

describe('EditStockMontureComponent', () => {
  let component: EditStockMontureComponent;
  let fixture: ComponentFixture<EditStockMontureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStockMontureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStockMontureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
