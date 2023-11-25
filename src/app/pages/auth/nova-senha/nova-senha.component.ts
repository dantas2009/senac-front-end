import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-nova-senha',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './nova-senha.component.html',
  styleUrl: './nova-senha.component.css'
})
export class NovaSenhaComponent {
  token: string = '';
  senha: string = ''
  repetirSenha: string = '' 
  novaSenhaClick: boolean = false

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.token = params['token'];
    });

    if(this.token == undefined || this.token == ''){
      Swal.fire({
        title: "Token de recuperação não encontrado, Por favor realize o processo novamente.",
        confirmButtonText: "Voltar",
      }).then((result) => {
        if (result.isConfirmed) {
          this._router.navigate(['/']);
        }
      });
    }
  }

  novaSenha(){
    this.novaSenhaClick = true

    const novasenha = {
      "senha": this.senha,
      "token" : this.token
    };

    this._auth.novaSenha(novasenha).subscribe({
      next: (rep) => {
        this.novaSenhaClick = false;

        localStorage.setItem('token', rep.access_token);
        localStorage.setItem('loginReload', 'true');
        this._router.navigate(['/']);
      },
      error: () => {
        this.novaSenhaClick = false;

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Desculpe-nos, mas o token para a alteração de senha é inválido ou expirou. Por favor, solicite um novo link de redefinição de senha e certifique-se de usá-lo dentro do prazo de validade." 
        });
      },
    });
  }

}
