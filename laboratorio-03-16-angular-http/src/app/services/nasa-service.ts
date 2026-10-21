import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Apod } from '../modelli/apod';

@Injectable({ providedIn: 'root' })
export class NasaService {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://api.nasa.gov/planetary/apod';

  getApod(): Observable<Apod> {
    return this.http.get<Apod>(this.url, { params: { api_key: environment.nasaApiKey } });
  }

  getApodDel(data: string): Observable<Apod> {
    return this.http.get<Apod>(this.url, { params: { api_key: environment.nasaApiKey, date: data } });
  }
}
