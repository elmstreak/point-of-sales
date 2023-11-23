/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Observable, of, switchMap } from 'rxjs';
import { ProductsFacade } from '../pos-data-access/pos-data-access.facade';

@Component({
  selector: 'org-products-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
  ],
  providers: [ProductsFacade],
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss'],
})
export class ProductsTableComponent implements OnInit {
  @Input() dataSource!: Observable<any>;
  @Input() displayedColumns: string[] = [];

  dataSourceCopy: any;
  filterFormControl = new FormControl('');

  constructor(
    private changeDetector: ChangeDetectorRef,
    private productFacade: ProductsFacade
  ) {
    this.dataSourceCopy = this.dataSource;
    this.filterFormControl.valueChanges.subscribe((productId: any) => {
      if (productId) {
        this.dataSource = this.productFacade.products$.pipe(
          switchMap((products: any) => {
            const filteredProducts = products.filter((details: any) => {
              return details?.id?.includes(productId);
            });
            return of(filteredProducts);
          })
        );
      } else {
        this.dataSource = this.productFacade.products$;
      }
    });
  }

  ngOnInit(): void {
    this.changeDetector.detectChanges();
  }

  resetFilter() {
    this.filterFormControl.setValue('');
  }
}
