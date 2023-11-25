
export interface Usuario {
    id_usuario: number,
    nome: string,
    email: string,
    senha: string,
    limite_gastos: number,
}

export interface UsuarioEditar {
    nome: string,
    email: string,
    senha: string,
    senha_antiga: string,
    limite_gastos: number,
}