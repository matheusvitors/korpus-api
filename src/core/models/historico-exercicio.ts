export interface HistoricoExercicio {
	id: string;
	exercicioId: string;
	divisaoId: string;
	ordem: number;
	series: number;
	repeticoes: {
		minimo: number;
		maximo: number;
	};
}
