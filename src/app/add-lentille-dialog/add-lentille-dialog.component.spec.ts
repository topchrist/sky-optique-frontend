import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLentilleDialogComponent } from './add-lentille-dialog.component';

describe('AddLentilleDialogComponent', () => {
  let component: AddLentilleDialogComponent;
  let fixture: ComponentFixture<AddLentilleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLentilleDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLentilleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
