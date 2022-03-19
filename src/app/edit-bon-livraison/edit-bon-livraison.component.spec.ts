import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBonLivraisonComponent } from './edit-bon-livraison.component';

describe('EditBonLivraisonComponent', () => {
  let component: EditBonLivraisonComponent;
  let fixture: ComponentFixture<EditBonLivraisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBonLivraisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBonLivraisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
