import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBonCommandeComponent } from './edit-bon-commande.component';

describe('EditBonCommandeComponent', () => {
  let component: EditBonCommandeComponent;
  let fixture: ComponentFixture<EditBonCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBonCommandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBonCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
