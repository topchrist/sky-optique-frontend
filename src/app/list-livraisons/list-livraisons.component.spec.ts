import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLivraisonsComponent } from './list-livraisons.component';

describe('ListLivraisonsComponent', () => {
  let component: ListLivraisonsComponent;
  let fixture: ComponentFixture<ListLivraisonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLivraisonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLivraisonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
