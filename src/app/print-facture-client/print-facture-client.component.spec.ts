import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintFactureClientComponent } from './print-facture-client.component';

describe('PrintFactureClientComponent', () => {
  let component: PrintFactureClientComponent;
  let fixture: ComponentFixture<PrintFactureClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintFactureClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintFactureClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
