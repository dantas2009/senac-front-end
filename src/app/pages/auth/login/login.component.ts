import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Login } from '../../../models/auth/Login';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  email: string = '';
  senha: string = '';

  constructor(
    private _auth: AuthService,
    private _router: Router
  ) { }

  login() {
    const login = {
      "email" : this.email,
      "senha" : this.senha
    };

    this._auth.login(login).subscribe({
      next: (rep) => {
        localStorage.setItem('token', rep.access_token);
        localStorage.setItem('loginReload', 'true');
        this._router.navigate(['/']);
      },
      error: (err) => {
        console.error(err)
      },
    });
  }

}
