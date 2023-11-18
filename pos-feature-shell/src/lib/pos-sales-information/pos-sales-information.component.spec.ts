import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PosSalesInformationComponent } from './pos-sales-information.component';

describe('PosSalesInformationComponent', () => {
  let component: PosSalesInformationComponent;
  let fixture: ComponentFixture<PosSalesInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosSalesInformationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PosSalesInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
