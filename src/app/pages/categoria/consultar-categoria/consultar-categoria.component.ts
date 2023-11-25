import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../services/categoria.service';
import { Router } from '@angular/router';
import { CategoriaConsulta } from '../../../models/Categoria';

@Component({
  selector: 'app-consultar-categoria',
  standalone: true,
  imports: [CommonModule],  
  templateUrl: './consultar-categoria.component.html',
  styleUrl: './consultar-categoria.component.css'
})
export class ConsultarCategoriaComponent {
  categorias: CategoriaConsulta[] = []

  constructor(
    private _router: Router,
    private _categoriaService: CategoriaService
  ) { }
  
  ngOnInit(): void {
    this.carregarcategorias();
  }

  carregarcategorias() {
    this._categoriaService.buscarTodos().subscribe({
      next: (rep) => {
        this.categorias = rep;
      }
    });
  }

  editar(id_categoria: number){
    this._router.navigate(["/categoria/editar", id_categoria]);
  }
}
