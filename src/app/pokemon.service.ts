import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getAllPokemon() {
    return this.http.get(`${this.apiUrl}/pokemon?limit=20`);
  }

  getPokemonDetails(url: string) {
    return this.http.get(url);
  }

  getPokemonSpecies(name: string): Observable<string> {
  return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon-species/${name}`).pipe(
    map((response: { flavor_text_entries: any[]; }) => {
      const englishEntry = response.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en'
      );
      return englishEntry ? englishEntry.flavor_text.replace(/\n|\f/g, ' ') : '';
    })
  );
}
}
