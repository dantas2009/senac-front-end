import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContaService } from '../../services/conta.service';
import { Usuario, UsuarioEditar } from '../../models/Usuario';
import Swal from 'sweetalert2';
import { regexValidator } from '../../components/regexValidator';
import { compararValidator } from '../../components/compararValidator';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-conta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './conta.component.html',
  styleUrl: './conta.component.css'
})

export class ContaComponent {
  constructor(
    private _contaService: ContaService,
    private _fb: FormBuilder,
  ) { }

  contaForm!: FormGroup;

  ngOnInit() {
    this.buscarConta();

    this.contaForm = this._fb.group({
      nome: ['', [regexValidator(/^[a-zA-Z\s]+$/)]],
      email: ['', [regexValidator(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)]],
      senhaAntiga: ['', [Validators.required]],
      senhaNova: ['', [regexValidator(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/)]],
      repetirSenhaNova: ['', [Validators.required, compararValidator('senhaNova')]],
      gastos: ['', [regexValidator(/^\d{1,100}(\.\d{1,100})*(,\d{1,2})?$/)]],
    });
  }

  get nome() {
    return this.contaForm.get("nome")!;
  }

  get email() {
    return this.contaForm.get("email")!;
  }

  get senhaAntiga() {
    return this.contaForm.get("senhaAntiga")!;
  }

  get senhaNova() {
    return this.contaForm.get("senhaNova")!;
  }

  get repetirSenhaNova() {
    return this.contaForm.get("repetirSenhaNova")!;
  }

  get gastos() {
    return this.contaForm.get("gastos")!;
  }

  editar() {
    if (this.senhaAntiga.value != '') {
      if (this.contaForm.invalid) {
        return;
      }
    } else {
      this.senhaNova.setValue('');
      if (this.nome.invalid || this.email.invalid || this.gastos.invalid) {
        return;
      }
    }

    const usuario: UsuarioEditar = {
      "nome": this.nome.value,
      "email": this.email.value,
      "senha_antiga": this.senhaAntiga.value,
      "senha": this.senhaNova.value,
      "limite_gastos": this.gastos.value.replace('.', '').replace(',', '.')
    }

    this._contaService.editar(usuario).subscribe({
      next: (rep) => {
        Swal.fire('Conta alterada com sucesso.');
      },
      error: (err) => {
        if (err.status == HttpStatusCode.Forbidden) {
          Swal.fire('Erro ao alterar.\n Senha antiga inválida!');
        }else{
          Swal.fire('Ops, erro ao alterar a conta.');
        }
      },
    });
  }

  buscarConta() {
    this._contaService.buscar().subscribe({
      next: (rep) => {
        this.carregarConta(rep)
      }
    });
  }

  carregarConta(usuario: Usuario) {
    this.nome.setValue(usuario.nome);
    this.email.setValue(usuario.email);
    this.gastos.setValue(usuario.limite_gastos.toString().replace(".",","));
  }

}
