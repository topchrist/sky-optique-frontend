import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPrescripteurDialogComponent } from './edit-prescripteur-dialog.component';

describe('EditPrescripteurDialogComponent', () => {
  let component: EditPrescripteurDialogComponent;
  let fixture: ComponentFixture<EditPrescripteurDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPrescripteurDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPrescripteurDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
