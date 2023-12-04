import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DespesaItem, DespesaPagamento } from '../../../models/Despesa';
import { DespesaService } from '../../../services/despesa.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CategoriaConsulta } from '../../../models/Categoria';
import { CategoriaService } from '../../../services/categoria.service';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PaginatorIntl } from '../../../components/paginator';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-consultar-despesa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule, 
    MatDatepickerModule, 
    MatNativeDateModule
  ],
  providers: [{provide: MatPaginatorIntl, useClass: PaginatorIntl}],
  templateUrl: './consultar-despesa.component.html',
  styleUrl: './consultar-despesa.component.css'
})

export class ConsultarDespesaComponent {
  constructor(
    private _router: Router,
    private _renderer: Renderer2,
    private _despesaService: DespesaService,
    private _categoriaService: CategoriaService,
    private _elementRef: ElementRef,
  ) { }

  totalDespesas: number = 0;
  idCategoria: number = 0;
  pesquisa: string = '';
  inicio: string = '';
  fim: string = '';
  skip: number = 0;
  limit: number = 10;
  categoriaIcone: string = '';
  categorias: CategoriaConsulta[] = []
  despesas = new MatTableDataSource<any>();
  colunas = ['categoria', 'despesa', 'valor', 'vencimento', 'pagamento', 'editar', 'remover'];
  valorTotal: number = 0;
  valorPago: number = 0;
  valorAberto: number = 0;
  pendente = false;

  @ViewChild('dataVencimento') inputElement: ElementRef | undefined;

  ngOnInit(): void {
    this.carregarDespesas();
    this.carregarcategorias();
  }

  ngAfterViewInit() {
    this.dateTimeRenderizar();
  }

  dateTimeRenderizar(){
    const script = this._renderer.createElement('script');
    script.type = 'text/javascript';
    script.text = `
      $('.daterange-cus').daterangepicker({
        "locale": {
          "format": "DD/MM/YYYY",
          "separator": " - ",
          "applyLabel": "Selecionar",
          "cancelLabel": "Cancelar",
          "fromLabel": "De",
          "toLabel": "Até",
          "customRangeLabel": "Outro",
          "weekLabel": "Semana",
          "daysOfWeek": [
              "D",
              "S",
              "T",
              "Q",
              "Q",
              "S",
              "S"
          ],
          "monthNames": [
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outrubro",
              "Novembro",
              "Dezembro"
          ],
          "firstDay": 1
        },
        drops: 'down',
        opens: 'right'
      });
      $('.daterange-cus').val('');
    `;
    
    this._renderer.appendChild(this._elementRef.nativeElement, script);
  }

  dateTimeLimpar(){
    this._elementRef.nativeElement.querySelector('.dataVencimento').value = "";
    this.inicio = '';
    this.fim = '';
    this.carregarDespesas();
  }

  dateTimeBuscar(){
    const dataVencimento = this._elementRef.nativeElement.querySelector('.dataVencimento').value;
    const datas = dataVencimento.split(' - ');
    if(datas.length > 1){
      this.inicio = datas[0];
      this.fim = datas[1]
    }

    this.carregarDespesas();
  }

  buscar(){
    if(this.pesquisa.length > 3 || this.pesquisa.length == 0){
      this.carregarDespesas();
    }
  }

  onPaginateChange(event: PageEvent) {
    this.limit = event.pageSize;
    this.skip = event.pageIndex * event.pageSize;

    this.carregarDespesas();
  }

  carregarDespesasPendente(){
    this.skip = 0;
    this.limit = 10;
    this.pendente = !this.pendente;
    this.carregarDespesas();
  }

  carregarDespesasCategoria(){
    this.skip = 0;
    this.limit = 10;
    this.carregarDespesas();
  }

  carregarDespesas() {
    this._despesaService.buscarTodos(this.skip, this.limit, this.idCategoria, this.pesquisa, this.inicio, this.fim, this.pendente).subscribe({
      next: (rep) => {
        this.totalDespesas = rep.total;
        this.despesas = new MatTableDataSource<DespesaItem>(rep.despesas);
        this.valorTotal = rep.valor_total;
        this.valorPago = rep.valor_pago;
        this.valorAberto = rep.valor_aberto;
      }
    });
  }

  carregarcategorias() {
    this._categoriaService.buscarTodos().subscribe({
      next: (rep) => {
        this.categorias = rep;
      }
    });
  }

  editar(idDespesa: number) {
    this._router.navigate(["/despesa/editar", idDespesa]);
  }

  remover(id_despesa: number) {
    Swal.fire({
      title: "Tem certeza de que deseja remover? Esta ação é irreversível e não pode ser desfeita.",
      showDenyButton: true,
      confirmButtonText: "Voltar",
      denyButtonText: "Remover"
    }).then((result) => {
      if (result.isDenied) {
        this.realizarRemocao(id_despesa);
      }
    });
  }

  async pagamento(id_despesa: number){
    const { value: pagamento } = await Swal.fire({
      title: "",
      input: "datetime-local",
      inputLabel: "Data de pagamento"
    });
    if (this.dataValida(pagamento)) {
      this.realizarPagamento(id_despesa, pagamento);
    }else{
      Swal.fire('Data inválida, por favor repita o procedimento');
    }
  }

  dataValida(data: string) {
    const parsedDate = new Date(data);
    return !isNaN(parsedDate.getTime());
  }

  realizarPagamento(id_despesa: number, pagamento: string){

    const despesa: DespesaPagamento = {
      "pagamento": pagamento,
    }

    this._despesaService.pagamento(id_despesa, despesa).subscribe({
      next: (rep) => {
        this.carregarDespesas()
      },
      error: (err) => {
        console.error(err)
      },
    });

  }

  realizarRemocao(id_despesa: number){
    this._despesaService.remover(id_despesa).subscribe({
      next: (rep) => {
        this.carregarDespesas()
      },
      error: (err) => {
        console.error(err)
      },
    });
  }
}
