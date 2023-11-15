import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PosFeatureShellComponent } from './pos-feature-shell.component';

describe('PosFeatureShellComponent', () => {
  let component: PosFeatureShellComponent;
  let fixture: ComponentFixture<PosFeatureShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosFeatureShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PosFeatureShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
