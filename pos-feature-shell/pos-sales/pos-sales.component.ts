import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  ViewChild,
  WritableSignal,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ProductsFacade } from '@org/pos-feature-shell';
import { each, reduce } from 'lodash';
import * as moment from 'moment';
import { Observable, of, switchMap, take } from 'rxjs';
import { MY_FORMATS, SALES_FILTER_FORM_CONTROLS } from './form-controls.config';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'org-pos-sales',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatListModule,
    FormsModule,
    MatNativeDateModule,
    MatIconModule,
    RouterModule,
    MatDatepickerModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS,
    },
  ],
  templateUrl: './pos-sales.component.html',
  styleUrls: ['./pos-sales.component.scss'],
})
export class PosSalesComponent {
  @ViewChild('itemsDialog') itemsDialog: any;
  @ViewChild('monthlyIncomeDialog') monthlyIncomeDialog: any;

  formControls = SALES_FILTER_FORM_CONTROLS;
  searchFormGroup: FormGroup = this.formBuilder.group({});
  monthlyIncomeDateControl = new FormControl(moment());
  monthlyIncome = signal(0);
  transactions$ = new Observable<any>();
  filterTypeValue: WritableSignal<string> = signal('');
  displayedColumns: string[] = [
    'date',
    'amount',
    'cashAmount',
    'change',
    'items',
  ];
  salesItemColumns: string[] = ['id', 'name', 'price', 'quantity'];
  isFilterOn = signal(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productsFacade: ProductsFacade,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.transactions$ = this.productsFacade.transactions$;
    this.buildFormGroup();

    this.searchFormGroup.controls['filter_type']?.valueChanges.subscribe(
      (filterType: string) => {
        if (filterType === 'date') {
          this.filterTypeValue.set(filterType);
        } else {
          this.filterTypeValue.set('');
        }
      }
    );

    this.searchFormGroup.controls['filter_value']?.valueChanges.subscribe(
      (filterValue: any) => {
        if (filterValue === '') {
          this.transactions$ = this.productsFacade.transactions$;
        }
      }
    );
  }

  showItemsDialog(items: any) {
    this.dialog.open(this.itemsDialog, {
      width: '500px',
      data: { items: of(items) },
    });
  }

  clearFilters() {
    this.searchFormGroup.setValue({
      filter_value: '',
      filter_type: '',
    });

    this.searchFormGroup.updateValueAndValidity();
    setTimeout(() => {
      this.isFilterOn.set(false);
    }, 500);
  }

  handleSearchFilter() {
    const formValue: any = this.searchFormGroup.value;
    const isFormValid = this.searchFormGroup.valid;

    if (isFormValid) {
      switch (formValue.filter_type) {
        case 'date':
          this.transactions$ = this.productsFacade.transactions$.pipe(
            switchMap((details: any) => {
              return of(
                details.filter((transaction: any) => {
                  return transaction.date.includes(formValue.filter_value);
                })
              );
            })
          );
          break;
        case 'amount':
          this.transactions$ = this.productsFacade.transactions$.pipe(
            switchMap((details: any) => {
              return of(
                details.filter((transaction: any) => {
                  return transaction.amount >= Number(formValue.filter_value);
                })
              );
            })
          );
          break;
        default:
          this.transactions$ = this.productsFacade.transactions$.pipe(
            switchMap((details: any) => {
              return of(
                details.filter((transaction: any) => {
                  return (
                    transaction.cashAmount >= Number(formValue.filter_value)
                  );
                })
              );
            })
          );
          break;
      }

      this.isFilterOn.set(true);
    }
  }

  checkSoldItems(formattedDate: any, searchBtn: MatButton) {
    this.searchFormGroup.setValue({
      filter_type: 'date',
      filter_value: formattedDate,
    });

    searchBtn._elementRef.nativeElement.click();
    this.isFilterOn.set(true);
  }

  buildFormGroup() {
    each(this.formControls, (details: any) => {
      this.searchFormGroup.addControl(
        details.id,
        new FormControl('', [Validators.required])
      );
    });
  }

  getCalendarValue() {
    const value = this.monthlyIncomeDateControl.value;

    const formattedDate = value?.format('YYYY-MM').trim();

    this.productsFacade.transactions$
      .pipe(take(1))
      .subscribe((details: any) => {
        const transactionsOnDateChosen = details.filter((details: any) =>
          details.date.includes(formattedDate)
        );
        const monthlyIncome = reduce(
          transactionsOnDateChosen,
          (acc: any, current: any) => {
            return acc + current.amount;
          },
          0
        );
        this.monthlyIncome.set(Number(monthlyIncome));
        this.showMonthlyIncomeDialog(formattedDate);
      });
  }

  showMonthlyIncomeDialog(formattedDate: any) {
    this.dialog.open(this.monthlyIncomeDialog, {
      width: '650px',
      height: '250px',
      autoFocus: false,
      data: {
        month: moment(this.monthlyIncomeDateControl.value).format('MMMM'),
        year: moment(this.monthlyIncomeDateControl.value).format('YYYY'),
        formattedDate,
      },
    });
  }

  setMonthAndYear(
    normalizedMonthAndYear: moment.Moment,
    datepicker: MatDatepicker<moment.Moment>
  ) {
    const ctrlValue = this.monthlyIncomeDateControl.value!;
    ctrlValue.month(normalizedMonthAndYear?.month());
    ctrlValue.year(normalizedMonthAndYear?.year());
    this.monthlyIncomeDateControl.setValue(ctrlValue);
    datepicker.close();
  }
}
