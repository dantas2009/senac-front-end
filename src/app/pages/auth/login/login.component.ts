import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { regexValidator } from '../../../components/regexValidator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _fb: FormBuilder
  ) { }

  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this._fb.group({
      email: ['', [regexValidator(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)]],
      senha: ['', [Validators.required]],
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
      error: (err) => {
        Swal.fire('Login inválido. Por favor, verifique suas credenciais e tente novamente.');
      },
    });
  }
}
