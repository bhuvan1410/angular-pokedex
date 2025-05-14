import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Pokemon {
  id: number;
  name: string;
  image: string;
  type: string[];
  description: string;
  evolvesTo?: string;
}

@Component({
  selector: 'app-pokedex',
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {
  pokedex: Pokemon[] = [];
  paginatedPokedex: Pokemon[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPokemon();
  }

  async loadPokemon() {
    const limit = 151; // Gen 1
    const response: any = await this.http
      .get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
      .toPromise();

    for (let [index, pokemonInfo] of response.results.entries()) {
      const id = index + 1;
      const pokemonDetails = await this.http
        .get<{ sprites: { front_default: string }, types: { type: { name: string } }[] }>(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .toPromise();

      const speciesDetails: any = await this.http
        .get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        .toPromise();

      const descriptionObj = speciesDetails.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en'
      );

      const evolvesTo = await this.getEvolution(id);

      this.pokedex.push({
        id,
        name: pokemonInfo.name,
        image: pokemonDetails?.sprites?.front_default || '',
        type: (pokemonDetails?.['types'] ?? []).map((t: any) => t.type.name),
        description: descriptionObj?.flavor_text.replace(/\f/g, ' ') || '',
        evolvesTo
      });
    }

    this.paginate();
  }

  async getEvolution(id: number): Promise<string | undefined> {
    try {
      const speciesData: any = await this.http
        .get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        .toPromise();
      const evoChainUrl = speciesData.evolution_chain.url;

      const evoChainData: any = await this.http.get(evoChainUrl).toPromise();

      const chain = evoChainData.chain;
      if (chain.evolves_to.length > 0) {
        const evolved = chain.evolves_to[0].species.name;
        if (chain.species.name === speciesData.name) return evolved;
      }
    } catch {
      return undefined;
    }
    return undefined;
  }

  paginate() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedPokedex = this.filteredPokedex().slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPokedex().length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  filteredPokedex() {
    return this.pokedex.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}