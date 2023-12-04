import { Component, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Categoria, CategoriaConsulta } from '../../../models/Categoria';
import { CategoriaService } from '../../../services/categoria.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
  ) { }
  idDespesa: number = 0;

  despesaForm!: FormGroup;
  categorias: CategoriaConsulta[] = []

  quitada: boolean = false

  //idCategoria: number = 0

  vencimento: string = ''
  pagamento: string = ''

  ngAfterViewInit() {
    this.dateTimeRenderizar();
  }

  ngOnInit() {
    this.carregarCategorias();

    this.despesaForm = this._fb.group({
      despesa: ['', [Validators.required]],
      valorTotal: ['', [regexValidator(/^\d{1,100}(\.\d{1,100})*(,\d{1,2})?$/)]],
      dataVencimento: ['', [regexValidator(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4}) (?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/)]],
      dataPagamento: ['', [regexValidator(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4}) (?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/)]],
      categoria: [''],
    });

    this._route.params.subscribe(params => {
      if (params['idDespesa'] != undefined) {
        this.idDespesa = params['idDespesa'];
        this.buscarDespesa();
      }
    });
  }

  buscarDespesa() {
    this._despesaService.buscar(this.idDespesa).subscribe({
      next: (rep) => {
        this.carregarDespesa(rep)
      }
    });
  }

  carregarDespesa(despesa: Despesa) {
    const vencimento = format(parse(despesa.vencimento, "yyyy-MM-dd'T'HH:mm:ss", new Date()), 'dd-MM-yyyy HH:mm:ss');

    console.log(despesa);
    this.despesa.setValue(despesa.despesa);
    this.valorTotal.setValue(despesa.valor.toString().replace('.',','));
    this.dataVencimento.setValue(vencimento);

    if (despesa.pagamento != null) {
      const pagamento = format(parse(despesa.pagamento, "yyyy-MM-dd'T'HH:mm:ss", new Date()), 'dd-MM-yyyy HH:mm:ss');
      this.dataPagamento.setValue(pagamento);

      this.quitada = true;
    }

    this.selecionarCategoria(despesa.id_categoria);
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

  get categoria(){
    return this.despesaForm.get("categoria")!;
  }

  carregarCategorias() {
    this._categoriaService.buscarDisponivel().subscribe({
      next: (rep) => {
        this.categorias = rep
        //this.categoria.setValue(rep[rep.length - 1].id_categoria);
      }
    });
  }

  selecionarCategoria(idCategoria: number) {
    this.categoria.setValue(idCategoria);
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

  // WEB SERVICE
  form() {
    this.carregarDatas()
    this.editar();
  }

  editar() {
    this.carregarDatas();

    if (this.despesa.invalid ||
      this.valorTotal.invalid ||
      this.dataVencimento.invalid ||
      (this.quitada && this.dataPagamento.invalid)) {
      return;
    }

    const despesa: Despesa = {
      "id_categoria": this.categoria.value,
      "despesa": this.despesa.value,
      "valor": this.valorTotal.value.replace('.', '').replace(',', '.'),
      "vencimento": this.vencimento,
      "pagamento": this.pagamento,
    }

    this._despesaService.editar(this.idDespesa, despesa).subscribe({
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

}
