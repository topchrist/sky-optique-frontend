import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLentilleDialogComponent } from './edit-lentille-dialog.component';

describe('EditLentilleDialogComponent', () => {
  let component: EditLentilleDialogComponent;
  let fixture: ComponentFixture<EditLentilleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLentilleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLentilleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
