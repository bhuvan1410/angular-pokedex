import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
}
