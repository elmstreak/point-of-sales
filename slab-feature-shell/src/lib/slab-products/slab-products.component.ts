/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { SlabProductService } from '../slab-service.service';
import { Observable } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'org-slab-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './slab-products.component.html',
  styleUrls: ['./slab-products.component.scss'],
})
export class SlabProductsComponent {
  searchProductControl = new FormControl('');

  products$: Observable<any>;

  constructor(private slabProductService: SlabProductService) {
    this.products$ = this.slabProductService.getAllProducts();
  }
}
