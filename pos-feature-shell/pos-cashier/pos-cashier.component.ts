import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import * as uuid from 'uuid';
import * as moment from 'moment';
import { PRODUCT_FACADE_TOKEN } from '@org/pos-feature-shell';

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'org-pos-cashier',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './pos-cashier.component.html',
  styleUrls: ['./pos-cashier.component.scss'],
})
export class PosCashierComponent {
  cashierFormGroup = this.formBuilder.group(
    {
      productId: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required]),
    },
    [Validators.required]
  );
  productList = signal<Product[]>([]);
  valueInTotal = signal<number>(0);
  displayedColumns: string[] = ['id', 'name', 'price', 'quantity'];

  constructor(private formBuilder: FormBuilder) {}

  generateTotal() {
    let total = 0;

    this.productList().forEach((product: any) => {
      total += product.price * product.quantity;
    });

    this.valueInTotal.set(total);
  }

  confirmTransaction() {
    const items = this.productList();
    const payload = {
      id: uuid.v4(),
      items,
      date: moment(new Date()).format('YYYY-DD-MM'),
      amount: this.valueInTotal(),
    };
    console.log(payload);
  }

  handleEnterProduct() {
    const formStatus = this.cashierFormGroup.status;
    const formValue = this.cashierFormGroup.value;
    const isValidForm = formStatus === 'VALID';

    if (isValidForm) {
      const product: Product = {
        id: formValue.productId || '',
        quantity: formValue.quantity || 0,
        price: 5.45,
        name: 'test',
      };
      this.productList.set([...this.productList(), product]);
    }

    this.generateTotal();
    console.log(this.productList());
  }
}
