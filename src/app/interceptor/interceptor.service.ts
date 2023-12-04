import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpStatusCode
} from '@angular/common/http';

import { Observable, tap } from 'rxjs';

@Injectable()
export class Interceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.includes('auth')) {
            return next.handle(req);
        }

        const token = localStorage.getItem("token");

        if (token) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(req).pipe(
            tap({
                next: (event: HttpEvent<any>) => { },
                error: (error) => {
                    if (error.status == HttpStatusCode.Unauthorized) {
                        localStorage.removeItem("token")
                        window.location.reload();
                    }
                }
            })
        );
    }
}