import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Pokemon } from '../modelli/pokemon';
import { PokemonService } from '../services/pokemon-service';

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.css',
})
export class Pokedex implements OnInit {
  private readonly pokemonService = inject(PokemonService);
  readonly tipi = signal<string[]>([]);
  readonly pokemon = signal<Pokemon | null>(null);
  readonly loadingTipi = signal(false);
  readonly loadingPokemon = signal(false);
  readonly erroreTipi = signal<string | null>(null);
  readonly errorePokemon = signal<string | null>(null);

  ngOnInit(): void {
    this.loadingTipi.set(true);
    this.pokemonService.getTypes().subscribe({
      next: (dati) => {
        this.tipi.set(dati.results.map((tipo) => tipo.name));
        this.loadingTipi.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.erroreTipi.set(`Impossibile caricare i tipi (errore ${err.status}).`);
        this.loadingTipi.set(false);
      },
    });
  }

  cerca(valore: string): void {
    if (this.loadingPokemon()) return;
    const query = valore.trim().toLowerCase();
    this.pokemon.set(null);
    this.errorePokemon.set(null);
    if (!query) {
      this.errorePokemon.set('Inserisci il nome o il numero di un Pokémon.');
      return;
    }
    this.loadingPokemon.set(true);
    this.pokemonService.getPokemon(query).subscribe({
      next: (dato) => {
        this.pokemon.set(dato);
        this.loadingPokemon.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorePokemon.set(err.status === 404 ? 'Pokémon non trovato.' : `Ricerca non riuscita (errore ${err.status}).`);
        this.loadingPokemon.set(false);
      },
    });
  }
}
