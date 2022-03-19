import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBonCommandesComponent } from './list-bon-commandes.component';

describe('ListBonCommandesComponent', () => {
  let component: ListBonCommandesComponent;
  let fixture: ComponentFixture<ListBonCommandesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBonCommandesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBonCommandesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
