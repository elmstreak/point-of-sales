import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PosStocksComponent } from './pos-stocks.component';

describe('PosStocksComponent', () => {
  let component: PosStocksComponent;
  let fixture: ComponentFixture<PosStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosStocksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PosStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
