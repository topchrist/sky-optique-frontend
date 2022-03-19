import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMontureDialogComponent } from './add-monture-dialog.component';

describe('AddMontureDialogComponent', () => {
  let component: AddMontureDialogComponent;
  let fixture: ComponentFixture<AddMontureDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMontureDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMontureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
