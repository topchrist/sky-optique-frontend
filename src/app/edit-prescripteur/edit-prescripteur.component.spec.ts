import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPrescripteurComponent } from './edit-prescripteur.component';

describe('EditPrescripteurComponent', () => {
  let component: EditPrescripteurComponent;
  let fixture: ComponentFixture<EditPrescripteurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPrescripteurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPrescripteurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
