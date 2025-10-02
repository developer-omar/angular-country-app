import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestCountry } from '../interfaces/rest-countries.interface';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();
    return this.http.get<RestCountry[]>(`${API_URL}/capital/${query}`).pipe(
      map((restCountries) => CountryMapper.mapRestCountriesToCountryArray(restCountries)),
      catchError((error) => {
        console.log('Error fetching', error);
        return throwError(() => new Error('No se pudo obtener paises con ese termino de busqueda'));
      }),
    );
  }

  searchByCountry(query: string): Observable<Country[]> {
    query = query.toLowerCase();
    return this.http.get<RestCountry[]>(`${API_URL}/name/${query}`).pipe(
      map((restCountries) => CountryMapper.mapRestCountriesToCountryArray(restCountries)),
      delay(2000),
      catchError((error) => {
        console.log('Error fetching', error);
        return throwError(() => new Error('No se pudo obtener paises con ese termino de busqueda'));
      }),
    );
  }

  searchCountryByAlphaCode(code: string) {
    return this.http.get<RestCountry[]>(`${API_URL}/alpha/${code}`).pipe(
      map((restCountries) => CountryMapper.mapRestCountriesToCountryArray(restCountries)),
      map((countries) => countries.at(0)),
      catchError((error) => {
        console.log('Error fetching', error);
        return throwError(() => new Error('No se pudo obtener paises con ese codigo ${code}'));
      }),
    );
  }
}
