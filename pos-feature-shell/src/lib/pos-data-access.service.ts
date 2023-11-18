import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'any',
})
export class PosDataAccessService {
  apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  updateJSON(payload: any) {
    return this.http.post(`${this.apiUrl}/product/update/`, payload);
  }

  getDataFromFile() {
    return this.http.get(`${this.apiUrl}/product/store/`);
  }
}
