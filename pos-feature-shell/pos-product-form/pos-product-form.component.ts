import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ProductsFacade, addProduct } from '@org/pos-feature-shell';
import { each, map, some, update } from 'lodash';
import { PosDataAccessService } from 'pos-feature-shell/src/lib/pos-data-access.service';
import { combineLatest, filter, of, switchMap, take } from 'rxjs';
import {
  PRODUCT_DELETE_FORM_CONTROLS,
  PRODUCT_FORM_CONTROLS,
  PRODUCT_UPDATE_STOCK_FORM_CONTROLS,
} from './form-controls.config';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ProductAdminStore } from 'pos-feature-shell/src/lib/pos-data-access/pos-data-access.models';
import * as moment from 'moment';

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
    MatIconModule,
    HttpClientModule,
    MatTooltipModule,
    MatToolbarModule,
    MatDialogModule,
    MatDividerModule,
  ],
  providers: [PosDataAccessService],
  templateUrl: './pos-product-form.component.html',
  styleUrls: ['./pos-product-form.component.scss'],
})
export class PosProductFormComponent {
  @ViewChild('addProduct') addProductDialog: any;
  @ViewChild('deleteProduct') deleteProductDialog: any;
  @ViewChild('updateStock') updateStockDialog: any;

  formControls = PRODUCT_FORM_CONTROLS;
  deleteFormControls = PRODUCT_DELETE_FORM_CONTROLS;
  updateStockFormControls = PRODUCT_UPDATE_STOCK_FORM_CONTROLS;
  productsFormGroup = this.formBuilder.group({});
  updateStockFormGroup = this.formBuilder.group({});
  filterFormControl = new FormControl('');
  deleteFormControl = new FormControl('', [Validators.required]);
  existingProductList: any = [];

  products$: any;
  displayedColumns: string[] = ['id', 'name', 'stock', 'price', 'date_created'];
  dialogSize = { width: '350px', height: 'auto' };

  dataSource: any = [];
  databaseCopy$: any;
  dialogRef: any;
  updatedStoreDataContainer: any = {};
  updatedStoreDataCopy: ProductAdminStore | any = signal({});
  productStockError = signal(false);
  isItemExistError = signal(false);

  constructor(
    private productsFacade: ProductsFacade,
    private formBuilder: FormBuilder,
    private posService: PosDataAccessService,
    private matDialog: MatDialog
  ) {
    this.productsFacade.products$.subscribe((products) => {
      this.products$ = of(products);
      this.existingProductList = products;
    });
    this.filterFormControl.valueChanges.subscribe((filterValue: any) => {
      if (filterValue) {
        this.products$ = this.productsFacade.products$.pipe(
          switchMap((products: any) => {
            const filteredProducts = products.filter((product: any) =>
              product?.id?.includes(filterValue.toUpperCase())
            );
            return of(filteredProducts);
          })
        );
      } else {
        this.products$ = this.productsFacade.products$;
      }
    });
    this.buildControls();
  }

  uploadProduct() {
    const status: any = this.productsFormGroup.status;
    const payload: any = this.productsFormGroup.value;

    const isProductExistAlready = some(
      this.existingProductList,
      (details: any) => details.id === payload.product_id.toUpperCase()
    );

    if (status === 'VALID' && !isProductExistAlready) {
      this.productsFacade.addProduct({
        id: payload.product_id.toUpperCase(),
        stock: payload.product_stock,
        name: payload.product_name.toUpperCase(),
        price: payload.product_price,
        date_created: moment(new Date()).format('YYYY-MM-DD'),
      });

      this.updateDataOnFile();
      this.productsFormGroup.reset();
      this.isItemExistError.set(false);
      this.dialogRef.close();
    }

    if (isProductExistAlready) {
      this.isItemExistError.set(true);
    }
  }

  updateDataOnFile() {
    this.productsFacade.store$
      .pipe(
        switchMap((storeData: any) => {
          return this.posService.updateJSON(storeData);
        })
      )
      .subscribe((updateProductResponse: any) => {
        console.log(updateProductResponse);
      });
  }

  deleteProductId() {
    const isDeleteFormValid = this.deleteFormControl.valid;
    const productId = this.deleteFormControl.value?.toUpperCase();

    if (isDeleteFormValid) {
      this.updateDeleteProductFromStore(productId);
      this.dialogRef.close();
    }
  }

  updateProductStock() {
    const isFormValid = this.updateStockFormGroup.valid;
    const formValue: { product_id: string; stock: number } | any =
      this.updateStockFormGroup.value;

    if (isFormValid) {
      this.productsFacade.store$
        .pipe(
          take(1),
          switchMap((storeData: any) => {
            const products = storeData?.products || [];
            const specificProduct = products
              ?.filter(
                (details: any) =>
                  details.id === formValue.product_id.toUpperCase()
              )
              .shift();

            if (specificProduct?.id) {
              const updatedProducts = map(products, (product: any) => {
                if (product.id === formValue.product_id.toUpperCase()) {
                  return {
                    ...product,
                    stock: Number(product.stock) + Number(formValue.stock),
                  };
                }

                return product;
              });
              const updatedStoreData = {
                ...storeData,
                products: updatedProducts,
              };
              this.updatedStoreDataCopy.set(updatedStoreData);
              return of(updatedStoreData);
            }

            return of(false);
          }),
          switchMap((updatedStoreData: any) => {
            if (updatedStoreData?.products) {
              this.productsFacade.updateProductStore(updatedStoreData);
              return this.posService.updateJSON(updatedStoreData);
            }

            return of(false);
          })
        )
        .subscribe((response: any) => {
          if (!response) {
            this.productStockError.set(true);
          } else {
            this.updateStockFormGroup.reset();
            this.productStockError.set(false);
            this.dialogRef.close();
          }
        });
    }
  }

  updateDeleteProductFromStore(productId: any) {
    this.productsFacade.store$
      .pipe(
        switchMap((storeData: any) => {
          console.log(storeData);
          const productDetails = storeData?.products
            ?.filter((product: any) => product?.id === productId)
            .shift();

          const filteredProducts = storeData?.products?.filter(
            (product: any) => product?.id !== productId
          );

          if (productDetails) {
            return of({
              ...storeData,
              products: filteredProducts,
            });
          }

          return of(false);
        }),
        switchMap((updatedStoreData: any) => {
          if (updatedStoreData?.products) {
            this.updatedStoreDataContainer = updatedStoreData;
            this.productsFacade.updateProductStore(updatedStoreData);
            return this.posService.updateJSON(updatedStoreData);
          }

          return of(false);
        })
      )
      .subscribe((data: any) => {
        console.log(data);
      });
  }

  buildControls() {
    each(this.formControls, (details) => {
      this.productsFormGroup.addControl(
        details.id,
        this.formBuilder.control(null, [Validators.required])
      );
    });

    each(this.updateStockFormControls, (details) => {
      this.updateStockFormGroup.addControl(
        details.id,
        this.formBuilder.control(null, [Validators.required])
      );
    });
  }

  // dialog functions
  showAddProductForm() {
    this.dialogRef = this.matDialog.open(this.addProductDialog, {
      height: this.dialogSize.height,
      width: this.dialogSize.width,
    });
  }

  showDeleteProductForm() {
    this.dialogRef = this.matDialog.open(this.deleteProductDialog, {
      height: this.dialogSize.height,
      width: this.dialogSize.width,
    });
  }

  showUpdateStockForm() {
    this.dialogRef = this.matDialog.open(this.updateStockDialog, {
      height: this.dialogSize.height,
      width: this.dialogSize.width,
    });
  }
}
