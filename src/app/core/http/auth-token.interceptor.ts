import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

/**
 * Adds the local storage token to the headers
 */
@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = '';
    const savedCredentials = sessionStorage
        .getItem(environment.credentials) || localStorage.getItem(environment.credentials);
    if (savedCredentials) {
        token = JSON.parse(savedCredentials).token;
    }
    const clonedRequest = request.clone({ headers: request.headers.set('X-Auth-Token', token) });
    return next.handle(clonedRequest);
  }

}
