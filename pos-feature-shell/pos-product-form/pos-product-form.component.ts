import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ProductsFacade } from '@org/pos-feature-shell';

@Component({
  selector: 'org-pos-product-form',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],

  templateUrl: './pos-product-form.component.html',
  styleUrls: ['./pos-product-form.component.scss'],
})
export class PosProductFormComponent {
  displayedColumns: string[] = ['id', 'name', 'stock', 'price'];
  productsFormGroup = this.formBuilder.group({});
  dataSource: any = [];

  constructor(
    private productsFacade: ProductsFacade,
    private formBuilder: FormBuilder
  ) {
    this.productsFacade.products$.subscribe((details: any) => {
      this.dataSource = details;
    });
  }
}
