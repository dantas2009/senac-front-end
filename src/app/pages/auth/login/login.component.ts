import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { regexValidator } from '../../../components/regexValidator';
import Swal from 'sweetalert2';
import { FacebookLoginProvider, GoogleSigninButtonModule, SocialAuthService, SocialLoginModule, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, SocialLoginModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _fb: FormBuilder,
    private _authService: SocialAuthService
  ) { }

  loginForm!: FormGroup;
  user!: SocialUser;

  ngOnInit() {
    this.loginForm = this._fb.group({
      email: ['', [regexValidator(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)]],
      senha: ['', [Validators.required]],
    });

    this._authService.authState.subscribe((user) => {
      console.log(user.provider);
      let login = {
        "provedor" : '',
        "token" : ''
      };

      if(user.provider == 'GOOGLE'){
        login = {
          "provedor" : 'google',
          "token" : user.idToken
        };
      }

      if(user.provider == 'FACEBOOK'){
        login = {
          "provedor" : 'facebook',
          "token" : user.authToken
        };
      }

      this._auth.socialLogin(login).subscribe({
        next: (rep) => {
          localStorage.setItem('token', rep.access_token);
          localStorage.setItem('loginReload', 'true');
          this._router.navigate(['/']);
        },
      });
    });
  }

  get email() {
    return this.loginForm.get("email")!;
  }

  get senha() {
    return this.loginForm.get("senha")!;
  }

  login() {
    if(this.loginForm.invalid){
      return;
    }
    
    const login = {
      "email" : this.email.value,
      "senha" : this.senha.value
    };

    this._auth.login(login).subscribe({
      next: (rep) => {
        localStorage.setItem('token', rep.access_token);
        localStorage.setItem('loginReload', 'true');
        this._router.navigate(['/']);
      },
      error: () => {
        Swal.fire('Login inválido. Por favor, verifique suas credenciais e tente novamente.');
      },
    });
  }

  loginFB(): void {
    this._authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }
}
