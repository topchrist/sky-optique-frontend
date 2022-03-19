import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMarquesComponent } from './list-marques.component';

describe('ListMarquesComponent', () => {
  let component: ListMarquesComponent;
  let fixture: ComponentFixture<ListMarquesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMarquesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMarquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
