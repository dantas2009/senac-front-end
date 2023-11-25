import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Usuario } from '../../../models/Usuario';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  nome: string = '';
  email: string = '';
  senha: string = '';
  repetir_senha: string = '';

constructor(
    private _auth: AuthService,
    private _router: Router,
  ) { }

  cadastrar() {
    const usuario: Usuario = {
      'id_usuario': 0,
      'nome': this.nome,
      'email': this.email,
      'senha': this.senha,
      'limite_gastos': 0
    }

    this._auth.cadastro(usuario).subscribe({
      next: (rep) => {
        localStorage.setItem('token', rep.access_token);
        this._router.navigate(['/']);
      },
      error: (err) => {
        console.error(err)
      },
    });
  }
}
