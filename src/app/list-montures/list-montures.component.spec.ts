import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMonturesComponent } from './list-montures.component';

describe('ListMonturesComponent', () => {
  let component: ListMonturesComponent;
  let fixture: ComponentFixture<ListMonturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMonturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMonturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
