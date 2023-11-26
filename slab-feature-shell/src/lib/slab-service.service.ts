/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SlabProductService {
  constructor(private httpClient: HttpClient) {
    // console.log(this.env);
  }

  getAllProducts() {
    // get all product based on location -- WIP
    return this.httpClient.get('http://localhost:3333/products');
  }
}
