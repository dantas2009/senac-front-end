import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { InterceptorProvider } from './interceptor/interceptor.provider';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    importProvidersFrom(HttpClientModule),
    InterceptorProvider,
    provideAnimations(),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '1051703375380-geug043fcahqpobequcg8qn6op4niobk.apps.googleusercontent.com',
              {
                oneTapEnabled: false,
                scopes: 'profile email openid'
              }
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('216700097747163')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
  ]
};
