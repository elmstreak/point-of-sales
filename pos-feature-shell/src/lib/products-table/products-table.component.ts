/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, Input, WritableSignal, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Observable, of, switchMap } from 'rxjs';
import { ProductsFacade } from '../pos-data-access/pos-data-access.facade';
import { MatDividerModule } from '@angular/material/divider';

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
export class ProductsTableComponent {
  @Input() dataSource!: Observable<any>;
  @Input() displayedColumns: string[] = [];

  dataSourceCopy$: WritableSignal<any> = signal(of([]));
  filterFormControl = new FormControl('');

  constructor() {
    this.dataSourceCopy$.set(this.dataSource);

    this.filterFormControl.valueChanges.subscribe((productId: any) => {
      console.log(productId);
      if (productId) {
        this.dataSource = this.dataSource.pipe(
          switchMap((details: any) => {
            const filteredData = details.filter(
              (data: any) => data.id === productId.toUpperCase()
            );
            console.log(filteredData);
            return of(filteredData);
          })
        );
      } else {
        // this.dataSource = this.dataSourceCopy$;
      }
    });
  }

  resetFilter() {
    this.filterFormControl.setValue('');
  }
}
