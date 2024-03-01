import type { Business } from "../include/data.js";

export class FluentBusinesses {
  private data: Business[];

  constructor(data: Business[]) {
    this.data = data;
  }

  getData(): Business[] {
    return this.data;
  }

  fromCityInState(city: string, state: string): FluentBusinesses {
    const filteredBusinesses = this.data.filter(business => business.city === city && business.state === state);
    return new FluentBusinesses(filteredBusinesses);
  }

  hasStarsGeq(stars: number): FluentBusinesses {
    const filteredBusinesses = this.data.filter(business => business.stars !== undefined && business.stars >= stars);
    return new FluentBusinesses(filteredBusinesses);
  }

  inCategory(category: string): FluentBusinesses {
    const filteredBusinesses = this.data.filter(
      business => business.categories && business.categories.includes(category)
    );
    return new FluentBusinesses(filteredBusinesses);
  }

  hasHoursOnDays(days: string[]): FluentBusinesses {
    const filteredBusinesses = this.data.filter(business => {
      return days.every(day => Object.keys(business.hours ?? {}).includes(day));
    });
    return new FluentBusinesses(filteredBusinesses);
  }

  hasAmbience(ambience: string): FluentBusinesses {
    const filteredBusinesses = this.data.filter(business => {
      return business.attributes?.Ambience?.[ambience] === true;
    });
    return new FluentBusinesses(filteredBusinesses);
  }

  // Helper Method for getTopBusiness()
  compareBusinesses(a: Business, b: Business, primary: keyof Business, secondary: keyof Business): number {
    const primaryA = a[primary] ?? 0;
    const primaryB = b[primary] ?? 0;
    const secondaryA = a[secondary] ?? 0;
    const secondaryB = b[secondary] ?? 0;

    if (primaryA > primaryB) {
      return 1;
    } else if (primaryA < primaryB) {
      return -1;
    } else {
      if (secondaryA > secondaryB) {
        return 1;
      } else if (secondaryA < secondaryB) {
        return -1;
      } else {
        return 0;
      }
    }
  }

  // Helper Method for bestPlace() and mostReviews()
  getTopBusiness(primary: keyof Business, secondary: keyof Business): Business | undefined {
    if (this.data.length === 0) {
      return undefined;
    }

    return this.data.reduce((topBusiness, currentBusiness) => {
      return this.compareBusinesses(currentBusiness, topBusiness, primary, secondary) > 0
        ? currentBusiness
        : topBusiness;
    });
  }

  bestPlace(): Business | undefined {
    return this.getTopBusiness("stars", "review_count");
  }

  mostReviews(): Business | undefined {
    return this.getTopBusiness("review_count", "stars");
  }
}
