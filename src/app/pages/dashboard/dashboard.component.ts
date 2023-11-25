import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { RouterModule } from '@angular/router';

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

  
  constructor() {}

  ngOnInit() {
    const reloadOnce = localStorage.getItem('loginReload');
    if (reloadOnce) {
      localStorage.removeItem('loginReload');
      window.location.reload();
    }

    this.chartDespesasAno = new Chart('chartDespesasAno', {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
          {
            label: 'quitadas em dia',
            data: [12, 19, 30, 50, 20, 30, 12, 19, 30, 50, 20, 30],
            borderWidth: 1,
            borderColor: 'rgb(0, 255, 0)',
            tension: 0.3
          },
          {
            label: 'quitada em atrasado',
            data: [1, 2, 1, 5, 2, 3, 1, 2, 3, 5, 2, 3],
            borderWidth: 1,
            borderColor: 'rgb(255, 0, 0)',
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

    this.chartDespesasCategoriaAno = new Chart('chartDespesasCategoriaAno', {
      type: 'pie',
      data: {
        labels: [
          'Red 300',
          'Blue 50',
          'Yellow 100'
        ],
        datasets: [{
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }],
      }
    });

    this.chartDespesasCategoriaMes = new Chart('chartDespesasCategoriaMes', {
      type: 'pie',
      data: {
        labels: [
          'Red 300',
          'Blue 50',
          'Yellow 100'
        ],
        datasets: [{
          data: [300, 50, 100],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
          ],
          hoverOffset: 4
        }],
      }
    });
  }

}
