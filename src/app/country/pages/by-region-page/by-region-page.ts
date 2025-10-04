import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

import { CountryList } from '../../components/country-list/country-list';
import { CountryService } from '../../services/country-service';
import { CountryButtons } from '../../components/country-buttons/country-buttons';
import { Region } from '../../interfaces/region.type';

@Component({
  selector: 'by-region-page',
  imports: [CountryButtons, CountryList],
  templateUrl: './by-region-page.html',
})
export class ByRegionPage {
  selectedRegion = signal<Region | null>(null);
  countryService = inject(CountryService);

  countryResource = rxResource({
    params: () => ({ region: this.selectedRegion() }),
    stream: ({ params: params }) => {
      if (!params.region) return of([]);
      return this.countryService.searchByRegion(params.region);
    },
  });
}
