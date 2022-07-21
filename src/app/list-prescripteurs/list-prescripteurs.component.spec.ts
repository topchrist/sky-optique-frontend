import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPrescripteursComponent } from './list-prescripteurs.component';

describe('ListPrescripteursComponent', () => {
  let component: ListPrescripteursComponent;
  let fixture: ComponentFixture<ListPrescripteursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPrescripteursComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPrescripteursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
