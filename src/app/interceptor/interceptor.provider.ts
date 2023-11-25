import { Provider } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Interceptor } from './interceptor.service';

export const InterceptorProvider: Provider = {
    provide: HTTP_INTERCEPTORS,
    useClass: Interceptor,
    multi: true
};