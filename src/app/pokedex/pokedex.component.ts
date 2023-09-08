import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../pokemon.service'; // Import the service

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {
  pokemonList: any[] = [];

  constructor(private pokemonService: PokemonService) {} // Inject the service

  ngOnInit(): void {
    this.pokemonService.getAllPokemon().subscribe((data: any) => {
      this.pokemonList = data.results;
  
      this.pokemonList.forEach((pokemon: any) => {
        this.pokemonService.getPokemonDetails(pokemon.url).subscribe((details: any) => {
          pokemon.number = details.id;
          pokemon.image = details.sprites.front_default;
          pokemon.types = details.types.map((type: any) => type.type.name);
        });
      });
    });
  }
  
  
  
}
