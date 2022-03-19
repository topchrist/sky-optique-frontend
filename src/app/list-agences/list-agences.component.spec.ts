import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAgencesComponent } from './list-agences.component';

describe('ListAgencesComponent', () => {
  let component: ListAgencesComponent;
  let fixture: ComponentFixture<ListAgencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAgencesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAgencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
