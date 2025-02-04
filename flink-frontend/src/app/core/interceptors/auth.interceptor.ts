import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private apiUrls: string[] = ['http://localhost:3000'];

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const shouldAddCredentials = this.apiUrls.some(url => req.url.startsWith(url));
    const modifiedReq = req.clone({
      withCredentials: shouldAddCredentials,
    });

    return next.handle(modifiedReq);
  }
}
