import {Injectable} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";

import {UserWithAuthoritiesDto} from "../entities/user";
import {environment} from "@environments/environment";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LoginComponent} from "@app/components/login/login.component";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";
import {ModalService} from "@app/services/modal.service";
import {ModalTypesEnum} from "@app/enums/modal-types.enum";
import {ShoppingCartService} from "@app/services/shoppingCart.service";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userSubject: BehaviorSubject<UserWithAuthoritiesDto | null>;
  public user: Observable<UserWithAuthoritiesDto | null>;
  private loginDialog: NgbModalRef | null;
  private signinDialog: NgbModalRef | null;

  constructor(
    private shoppingCartService : ShoppingCartService,
    private router: Router,
    private http: HttpClient,
    private modalService: NgbModal,
    private modalService2: ModalService
  ) {
    let user = localStorage.getItem('user');
    this.userSubject = new BehaviorSubject<UserWithAuthoritiesDto | null>(user ? JSON.parse(user) : null);
    this.user = this.userSubject.asObservable();
    this.loginDialog = null;
    this.signinDialog = null;
  }

  public get userValue(): UserWithAuthoritiesDto | null {
    return this.userSubject.value;
  }

  login(email: string, password: string) {
    let auth = window.btoa(email + ':' + password);
    return this.http.get<any>(`${environment.apiUrl}login`, {
      headers: {
        Authorization: `Basic ${auth}`
      }
    })
      .pipe(map(user => {
        // store user details and basic auth credentials in local storage to keep user logged in between page refreshes
        user.authdata = auth;
        localStorage.setItem('user', JSON.stringify(user));
        console.log();
        this.shoppingCartService.selectOldProducts();
        this.shoppingCartService.updateCart();
        this.userSubject.next(user);
        this.loginDialog?.close();
        this.loginDialog = null;
        return user;
      }));
  }


  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  public showLogin() {
    if (!this.loginDialog || !this.modalService.hasOpenModals) {
      this.loginDialog = this.modalService.open(LoginComponent, {
        beforeDismiss: () => {
          this.loginDialog = null;
          return true;
        }
      });
    }
  }

  public hasAuthority(authority: string): Observable<boolean> {
    const userHasAuth = map((user: UserWithAuthoritiesDto | null): boolean => {
      if (!user) {
        return false;
      }
      return user?.authorityCode?.indexOf(authority) !== -1;
    })
    return userHasAuth(this.user);
  }

  showSignin() {
    if (!this.signinDialog) {
      this.modalService2.openUserModal(ModalTypesEnum.CREATE, undefined);
    }
  }

}
