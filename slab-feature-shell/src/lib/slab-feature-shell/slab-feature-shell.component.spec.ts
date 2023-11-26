import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SlabFeatureShellComponent } from './slab-feature-shell.component';

describe('SlabFeatureShellComponent', () => {
  let component: SlabFeatureShellComponent;
  let fixture: ComponentFixture<SlabFeatureShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlabFeatureShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SlabFeatureShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
