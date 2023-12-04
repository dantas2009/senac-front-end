export interface DashboardCards {
    despesas_atrasadas: number,
    despesas_pendentes: number,
    despesas_mes_atual: number,
    despesas_mes_anterior: number,
}

export interface DashboardLineAno {
    valores_por_mes: number[],
    despesas_qtd_ano: number,
    limite_gastos: number
}

export interface DashboardPie {
    categoria: string,
    valor: number
}

export interface DashboardPieMes {
    despesas_mes: DashboardPie[]
}

export interface DashboardPieAno {
    despesas_ano: DashboardPie[]
}
