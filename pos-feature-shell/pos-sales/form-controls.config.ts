export const SALES_FILTER_FORM_CONTROLS = [
  {
    id: 'filter_value',
    placeholder: 'Filter...',
    type: 'text',
    required: true,
  },
  {
    id: 'filter_type',
    placeholder: 'Type',
    type: 'dropdown',
    required: true,
    options: [
      { value: 'date', label: 'Date' },
      { value: 'amount', label: 'Sale Amount' },
      { value: 'cashAmount', label: 'Cash Amount' },
    ],
  },
];

export const SALES_MONTHLY_INCOME_FORM_CONTROLS = {};

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
