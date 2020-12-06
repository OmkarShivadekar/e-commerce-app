import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumer: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  
  previousKeyword: string = null;
  
  
  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })    
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    console.log('inside product list component having keyword:'+this.searchMode);

    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
    
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    //if we have a different keyword than previous
    //thet set thePageNumber to 1
    if(this.previousKeyword != theKeyword){
      this.thePageNumer = 1;
    }

    this.previousKeyword = theKeyword;
    
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumer}`);

    //search for the products using keyword
    this.productService.searchProductPaginate(this.thePageNumer - 1,
                                                this.thePageSize,
                                                theKeyword).subscribe(this.processResult());
                                                
    
  }

  handleListProducts(){

    //check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      //get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }else{
      //not available category id ... default set it to 1
      this.currentCategoryId = 1;
    }

    //check if we have different category than previous
    //Note: Angular will resuse a component if it is currently being viewed

    //if we have a different category id than previous 
    //then set thePageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumer=1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId = ${this.currentCategoryId}, thePageNumber = ${this.thePageNumer}`);

  //get the product for the given category id
    this.productService.getProductListPaginate(this.thePageNumer - 1,
                                                this.thePageSize,
                                                this.currentCategoryId)
                                                .subscribe(this.processResult());

  }

  processResult(){
    return data => {
      this.products = data._embedded.products;
      this.thePageNumer = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumer = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product){
    console.log(`Adding to cart: ${theProduct.name}. ${theProduct.unitPrice}`);

    //TODO
    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);

  }
}
