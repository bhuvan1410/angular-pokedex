import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PokeService {
  constructor(private http: HttpClient) {}

  getAllPokemon() {
    return this.http.get('https://pokeapi.co/api/v2/pokemon?limit=40');
  }

  getPokemonDetails(name: string) {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
  }
}