import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Categoria, CategoriaConsulta } from '../../../models/Categoria';
import { CategoriaService } from '../../../services/categoria.service';
import { Router, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Despesa, DespesaParcelada } from '../../../models/Despesa';
import { DespesaService } from '../../../services/despesa.service';
import { parse, format } from 'date-fns';
import { regexValidator } from '../../../components/regexValidator';

@Component({
  selector: 'app-editar-despesa',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTooltipModule,
    ReactiveFormsModule
  ],
  templateUrl: './editar-despesa.component.html',
  styleUrl: './editar-despesa.component.css'
})

export class EditarDespesaComponent {
  constructor(
    private _despesaService: DespesaService,
    private _categoriaService: CategoriaService,
    private _renderer: Renderer2,
    private _router: Router,
    private _elementRef: ElementRef,
    private _fb: FormBuilder
  ) { }

  despesaForm!: FormGroup;
  categorias: CategoriaConsulta[] = []

  parcelado: boolean = false
  quitada: boolean = false

  idCategoria: number = 0

  vencimento: string = ''
  pagamento: string = ''

  ngAfterViewInit() {
    this.dateTimeRenderizar();
  }

  ngOnInit() {
    this.carregarCategorias();

    this.despesaForm = this._fb.group({
      despesa: ['', Validators.required],
      valorTotal: ['', [regexValidator(/^\d{1,100}(\.\d{1,100})*(,\d{1,2})?$/)]],
      dataVencimento: ['', [regexValidator(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4}) (?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/)]],
      dataPagamento: ['', [regexValidator(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4}) (?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/)]],
      parcelas: ['2', [regexValidator(/^(?:[2-9]|[1-9][0-9]|100)$/)]],
      diaVencimento: ['1', [regexValidator(/^(?:[1-9]|[12]\d|3[01])$/)]],
      mesVencimento: ['1', [regexValidator(/^(0[1-9]|1[0-2])-(19|20)\d{2}$/)]],
    });
  }

  get despesa() {
    return this.despesaForm.get("despesa")!;
  }

  get valorTotal() {
    return this.despesaForm.get("valorTotal")!;
  }

  get dataVencimento() {
    return this.despesaForm.get("dataVencimento")!;
  }

  get dataPagamento() {
    return this.despesaForm.get("dataPagamento")!;
  }
  
  get parcelas(){
    return this.despesaForm.get("parcelas")!;
  }

  get diaVencimento(){
    return this.despesaForm.get("diaVencimento")!;
  }

  get mesVencimento(){
    return this.despesaForm.get("mesVencimento")!;
  }

  carregarCategorias() {
    this._categoriaService.buscarDisponivel().subscribe({
      next: (rep) => {
        this.categorias = rep
        this.idCategoria = rep[rep.length - 1].id_categoria;
      }
    });
  }

  selecionarCategoria(idCategoria: number) {
    this.idCategoria = idCategoria
  }

  pagamentoParcelado() {
    this.parcelado = !this.parcelado
    if (!this.parcelado) {
      this.dateTimeRenderizar();
    } else {
      this.dataMesVencimentoRenderizar();
    }
  }

  despesaQuitada() {
    this.quitada = !this.quitada
    this.dateTimeRenderizar();
  }

  carregarDatas() {
    let vencimento = this._elementRef.nativeElement.querySelector('#dataVencimento').value;
    let pagamento = ''

    if (this.quitada) {
      pagamento = this._elementRef.nativeElement.querySelector('#dataPagamento').value;
    }

    if (vencimento != '') {
      this.dataVencimento.setValue(vencimento);
      this.vencimento = format(parse(vencimento, 'dd-MM-yyyy HH:mm:ss', new Date()), "yyyy-MM-dd'T'HH:mm:ss");
    }

    if (pagamento != '') {
      this.dataPagamento.setValue(pagamento);
      this.pagamento = format(parse(pagamento, 'dd-MM-yyyy HH:mm:ss', new Date()), "yyyy-MM-dd'T'HH:mm:ss");
    }
  }

  carregarMes(){
    const pagamento = this._elementRef.nativeElement.querySelector('#mesVencimento').value;
    this.mesVencimento.setValue(pagamento);
  }

  // WEB SERVICE
  form() {
    if (this.parcelado) {
      this.carregarMes();
      this.addParcelado();
      return;
    }
    this.carregarDatas()
    this.add();
  }

  add() {
    this.carregarDatas();

    if(this.despesa.invalid || 
      this.valorTotal.invalid || 
      this.dataVencimento.invalid ||
      (this.quitada && this.dataPagamento.invalid)){
        return;
      }

    const despesa: Despesa = {
      "id_categoria": this.idCategoria,
      "despesa": this.despesa.value,
      "valor": this.valorTotal.value,
      "vencimento": this.vencimento,
      "pagamento": this.pagamento,
    }

    this._despesaService.add(despesa).subscribe({
      next: (rep) => {
        this._router.navigate(['/despesa/consultar']);
      },
      error: (err) => {
        console.error(err)
      },
    });

  }

  addParcelado() {
    if(this.despesa.invalid || 
      this.valorTotal.invalid || 
      this.parcelas.invalid ||
      this.mesVencimento.invalid ||
      this.diaVencimento.invalid){
        return;
      }

    const despesaParcelada: DespesaParcelada = {
      "id_categoria": this.idCategoria,
      "despesa": this.despesa.value,
      "valor": this.valorTotal.value,
      "parcelas": this.parcelas.value,
      "data_primeiro_vencimento": this.mesVencimento.value,
      "dia_vencimento": this.diaVencimento.value
    }

    this._despesaService.addParcelada(despesaParcelada).subscribe({
      next: (rep) => {
        this._router.navigate(['/despesa/consultar']);
      },
      error: (err) => {
        console.error(err)
      },
    });
  }

  dateTimeRenderizar() {
    const script = this._renderer.createElement('script');
    script.type = 'text/javascript';
    script.text = `        
      $(function () {
        $('#dataVencimento').datetimepicker({
            "showClose": true,
            "format": "DD-MM-YYYY HH:mm:ss",
        });
        $('#dataPagamento').datetimepicker({
            "showClose": true,
            "format": "DD-MM-YYYY HH:mm:ss",
        });
      });
    `;

    this._renderer.appendChild(this._elementRef.nativeElement, script);
  }

  //Data Mes Vencimento
  dataMesVencimentoRenderizar() {
    const script = this._renderer.createElement('script');
    script.type = 'text/javascript';
    script.text = `
      $(function () {
        $('#mesVencimento').daterangepicker({
          "locale": {
            "format": "MM-YYYY",
            "applyLabel": "Selecionar",
            "cancelLabel": "Cancelar",
            "weekLabel": "Semana",
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
            ]
          },
          startDate: new Date(),
          drops: 'up',
          opens: 'left',
          singleDatePicker: true
        });
      });
    `;

    this._renderer.appendChild(this._elementRef.nativeElement, script);
  }

}
