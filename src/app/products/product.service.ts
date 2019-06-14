import { Injectable } from '@angular/core';
import { Product } from './product.interface';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, shareReplay, first, flatMap, delay } from "rxjs/operators";
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string = 'http://storerestservice.azurewebsites.net/api/products/';
  private products$: Observable<Product[]>;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar) { }

  insertProduct(newProduct: Product): Observable<Product> {
    return this
            .http
            .post<Product>(this.baseUrl, newProduct);
  }

  deleteProduct(id: number): Observable<any> {
    return this
            .http
            .delete(this.baseUrl + id); // Delete product from the server            
  }

  getProductById(id: number): Observable<Product> {
    return this
            .getProducts()
            .pipe(
              flatMap(p => p),
              first(product => product.id === id),
              catchError(this.handleError)
            )
  }
 
  getProducts() : Observable<Product[]> {
    let url:string = this.baseUrl + `?$orderby=ModifiedDate%20desc`;

    if(!this.products$) {
      this.products$ = this
                        .http
                        .get<Product[]>(url)
                        .pipe(
                          shareReplay(),
                          catchError(this.handleError)
                        );
    }
    return this.products$;
  }

  clearCache() {
    this.products$ = null;
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMsg: string;
    if (errorResponse.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        errorMsg = 'An error occurred:' + errorResponse.error.message;
    } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        errorMsg = `Backend returned code ${errorResponse.status}, body was: ${errorResponse.error}`;
    }
    console.error(errorMsg);
    return throwError(errorMsg);
  }

  ConfirmAndLog(message: string, actionLabel: string = 'ok', durationInMs: number = 1600): void {
    this.snackBar.open(message, actionLabel, {
      duration: durationInMs,
    });
    console.log(message);
  }
}
