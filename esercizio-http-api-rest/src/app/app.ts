import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Todo } from './modelli/todo';
import { TodoService } from './services/todo-service';

@Component({
  selector: 'app-root',
  imports: [JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly todoService = inject(TodoService);

  readonly utente = signal(1);
  readonly todos = signal<Todo[]>([]);
  readonly loading = signal(false);
  readonly errore = signal<string | null>(null);
  readonly creato = signal<Todo | null>(null);
  readonly eliminazioneInCorso = signal<number | null>(null);
  readonly completate = computed(() => this.todos().filter((todo) => todo.completed).length);

  ngOnInit(): void {
    this.carica(1);
  }

  carica(userId: number): void {
    this.utente.set(userId);
    this.loading.set(true);
    this.errore.set(null);
    this.creato.set(null);
    this.todos.set([]);

    this.todoService.getTodos(userId).subscribe({
      next: (dati) => {
        if (this.utente() !== userId) return;
        this.todos.set(dati);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        if (this.utente() !== userId) return;
        this.errore.set(`Caricamento non riuscito (${err.status}): ${err.message}`);
        this.loading.set(false);
      },
    });
  }

  aggiungi(campo: HTMLInputElement): void {
    const titolo = campo.value.trim();
    if (!titolo) return;

    this.errore.set(null);
    this.todoService.addTodo({ userId: this.utente(), title: titolo, completed: false }).subscribe({
      next: (risposta) => {
        this.creato.set(risposta);
        campo.value = '';
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(`Invio non riuscito (${err.status}): ${err.message}`);
      },
    });
  }

  elimina(id: number): void {
    if (this.eliminazioneInCorso() !== null) return;
    this.errore.set(null);
    this.eliminazioneInCorso.set(id);

    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos.update((attivita) => attivita.filter((todo) => todo.id !== id));
        this.eliminazioneInCorso.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.errore.set(`Eliminazione non riuscita (${err.status}): ${err.message}`);
        this.eliminazioneInCorso.set(null);
      },
    });
  }
}
