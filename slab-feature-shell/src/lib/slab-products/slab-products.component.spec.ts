import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlabProductsComponent } from './slab-products.component';

describe('SlabProductsComponent', () => {
  let component: SlabProductsComponent;
  let fixture: ComponentFixture<SlabProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlabProductsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SlabProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
