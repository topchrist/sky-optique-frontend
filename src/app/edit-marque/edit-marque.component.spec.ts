import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMarqueComponent } from './edit-marque.component';

describe('EditMarqueComponent', () => {
  let component: EditMarqueComponent;
  let fixture: ComponentFixture<EditMarqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditMarqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMarqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
