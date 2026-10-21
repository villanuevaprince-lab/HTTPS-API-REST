import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Apod } from '../modelli/apod';
import { NasaService } from '../services/nasa-service';

@Component({
  selector: 'app-nasa',
  templateUrl: './nasa.html',
  styleUrl: './nasa.css',
})
export class Nasa implements OnInit {
  private readonly nasaService = inject(NasaService);
  readonly apod = signal<Apod | null>(null);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);

  ngOnInit(): void {
    this.carica();
  }

  carica(data?: string): void {
    if (this.loading()) return;
    this.apod.set(null);
    this.errore.set(null);
    this.loading.set(true);
    const richiesta = data ? this.nasaService.getApodDel(data) : this.nasaService.getApod();
    richiesta.subscribe({
      next: (dati) => {
        this.apod.set(dati);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(this.messaggio(err));
        this.loading.set(false);
      },
    });
  }

  private messaggio(err: HttpErrorResponse): string {
    if (err.status === 403) return 'Chiave API mancante o non valida: controlla i file in src/environments.';
    if (err.status === 429) return 'Troppe richieste con questa chiave: riprova più tardi.';
    if (err.status === 0) return 'Il server non è raggiungibile: controlla la connessione.';
    const dettagli = err.error?.msg ?? err.error?.error?.message;
    return typeof dettagli === 'string'
      ? `Errore ${err.status} dal server della NASA: ${dettagli}`
      : `Errore ${err.status} dal server della NASA.`;
  }
}
