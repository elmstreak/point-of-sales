import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
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
import { each } from 'lodash';
import { PosDataAccessService } from 'pos-feature-shell/src/lib/pos-data-access.service';
import { filter, of, switchMap, take } from 'rxjs';
import { PRODUCT_FORM_CONTROLS } from './form-controls.config';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

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
  ],
  providers: [PosDataAccessService],
  templateUrl: './pos-product-form.component.html',
  styleUrls: ['./pos-product-form.component.scss'],
})
export class PosProductFormComponent {
  @ViewChild('addProduct') addProductDialog: any;

  filterFormControl = new FormControl('');

  dialogSize = { width: '350px', height: 'auto' };
  products$: any;
  displayedColumns: string[] = ['id', 'name', 'stock', 'price'];
  formControls = PRODUCT_FORM_CONTROLS;
  dataSource: any = [];
  databaseCopy$: any;
  addDialogRef: any;
  productsFormGroup = this.formBuilder.group({});

  constructor(
    private productsFacade: ProductsFacade,
    private formBuilder: FormBuilder,
    private posService: PosDataAccessService,
    private matDialog: MatDialog
  ) {
    this.products$ = this.productsFacade.products$;
    this.filterFormControl.valueChanges.subscribe((filterValue: any) => {
      if (filterValue) {
        this.products$ = this.productsFacade.products$.pipe(
          switchMap((products: any) => {
            const filteredProducts = products.filter((product: any) =>
              product?.id?.includes(filterValue)
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

    if (status === 'VALID') {
      this.productsFacade.addProduct({
        id: payload.product_id,
        stock: payload.product_stock,
        name: payload.product_name,
        price: payload.product_price,
      });

      this.updateDataOnFile();
      this.productsFormGroup.reset();
      this.addDialogRef.close();
    }
  }

  updateDataOnFile() {
    this.productsFacade.store$.pipe(take(1)).subscribe((storeData: any) => {
      this.posService.updateProduct(storeData).subscribe((details) => {
        console.log(details);
      });
    });
  }

  buildControls() {
    each(this.formControls, (details) => {
      this.productsFormGroup.addControl(
        details.id,
        this.formBuilder.control(null, [Validators.required])
      );
    });
  }

  // dialog functions

  showAddProductForm() {
    this.addDialogRef = this.matDialog.open(this.addProductDialog, {
      height: this.dialogSize.height,
      width: this.dialogSize.width,
    });
  }
}
