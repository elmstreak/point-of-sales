import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PosProductFormComponent } from './pos-product-form.component';

describe('PosProductFormComponent', () => {
  let component: PosProductFormComponent;
  let fixture: ComponentFixture<PosProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosProductFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PosProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
