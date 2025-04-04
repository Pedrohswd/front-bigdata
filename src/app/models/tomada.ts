export interface Tomada {
    id: number;
    identificador_tomada: string;
    potencia_ativa: number;
    potencia_reativa: number;
    potencia_aparente: number;
    tensao_eficaz: number;
    corrente_eficaz: number;
    fator_de_potencia_total: number;
    potencia_gerada_ativa: number;
    frequencia: number;
    energia_ativa_consumida: number;
    estado_do_rele: number;
    intensidade_sinal_wifi: number;
    data_hora_salvamento: string;
    data_salvamento: string;
    hora_salvamento: string;
    consumo_hora: number;
}