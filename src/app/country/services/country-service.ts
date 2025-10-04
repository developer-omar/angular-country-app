import { inject, Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { RestCountry } from '../interfaces/rest-countries.interface';
import { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { Region } from '../interfaces/region.type';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<Region, Country[]>();

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();
    const url = `${API_URL}/capital/${query}`;

    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    console.log(`Llegando al servidor por ${query}`);

    return this.http.get<RestCountry[]>(url).pipe(
      map((restCountries) => CountryMapper.mapRestCountriesToCountryArray(restCountries)),
      tap((countries) => this.queryCacheCapital.set(query, countries)),
      catchError((error) => {
        console.log('Error fetching', error);
        return throwError(() => new Error('No se pudo obtener paises con ese termino de busqueda'));
      }),
    );
  }

  searchByCountry(query: string): Observable<Country[]> {
    const url = `${API_URL}/name/${query}`;
    query = query.toLowerCase();

    if (this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    return this.http.get<RestCountry[]>(url).pipe(
      map((restCountries) => CountryMapper.mapRestCountriesToCountryArray(restCountries)),
      tap((countries) => this.queryCacheCountry.set(query, countries)),
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

  searchByRegion(region: Region): Observable<Country[]> {
    const url = `${API_URL}/region/${region}`;

    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region) ?? []);
    }

    return this.http.get<RestCountry[]>(url).pipe(
      map((restCountries) => CountryMapper.mapRestCountriesToCountryArray(restCountries)),
      tap((countries) => this.queryCacheRegion.set(region, countries)),
      delay(2000),
      catchError((error) => {
        console.log('Error fetching', error);
        return throwError(() => new Error('No se pudo obtener paises con ese termino de busqueda'));
      }),
    );
  }
}
