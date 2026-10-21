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

  private inizia(): void {
    this.loading.set(true);
    this.errore.set(null);
  }

  private gestisciErrore(err: HttpErrorResponse): void {
    this.errore.set(`Errore ${err.status}: ${err.message}`);
    this.loading.set(false);
  }
}
