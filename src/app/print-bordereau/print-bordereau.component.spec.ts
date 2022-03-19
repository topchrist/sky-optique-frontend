import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintBordereauComponent } from './print-bordereau.component';

describe('PrintBordereauComponent', () => {
  let component: PrintBordereauComponent;
  let fixture: ComponentFixture<PrintBordereauComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintBordereauComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintBordereauComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
