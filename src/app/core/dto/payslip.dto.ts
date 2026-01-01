import { ErrorResponseDto } from "./error-response.dto";

export interface PayslipDto {
    id?: string;
    templateId: string;
    fileName?: string;
    extractedData: PayslipContent;
    createdAt: string;
    extractionErrors?: ErrorResponseDto[];
}

export interface PayslipContent {
    anagrafica: {
        azienda: string;
        cf_azienda: string;
        dipendente: string;
        cf_dipendente: string;
        data_nascita: string;
        indirizzo_lavoratore: string;
        domicilio_fiscale: string;
    };
    inquadramento: {
        qualifica: string;
        livello: string;
        mansione: string;
        tipo_rapporto: string;
        data_assunzione: string;
        ccnl_divisione: string;
    };
    periodo: {
        mese: string;
        anno: string;
        foglio_n: string;
    };
    contatori_ratei: {
        ferie: RateoDettaglio;
        permessi_rol: RateoDettaglio;
    };
    corpo_busta: VoceBusta[];
    totali: {
        netto_a_pagare: number;
        imponibile_inps: number;
        imponibile_irpef: number;
    };
}

interface RateoDettaglio {
    residuo_precedente: string;
    maturato: string;
    goduto: string;
    saldo: string;
}

interface VoceBusta {
    voce: string;
    descrizione: string;
    base: string;
    competenza: string;
    trattenuta: string;
}