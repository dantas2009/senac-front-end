import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContaService } from '../../services/conta.service';
import { Usuario, UsuarioEditar } from '../../models/Usuario';

@Component({
  selector: 'app-conta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conta.component.html',
  styleUrl: './conta.component.css'
})
export class ContaComponent {
  nome: string = ''
  email: string = ''
  senhaAntiga: string = ''
  senha: string = ''
  gastos: number = 0

  constructor(
    private _contaService: ContaService,
  ) { }

  ngOnInit(): void {
    this.buscarConta();
  }

  editar() {
    const usuario: UsuarioEditar = {
      "nome": this.nome,
      "email": this.email,
      "senha": this.senha,
      "senha_antiga": this.senhaAntiga,
      "limite_gastos": this.gastos
    }

    this._contaService.editar(usuario).subscribe({
      next: (rep) => {

      },
      error: (err) => {
        console.error(err)
      },
    });
  }

  buscarConta(){
    this._contaService.buscar().subscribe({
      next: (rep) => {
        this.carregarConta(rep)
      }
    });
  }

  carregarConta(usuario: Usuario){
    this.nome = usuario.nome;
    this.email = usuario.email;
    this.gastos = usuario.limite_gastos;
  }

}
