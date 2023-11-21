import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { PosCashierComponent } from 'pos-feature-shell/pos-cashier/pos-cashier.component';
import { PosProductFormComponent } from 'pos-feature-shell/pos-product-form/pos-product-form.component';
import { PosSalesComponent } from 'pos-feature-shell/pos-sales/pos-sales.component';
import {
  ProductsFacade
} from '../pos-data-access/pos-data-access.facade';
import { ProductsTableComponent } from '../products-table/products-table.component';

@Component({
  selector: 'org-pos-feature-shell',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    PosCashierComponent,
    PosProductFormComponent,
    ProductsTableComponent,
    PosSalesComponent,
  ],
  providers: [ProductsFacade],
  templateUrl: './pos-feature-shell.component.html',
  styleUrls: ['./pos-feature-shell.component.css'],
})
export class PosFeatureShellComponent {
  products = [];

  // constructor(private productsFacade: ProductsFacade) {
  //   this.productsFacade.products$.subscribe((details: any) => {
  //     this.products = details;
  //     console.log(this.products);
  //   });
  // }
}
