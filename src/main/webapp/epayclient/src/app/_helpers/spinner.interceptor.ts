import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {SpinnerService} from "@app/services/spinner.service";
import {tap} from "rxjs/operators";

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {

  constructor(private spinnerService: SpinnerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.requestStarted();
    return this.handler(next, request);
  }

  handler(next: any, request: any){
    return next.handle(request)
      .pipe(
        tap(
          (event) => {
            if(event instanceof HttpResponse){
              this.spinnerService.requestEnded();
            }
          },
          (error: HttpErrorResponse) => {
            this.spinnerService.resetSpinner();
            throw error;
          }
        ),
      );
  }

}
