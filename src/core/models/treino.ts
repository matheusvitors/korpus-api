import { Divisao } from "@/core/models/rotina";

export interface Treino {
	id: string;
	nome: string;
	usuarioId: string;

	divisoes?: Divisao[];
}
