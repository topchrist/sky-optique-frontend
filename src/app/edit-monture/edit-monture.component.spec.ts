import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMontureComponent } from './edit-monture.component';

describe('EditMontureComponent', () => {
  let component: EditMontureComponent;
  let fixture: ComponentFixture<EditMontureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMontureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMontureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
