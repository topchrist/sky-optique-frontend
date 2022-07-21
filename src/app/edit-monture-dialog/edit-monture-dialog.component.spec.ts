import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMontureDialogComponent } from './edit-monture-dialog.component';

describe('EditMontureDialogComponent', () => {
  let component: EditMontureDialogComponent;
  let fixture: ComponentFixture<EditMontureDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMontureDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMontureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
