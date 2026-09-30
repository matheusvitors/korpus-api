import { HistoricoExercicio } from "@/core/models/historico-exercicio";

export interface Rotina {
	id: string;
	treinoId: string;
	nome: string;
	exercicios: HistoricoExercicio[];
}
