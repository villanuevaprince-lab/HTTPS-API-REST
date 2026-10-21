import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CatFact } from '../modelli/cat-fact';

@Injectable({ providedIn: 'root' })
export class CatService {
  private readonly http = inject(HttpClient);

  getRandomFact(): Observable<CatFact> {
    return this.http.get<CatFact>('https://catfact.ninja/fact');
  }
}
