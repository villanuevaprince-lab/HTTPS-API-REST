import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Post } from '../modelli/post';
import { PostService } from '../services/post-service';

@Component({
  selector: 'app-posts',
  imports: [JsonPipe],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts {
  private readonly postService = inject(PostService);

  readonly post = signal<Post | null>(null);
  readonly posts = signal<Post[]>([]);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);
  readonly pagina = signal(1);
  readonly paginazioneAttiva = signal(false);

  caricaUno(numero: string): void {
    const id = Number(numero);
    if (!Number.isInteger(id) || id < 1) {
      this.errore.set('Inserisci un numero di post valido (almeno 1).');
      return;
    }
    this.post.set(null);
    this.inizia();
    this.postService.getPost(id).subscribe({
      next: (dato) => {
        this.post.set(dato);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => this.gestisciErrore(err),
    });
  }

  caricaTutti(): void {
    this.posts.set([]);
    this.paginazioneAttiva.set(false);
    this.inizia();
    this.postService.getPosts().subscribe({
      next: (dati) => {
        this.posts.set(dati);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => this.gestisciErrore(err),
    });
  }

  invia(): void {
    this.post.set(null);
    this.inizia();
    const nuovo = { userId: 1, title: 'Primo post da Angular', body: 'Inviato con HttpClient' };
    this.postService.addPost(nuovo).subscribe({
      next: (risposta) => {
        this.post.set(risposta);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => this.gestisciErrore(err),
    });
  }

  caricaPagina(numero: number): void {
    if (this.loading() || numero < 1 || numero > 10) return;
    this.inizia();
    this.postService.getPagina(numero).subscribe({
      next: (dati) => {
        this.pagina.set(numero);
        this.paginazioneAttiva.set(true);
        this.posts.set(dati);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => this.gestisciErrore(err),
    });
  }

  private inizia(): void {
    this.loading.set(true);
    this.errore.set(null);
  }

  private gestisciErrore(err: HttpErrorResponse): void {
    this.errore.set(`Errore ${err.status}: ${err.message}`);
    this.loading.set(false);
  }
}
