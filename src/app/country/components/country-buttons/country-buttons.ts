import { Component, output, signal } from '@angular/core';
import { Region } from '../../interfaces/region.type';

@Component({
  selector: 'country-buttons',
  imports: [],
  templateUrl: './country-buttons.html',
})
export class CountryButtons {
  regions: Region[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania', 'Antarctic'];
  value = output<Region>();
  selectedRegion = signal<Region | null>(null);

  selectRegion(region: Region) {
    this.value.emit(region);
    this.selectedRegion.set(region);
  }
}
