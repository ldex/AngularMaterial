import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../product.interface';
import { ProductService } from '../product.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  displayedColumns = ['id', 'name', 'description', 'price'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource();

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  title: string = 'Products';
  products$: Observable<Product[]>;
  isLoading: boolean = false;
  
  onSelect(product: Product) {
    this.router.navigateByUrl('/products/' + product.id);
  }

  constructor(
    private productService: ProductService,
    private router: Router) {
   
   }

  ngOnInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.products$ = this.productService.getProducts();

    this.isLoading = true;
    this
      .products$
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe(
        data => this.dataSource.data = data 
      )
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
