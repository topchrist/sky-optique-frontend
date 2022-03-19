import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBonLivraisonsComponent } from './list-bon-livraisons.component';

describe('ListBonLivraisonsComponent', () => {
  let component: ListBonLivraisonsComponent;
  let fixture: ComponentFixture<ListBonLivraisonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBonLivraisonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBonLivraisonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
