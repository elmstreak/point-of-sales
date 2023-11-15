import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PosCashierComponent } from 'pos-feature-shell/pos-cashier/pos-cashier.component';
import { PosProductFormComponent } from 'pos-feature-shell/pos-product-form/pos-product-form.component';
import { PosSalesComponent } from 'pos-feature-shell/pos-sales/pos-sales.component';

@Component({
  selector: 'org-pos-feature-shell',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    PosCashierComponent,
    PosProductFormComponent,
    PosSalesComponent,
  ],
  templateUrl: './pos-feature-shell.component.html',
  styleUrls: ['./pos-feature-shell.component.css'],
})
export class PosFeatureShellComponent {}
