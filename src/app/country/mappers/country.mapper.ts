import { Country } from '../interfaces/country.interface';

import { RestCountry } from '../interfaces/rest-countries.interface';

export class CountryMapper {
  constructor() {}

  static mapRestCountryToCountry(restCountry: RestCountry): Country {
    return {
      cca2: restCountry.cca2,
      flag: restCountry.flag,
      flagSvg: restCountry.flags.svg,
      name: restCountry.translations['spa'].common ?? 'No Spanish Name',
      capital: restCountry.capital?.join(','),
      population: restCountry.population,
      region: restCountry.region,
      subRegion: restCountry.subregion,
    };
  }

  static mapRestCountriesToCountryArray(restCountries: RestCountry[]): Country[] {
    // (country) => this.mapRestCountryToCountry(country)
    return restCountries.map(this.mapRestCountryToCountry);
  }
}
