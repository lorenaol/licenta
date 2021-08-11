import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {ShoppingCart} from "@app/entities/shoppingcart";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {environment} from "@environments/environment";
import {UserService} from "@app/services/user.service";
import {Product} from "@app/entities/product";
import {User, UserWithAuthoritiesDto} from "@app/entities/user";
import {Role} from "@app/entities/role";
import {NgbDate, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AppComponent} from "@app/app.component";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";

type EntityResponseType = HttpResponse<ShoppingCart>;
type EntityArrayResponseType = HttpResponse<ShoppingCart[]>;

@Injectable({
  providedIn: 'root'
})
export class Shopping_cartService {

  private readonly SHOPPING_CART_URL = environment.apiUrl + 'shoppingcart';
 // currentUserName : string = localStorage.getItem('user') != null?
  //  localStorage.getItem('user')!.split(`"`)[3] : 'unauthenticatedUser';
  //userName : string = localStorage.getItem('user')!.split(`"`)[3];
  inputProduct?: Product
  private productsSubject: BehaviorSubject<Product[] | null>;
  public productsCurrentUser? : Observable<Product[] | null>;
  private loginDialog: NgbModalRef | null;
  shoppingCart = new ShoppingCart();
  shoppingCarts? : ShoppingCart[] | null

  constructor(private http: HttpClient,
              private userService: UserService) {
    let products;
    this.getProductsByUserName('unauthenticatedUser').subscribe((data:HttpResponse<ShoppingCart[]>) => {
      products = data.body;
    });
    this.productsSubject = new BehaviorSubject<Product[] | null>(products?  products : null);
    this.productsCurrentUser = this.productsSubject.asObservable();
    this.loginDialog = null;
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  products: Product[] = [];

  init(product: any): void {
    this.products = JSON.parse(localStorage.getItem('products')!);
    this.products.push(product);
    localStorage.setItem('products', JSON.stringify(this.products));
    this.inputProduct = product;
    (async () => {
      this.updateCart();
      await this.delay(1000);
      //this.f();
      this.setQuantity();
      await  this.delay(1000);
      this.call();
      //await this.delay(1000);
   //   this.g();
      //this.updateCart();
      //await  this.delay(1000);
     // this.getProducts();
    })();
  }
  currentShoppingCarts : ShoppingCart[] | null = [];
  set() : void {
    let currentName = localStorage.getItem('user') != null? localStorage.getItem('user')!.split(`"`)[3] : 'unauthenticatedUser';
    this.getShoppingCartsByUserName(currentName).subscribe((data:HttpResponse<ShoppingCart[]>) => {
     this.currentShoppingCarts = data.body;
    });
  }
  get() : ShoppingCart[] | null {
    return  this.currentShoppingCarts;
  }
  getProducts(): void {
    if(localStorage.getItem('user') != null) {
       this.getProductsByUserName(localStorage.getItem('user')!.split(`"`)[3]).subscribe((data:HttpResponse<Product[]>) => {
         this.productsSubject.next(data.body);
        // console.log(data.body)
       });
    } else {
      this.getProductsByUserName('unauthenticatedUser').subscribe((data:HttpResponse<Product[]>) => {
        this.productsSubject.next(data.body);
      });
    }

  }

  updateCart(): void {
    if(localStorage.getItem('user') != null) {
     // console.log("de ce intra aici")
      this.getShoppingCartsByUserName("unauthenticatedUser").subscribe((data:HttpResponse<ShoppingCart[]>) => {
       // console.log(data.body)
        if(data.body?.length != 0) {
          //console.log(data.body?.length)
          for(let shoppingCart of data.body!) {
           shoppingCart.user = this.shoppingCart.user;
          this.updateShoppingCart(shoppingCart).subscribe((data : HttpResponse<ShoppingCart>) => {
              //console.log(data.body)
            });
          }
        }
      })
    }
  }
  find?:boolean
  setQuantity() : void {
    this.find = false;
    let currentUserName = localStorage.getItem('user') != null?
        localStorage.getItem('user')!.split(`"`)[3] : 'unauthenticatedUser';
    this.getShoppingCartsByUserName( currentUserName).subscribe((data:HttpResponse<ShoppingCart[]>) => {
      this.shoppingCarts = data.body;
        if(data.body?.length != 0) {
          for(let shoppingCart of data.body!) {
            if(shoppingCart.product?.id == this.inputProduct?.id) {
              this.find = true;
             // console.log("aici ar trebui")
              shoppingCart.quantity! += 1;
             // console.log(shoppingCart)
              this.updateShoppingCart(shoppingCart).subscribe((data : HttpResponse<ShoppingCart>) => {});
              return;
            }
          }
        }
      })
  }
  delete(product?:Product): void {

    let currentUserName = localStorage.getItem('user') != null?
      localStorage.getItem('user')!.split(`"`)[3] : 'unauthenticatedUser';
    this.getShoppingCartsByUserName( currentUserName).subscribe((data:HttpResponse<ShoppingCart[]>) => {
      if(data.body?.length != 0) {
        for(let shoppingCart of data.body!) {
          if(shoppingCart.product?.id == product?.id) {
            this.deleteShoppingCart(shoppingCart).subscribe();
          }
        }
      }
    })
  }
  call():void {
    if(!this.find) {
     // console.log("aici nu");
      (async () => {
        this.shoppingCart.quantity = 1;
        this.f();
        await this.delay(1000);
        this.g();
        this.getProducts();
      })();

    }
  }

  f(): void {
    this.shoppingCart.product = this.inputProduct;
    if(localStorage.getItem('user') == null) {
      const user = new User();
      user.id = 50;
      user.name = "unauthenticatedUser";
      user.email = "-";
      user.password = "-";
      user.is_active = false;
      user.address = "-";
      user.end_date = new Date();
      user.start_date = new Date();
      user.latitude = 0;
      user.longitude = 0;
      this.userService.addUser(user).subscribe((data:HttpResponse<User>) => {
        this.shoppingCart.user = data.body;
      });

    } else {
      this.userService.getUsersByName(localStorage.getItem('user')!.split(`"`)[3])
        .subscribe((data: HttpResponse<User>) => {
          this.shoppingCart.user = data.body})
    }
  }

  g(): void {
    //console.log(this.shoppingCart)
    this.addToShoppingCart( this.shoppingCart).subscribe((data : HttpResponse<ShoppingCart>) => {
      //console.log(data.body)
    })
  }

  public addToShoppingCart(shoppingCart: ShoppingCart): Observable<EntityResponseType>{
    return this.http.post<ShoppingCart>(this.SHOPPING_CART_URL, shoppingCart, {observe: 'response'})
      .pipe(map((res:EntityResponseType) => res));
  }

  public updateShoppingCart(shoppingCart: ShoppingCart): Observable<EntityResponseType> {
    return this.http.put<ShoppingCart>(this.SHOPPING_CART_URL, shoppingCart, {observe: 'response'})
      .pipe(map((res:EntityResponseType) => res));
  }

  public getShoppingCartsByUserName(name: string): Observable<EntityArrayResponseType> {
    const params = new HttpParams().set('name', name);
    return this.http.get<ShoppingCart[]>(this.SHOPPING_CART_URL + "/findByName", {params, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => res));
  }
  public getProductsByUserName(name : string) : Observable<HttpResponse<Product[]>> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Product[]>(this.SHOPPING_CART_URL + "/findProductsByName", {params, observe: 'response' })
      .pipe(map((res: HttpResponse<Product[]>) => res));
  }

  public deleteShoppingCart(shoppingCart: ShoppingCart): Observable<EntityResponseType> {
    return this.http.delete<ShoppingCart>(this.SHOPPING_CART_URL, {body: shoppingCart, observe: 'response'})
      .pipe(map((res: EntityResponseType) => res));
  }


}
