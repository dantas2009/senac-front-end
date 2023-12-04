import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Icone } from '../../../models/Icone';
import { IconeService } from '../../../services/icone.service';
import { Categoria, CategoriaConsulta } from '../../../models/Categoria';
import { CategoriaService } from '../../../services/categoria.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-categoria.component.html',
  styleUrl: './form-categoria.component.css'
})
export class FormCategoriaComponent {
  id_categoria: number = 0
  icones: Icone[] = []
  status: boolean = true
  id_icone: number = 0
  categoria: string = ''

  constructor(
    private _router: Router,
    private _iconeService: IconeService,
    private _categoriaService: CategoriaService,
    private _route: ActivatedRoute,

  ) { }


  ngOnInit(): void {
    this.carregarIcones();

    this. _route.params.subscribe(params => {
      if(params['id_categoria'] != undefined){
        this.id_categoria = params['id_categoria'];
        this.buscarcategoria();
      }
    });
  }

  buscarcategoria(){
    this._categoriaService.buscar(this.id_categoria).subscribe({
      next: (rep) => {
        this.carregarcategoria(rep)
      }
    });
  }

  carregarcategoria(categoria: CategoriaConsulta){
    this.icones.push(categoria.icones)
    this.categoria = categoria.categoria
    this.status = categoria.status
    this.id_icone = categoria.id_icone
  }

  carregarIcones() {
    this._iconeService.iconesDisponiveis().subscribe({
      next: (rep) => {
        this.icones = rep;
        this.id_icone = rep[rep.length - 1].id_icone
      }
    });
  }

  selecionarIcone(id_icone: number){
    this.id_icone = id_icone
  }

  mudarStatus(){
    this.status = !this.status
  }

  form(){
    if(this.id_categoria == 0){
      this.add()
    }else{
      this.editar()
    }
  }

  add() {
    const categoria: Categoria = {
      "id_categoria": 0,
      "id_usuario": 0,
      "id_icone": this.id_icone,
      "categoria": this.categoria,
      "status": this.status,
    }

    this._categoriaService.add(categoria).subscribe({
      next: (rep) => {
        this._router.navigate(['/categoria/consultar']);
      },
      error: (err) => {
        console.error(err)
      },
    });
  }

  editar() {
    const categoria: Categoria = {
      "id_categoria": 0,
      "id_usuario": 0,
      "id_icone": this.id_icone,
      "categoria": this.categoria,
      "status": this.status,
    }

    this._categoriaService.editar(this.id_categoria, categoria).subscribe({
      next: (rep) => {
        this._router.navigate(['/categoria/consultar']);
      },
      error: (err) => {
        console.error(err)
      },
    });
  }

}
