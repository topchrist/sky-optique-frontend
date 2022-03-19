import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBordereauComponent } from './edit-bordereau.component';

describe('EditBordereauComponent', () => {
  let component: EditBordereauComponent;
  let fixture: ComponentFixture<EditBordereauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBordereauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBordereauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
