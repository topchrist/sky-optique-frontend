import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLentilleComponent } from './edit-lentille.component';

describe('EditLentilleComponent', () => {
  let component: EditLentilleComponent;
  let fixture: ComponentFixture<EditLentilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLentilleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLentilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
