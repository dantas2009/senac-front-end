import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { IconsModule } from '../../icons/icons.module';
import { AuthService } from '../../services/auth.service';
import { DespesaService } from '../../services/despesa.service';
import { ChatgptService } from '../../services/chatgpt.service';
import { Despesa } from '../../models/Despesa';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    IconsModule,
    FormsModule 
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(
    private _chatgptService: ChatgptService,
    private _despesaService: DespesaService,
    private _router: Router,
  ) { }

  inputChatGpt: string = ''

  logout() {
    localStorage.removeItem('token');
    window.location.reload();
  }

  chatgpt() {

    const input = { 'input': this.inputChatGpt }

    this.inputChatGpt = '';

    this._chatgptService.chatgpt(input).subscribe({
      next: (rep) => {
        const despesa: Despesa = {
          "id_categoria": rep.id_categoria,
          "despesa": rep.despesa,
          "valor": rep.valor,
          "vencimento": rep.vencimento,
          "pagamento": rep.pagamento,
        }
        this.confirmarDespesa(despesa, input.input);
      },
      error: (err) => {
        Swal.fire({
          title: "Descupe, não entendemos sua solitação!",
          text: "Solicitação: " + input.input,
        });
      },
    });

  }

  async confirmarDespesa(despesa: Despesa, input: string) {
    const vencimento = `<b>Vencimento:</b> ${new Date(despesa.vencimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`;
    let pagamento = ''
    if(despesa.pagamento){
      pagamento = `<b>Pagamento:</b> ${new Date(despesa.pagamento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}.`;
    }else{
      despesa.pagamento = ''
    }

    const chatgpt = `<b>Solicitação ao ChatGPT:</b> ${input}`;

    await Swal.fire({
      title: "Você gostaria de adicionar essa despesa?",
      html: `<div style="text-align: left;">
        <b>Despesa:</b> ${despesa.despesa}. <br> 
        <b>Valor:</b> R$ ${despesa.valor.toString().replace('.', ',')}. <br> 
        ${vencimento}. <br> 
        ${pagamento} <br> <br>
        ${chatgpt}
        </div>`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Adicionar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.addDespesa(despesa);

        Swal.fire({
          title: "Despesa adicionada!",
          icon: "success"
        });
      }
    });
  }


  addDespesa(despesa: Despesa) {

    this._despesaService.add(despesa).subscribe({
      next: (rep) => {
        this._router.navigate(['/despesa/consultar']);
      },
      error: (err) => {
        console.error(err)
      },
    });
  }
}


