import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  chartDespesasAno: any = [];
  chartDespesasCategoriaAno: any = [];
  chartDespesasCategoriaMes: any = [];

  constructor(
    private _dashboardService: DashboardService
  ) {}

  atrasadas: number = 0;
  pendentes: number = 0;
  mesAtual: number = 0;
  mesPassado: number = 0;
  despesasQtdAno: number = 0;

  ngOnInit() {
    const reloadOnce = localStorage.getItem('loginReload');
    if (reloadOnce) {
      localStorage.removeItem('loginReload');
      window.location.reload();
    }

    this.buscarCards();

    this.buscarDespesasAno();

    this.buscarDespesasCategoriaMes();

    this.buscarDespesasCategoriaAno();    
  }

  buscarCards(){
    this._dashboardService.buscarCards().subscribe({
      next: (rep) => {
        this.atrasadas = rep.despesas_atrasadas;
        this.pendentes = rep.despesas_pendentes;
        this.mesAtual = rep.despesas_mes_atual;
        this.mesPassado = rep.despesas_mes_anterior;
      }
    });
  }

  buscarDespesasAno(){
    this._dashboardService.buscarDespesasAno().subscribe({
      next: (rep) => {

        this.despesasQtdAno = rep.despesas_qtd_ano;

        const limiteGastos = []
        for(let i = 0; i < 12; i++){
          limiteGastos[i] = rep.limite_gastos;
        }

        this.chartDespesasAno = new Chart('chartDespesasAno', {
          type: 'line',
          data: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
            datasets: [
              {
                label: 'despesas',
                data: rep.valores_por_mes,
                borderWidth: 2,
                borderColor: 'rgb(62,156,53)',
                tension: 0.5
              },
              {
                label: 'limite de gastos',
                data: limiteGastos,
                borderWidth: 1,
                borderColor: 'rgb(255, 0, 0)',
                tension: 0.5
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    });
  }

  buscarDespesasCategoriaMes(){
    this._dashboardService.buscarDespesasCategoriaMes().subscribe({
      next: (rep) => {

        const categorias: string[] = []
        const valores: number[] = []
        const cores: string[] = []

        rep.despesas_mes.forEach(despesas => {
          if(despesas.valor > 0){
            categorias.push(despesas.categoria);
            valores.push(despesas.valor);
            cores.push(this.gerarCorRandomica());
          }
        });

        this.chartDespesasCategoriaMes = new Chart('chartDespesasCategoriaMes', {
          type: 'pie',
          data: {
            labels: categorias,
            datasets: [{
              data: valores,
              backgroundColor: cores,
              hoverOffset: 4
            }],
          }
        });
      }
    });
  }

  buscarDespesasCategoriaAno(){
    this._dashboardService.buscarDespesasCategoriaAno().subscribe({
      next: (rep) => {

        const categorias: string[] = []
        const valores: number[] = []
        const cores: string[] = []

        rep.despesas_ano.forEach(despesas => {
          if(despesas.valor > 0){
            categorias.push(despesas.categoria);
            valores.push(despesas.valor);
            cores.push(this.gerarCorRandomica());
          }
        });

        this.chartDespesasCategoriaAno = new Chart('chartDespesasCategoriaAno', {
          type: 'pie',
          data: {
            labels: categorias,
            datasets: [{
              data: valores,
              backgroundColor: cores,
              hoverOffset: 4
            }],
          }
        });
      }
    });
  }

  gerarCorRandomica() {
    var r = Math.floor(Math.random() * 256); 
    var g = Math.floor(Math.random() * 256); 
    var b = Math.floor(Math.random() * 256);
  
    var cor = 'rgb(' + r + ',' + g + ',' + b + ')';
  
    return cor;
  }
}
