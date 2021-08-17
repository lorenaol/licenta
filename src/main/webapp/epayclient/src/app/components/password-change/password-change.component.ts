import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "@app/services/user.service";
import {AuthenticationService} from "@app/services/authentication.service";
import {first, map} from "rxjs/operators";
import {HttpResponse} from "@angular/common/http";
import {User, UserWithAuthoritiesDto} from "@app/entities/user";
import {BehaviorSubject, from, throwError} from "rxjs";

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  changeForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string ;
  error = '';
  password: any;
  userSubject: BehaviorSubject<UserWithAuthoritiesDto | null>;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    let userName = JSON.parse(localStorage.getItem('user')!).userName;
    this.userService.getUsersByEmail(userName).subscribe((data:HttpResponse<User>)=>{
      this.password = data.body?.password;
      console.log(this.password);
    });
    let user = localStorage.getItem('user');
    this.userSubject = new BehaviorSubject<UserWithAuthoritiesDto | null>(user ? JSON.parse(user) : null);

  }

  ngOnInit(): void {
    this.changeForm = this.formBuilder.group({
      firstPassword: ['', Validators.required],
      changePassword: ['', Validators.required]
    });

    let email = JSON.parse(localStorage.getItem('user')!).userName;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }
  // convenience getter for easy access to form fields
  get f() {
    return this.changeForm!.controls;
  }

  onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.changeForm!.invalid) {
      return;
    }

    // this.userService.getUsersByName(userName).subscribe((data:HttpResponse<User>)=>{password = data.body?.password;user = data.body;user.password=inputpass;this.userService.updateUser(user).subscribe()});

    let userName = JSON.parse(localStorage.getItem('user')!).userName;
    console.log(userName);

    this.userService.getUsersByEmail(userName).subscribe((data:HttpResponse<User>)=>{this.password = data.body?.password;console.log(this.password);});
    console.log(this.password);
    let email = JSON.parse(localStorage.getItem('user')!).userName;
    this.loading = true;
    this.userService.resetPasswordLoggedIn(this.f.firstPassword.value, this.f.changePassword.value, email)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          if(error == 'OK') {

            let auth = window.btoa(email + ':' + this.f.changePassword.value);
            let user =JSON.parse(localStorage.getItem('user')!);
            console.log(user);
            user.authdata = auth;
            console.log(auth);
            localStorage.setItem('user', JSON.stringify(user));
            console.log(user);
            console.log();
            // this.authenticationService.logout();
            // console.log("gtrdf");
            // this.authenticationService.login(email, this.f.changePassword.value);
            // console.log("vrfbrb");
            this.userSubject.next(user);


          }
          this.error = error;
          this.loading = false;
        });
  }



}
