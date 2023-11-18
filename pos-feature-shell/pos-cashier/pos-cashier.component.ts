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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductsFacade } from '@org/pos-feature-shell';
import { map, some } from 'lodash';
import * as moment from 'moment';
import { PosDataAccessService } from 'pos-feature-shell/src/lib/pos-data-access.service';
import {
  Product,
  ProductCartDetails,
} from 'pos-feature-shell/src/lib/pos-data-access/pos-data-access.models';
import { Observable, of, switchMap, take } from 'rxjs';
import * as uuid from 'uuid';

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
    MatToolbarModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './pos-cashier.component.html',
  styleUrls: ['./pos-cashier.component.scss'],
})
export class PosCashierComponent {
  @ViewChild('confirmDialog') confirmDialog: any;
  @ViewChild('enterProduct') enterProductDialog: any;

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
  productList = signal<ProductCartDetails[]>([]);
  valueInTotal = signal<number>(0);
  productError = signal('');
  displayedColumns: string[] = ['id', 'name', 'price', 'quantity'];
  enterProductDialogRef: any;
  products$ = new Observable<any>();

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private productsFacade: ProductsFacade,
    private posService: PosDataAccessService,
    private snackbar: MatSnackBar
  ) {
    this.products$ = this.productsFacade.products$;
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
      width: '600px',
      height: '500px',
    });
  }

  showEnterProductsDialog() {
    this.enterProductDialogRef = this.dialog.open(this.enterProductDialog, {
      width: '500px',
    });
  }

  onCashChange() {
    const cashAmount = this.cashFormGroup.value['cash'] || 0;
    const change = this.valueInTotal() - cashAmount;
    this.changeAmount.set(change);
  }

  confirmTransaction() {
    const items: any = this.productList();
    const cashAmount = this.cashFormGroup.value?.['cash'];

    const payload = {
      id: uuid.v4(),
      items,
      date: moment(new Date()).format('YYYY-MM-DD'),
      amount: Number(this.valueInTotal()),
      cashAmount: Number(cashAmount),
      change: Number(this.changeAmount()),
    };

    this.productsFacade.store$
      .pipe(
        take(1),
        switchMap((details: any) => {
          const transactions = [...details?.transactions, payload];
          const existingProducts = details?.products;
          const updatedProductDetails = map(items, (item: any) => {
            const filteredProduct = existingProducts
              ?.filter((product: any) => product?.id === item.id)
              .shift();
            return {
              ...filteredProduct,
              stock: filteredProduct.stock - item.quantity,
            };
          });

          // const updatedProductList = map(existingProducts, (product) => {
          //   const updatedProduct = updatedProductDetails
          //     ?.filter((details: any) => details?.id === product?.id)
          //     ?.shift();

          //   if (updatedProduct) {
          //     return updatedProduct;
          //   }

          //   return product;
          // });

          const updatedProducts = {
            ...details,
            products: updatedProductDetails,
            transactions: transactions,
          };

          this.productsFacade.updateProductStore(updatedProducts);
          return of(updatedProducts);
        }),
        switchMap((details) => {
          return this.posService.updateJSON(details);
        })
      )
      .subscribe((details: any) => {
        const message = details['response'];
        if (message === 'OK') {
          this.snackbar.open('Transaction complete!', 'Close');
        }
      });

    this.resetPageDetails();
  }

  checkProductExistence() {}

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
      this.products$.subscribe((products: any) => {
        const productDetails = products
          ?.filter(
            (product: any) => product?.id === formValue.productId.toUpperCase()
          )
          .shift();
        const isProductExist = some(products, {
          id: formValue.productId.toUpperCase(),
        });
        const isStockEnough = productDetails?.stock >= formValue.quantity;

        if (isProductExist && isStockEnough) {
          //check if item already exist then increment quantity
          const isItemExist = some(
            this.productList(),
            (details: any) => details.id === formValue.productId.toUpperCase()
          );

          if (isItemExist) {
            const duplicateProductEntryDetails: Product | any =
              this.productList()
                .filter(
                  (details: any) =>
                    details?.id === formValue.productId.toUpperCase()
                )
                .shift();
            const updatedDuplicateProductEntryDetails = {
              ...duplicateProductEntryDetails,
              quantity:
                duplicateProductEntryDetails?.quantity + formValue.quantity,
            };
            const productListWithNoDuplicate = this.productList().filter(
              (details: any) =>
                details?.id !== formValue.productId.toUpperCase()
            );

            this.productList.set([
              ...productListWithNoDuplicate,
              updatedDuplicateProductEntryDetails,
            ]);
          } else {
            // create a new entry
            const cartItemDetails: ProductCartDetails = {
              id: formValue.productId.toUpperCase() || '',
              quantity: formValue.quantity || 0,
              price: productDetails?.price,
              name: productDetails?.name,
            };

            this.productList.set([...this.productList(), cartItemDetails]);
          }

          // update product list and reset form

          this.cashierFormGroup.reset();
          this.productError.set('');
          this.enterProductDialogRef.close();
        } else {
          this.productError.set(
            !isStockEnough && isProductExist
              ? `You only have ${productDetails?.stock} remaining stock left.`
              : 'Product ID does not exist'
          );
        }
      });
    }

    this.generateTotal();
  }
}
