import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpStatusCode
} from '@angular/common/http';

import { Observable, tap } from 'rxjs';

@Injectable()
export class Interceptor implements HttpInterceptor {
    token = localStorage.getItem("token");

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.token}`
                }
            });
        }

        return next.handle(req).pipe(
            tap({
                next: (event: HttpEvent<any>) => {},
                error: (error) => {
                    if(error.status == HttpStatusCode.Unauthorized){
                        localStorage.removeItem("token")
                        window.location.reload();
                    }
                }
            })
        );
    }
}