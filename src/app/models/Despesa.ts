import { CategoriaConsulta } from "./Categoria";

export interface Despesa {
    id_categoria: number,
    despesa: string,
    valor: number,
    vencimento: string,
    pagamento: string,
}

export interface DespesaParcelada {
    id_categoria: number,
    despesa: string,
    valor: number,
    parcelas: number,
	data_primeiro_vencimento: string,
	dia_vencimento: number
}

export interface DespesaItem {
    id_despesa: number,
    id_usuario: number,
    id_categoria: number,
    despesa: string,
    valor: number,
    vencimento: string,
    pagamento: string,
    categorias: CategoriaConsulta,
}

export interface DespesaConsulta {
    despesas: DespesaItem[],
    total: number,
    valor_total: number,
    valor_pago: number,
    valor_aberto: number,
}

export interface DespesaPagamento {
    pagamento: string
}


