import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Pokemon, PokemonTypeList } from '../modelli/pokemon';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://pokeapi.co/api/v2';

  getTypes(): Observable<PokemonTypeList> {
    return this.http.get<PokemonTypeList>(`${this.url}/type`);
  }

  getPokemon(nomeONumero: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.url}/pokemon/${encodeURIComponent(nomeONumero.toLowerCase())}`);
  }
}
