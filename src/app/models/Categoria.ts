import { Icone } from "./Icone";

export interface Categoria {
    id_categoria: number,
    id_usuario: number,
    id_icone: number,
    categoria: string,
    status: boolean,
}

export interface CategoriaConsulta {
    id_categoria: number,
    id_usuario: number,
    id_icone: number,
    categoria: string,
    status: boolean,
    icones: Icone
}

