import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './recuperar-senha.component.html',
  styleUrl: './recuperar-senha.component.css'
})
export class RecuperarSenhaComponent {
  email: string = '';
  
  recuperarSenhaClick: boolean = false;

  constructor(
    private _auth: AuthService,
    private _router: Router
  ) { }

  recuperarSenha(){
    this.recuperarSenhaClick = true;
    const recuperar = {
      "email" : this.email
    };

    this._auth.recuperar(recuperar).subscribe({
      next: () => {
        this.recuperarSenhaClick = false;

        Swal.fire({
          icon: "success",
          title: "Email de recuperação enviado",
          text: "Para recuperar sua senha, por favor, abra sua conta de e-mail e procure por nossa mensagem. Clique no link fornecido no e-mail para iniciar o processo de recuperação de senha.!",
        });
      },
      error: () => {
        this.recuperarSenhaClick = false;

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Lamentamos, parece que não encontramos sua conta ou ocorreu um erro durante o processo de recuperação de senha. Por favor, verifique se a conta de e-mail está correta e tente novamente.",
        });
      },
    });
  }
}
