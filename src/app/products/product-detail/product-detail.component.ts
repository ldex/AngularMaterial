import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { Product } from '../product.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  @Input() product: Product;
  @ViewChild('dialog', {static: false}) dialogTemplate: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private dialog: MatDialog) { }

  ngOnInit() {
    let id = + this.route.snapshot.params["id"];
    if(id) {
      this
        .productService
        .getProductById(id)
        .subscribe(
          result => this.product = result
        )
    }
  }

  confirmDeleteProduct(id: number) {
    let dialogRef = this.dialog.open(this.dialogTemplate);
    dialogRef.afterClosed().subscribe(deleteConfirmed => {
      if (deleteConfirmed) {
        this.deleteProduct(id);
      }
    });
  }

  deleteProduct(id: number) : void {
      this
        .productService
        .deleteProduct(id)
        .subscribe(
          () => {
            this.productService.ConfirmAndLog('Product deleted!');
            this.productService.clearCache();
            this.router.navigateByUrl('/products');
          },
          error => this.productService.ConfirmAndLog('Could not delete product! ' + error)
        )
  }

}
