import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewEncapsulation, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import * as moment from 'moment';
import * as uuid from 'uuid';

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
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
  ],
  encapsulation: ViewEncapsulation.Emulated,
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
  cashFormGroup = this.formBuilder.group({
    cash: new FormControl(null, [Validators.required]),
  });
  changeAmount = signal(0);
  productList = signal<Product[]>([]);
  valueInTotal = signal<number>(0);
  displayedColumns: string[] = ['id', 'name', 'price', 'quantity'];
  @ViewChild('confirmDialog') confirmDialog: any;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog) {
    console.log(this.productList().length);
  }

  generateTotal() {
    let total = 0;
    this.productList().forEach((product: any) => {
      total += product.price * product.quantity;
    });
    this.valueInTotal.set(total);
  }

  checkConfirmTransaction() {
    this.dialog.open(this.confirmDialog, {
      width: '500px',
      height: '600px',
    });
  }

  onCashChange() {
    const cashAmount = this.cashFormGroup.value['cash'] || 0;
    const change = this.valueInTotal() - cashAmount;
    this.changeAmount.set(change);
  }

  confirmTransaction() {
    const items = this.productList();
    const cashAmount = this.cashFormGroup.value?.['cash'];
    const payload = {
      id: uuid.v4(),
      items,
      date: moment(new Date()).format('YYYY-DD-MM'),
      amount: Number(this.valueInTotal()),
      cashAmount: Number(cashAmount),
      change: Number(this.changeAmount()),
    };

    this.resetPageDetails();

    console.log(payload);
  }

  resetPageDetails() {
    this.productList.set([]);
    this.valueInTotal.set(0);
    this.changeAmount.set(0);
    this.cashierFormGroup.reset();
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
