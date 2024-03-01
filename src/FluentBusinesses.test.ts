import assert from "assert";
import { Business } from "../include/data.js";
import { FluentBusinesses } from "./FluentBusinesses";

const testData: Business[] = [
  {
    business_id: "abcd",
    name: "Applebee's",
    city: "Charlotte",
    state: "NC",
    stars: 4,
    review_count: 6,
    categories: ["American (Traditional)", "Restaurants"],
    hours: {
      Monday: "9:00-17:00",
      Tuesday: "9:00-17:00",
      Wednesday: "9:00-17:00",
    },
    attributes: {
      Ambience: {
        romantic: false,
        intimate: false,
        classy: false,
        hipster: true,
      },
    },
  },
  {
    business_id: "abcd",
    name: "China Garden",
    state: "NC",
    city: "Charlotte",
    stars: 4,
    review_count: 10,
    categories: ["Chinese", "Restaurants"],
    hours: {
      Tuesday: "9:00-17:00",
      Wednesday: "9:00-17:00",
      Thursday: "9:00-17:00",
    },
    attributes: {
      Ambience: {
        romantic: false,
        intimate: true,
        classy: false,
        hipster: false,
      },
    },
  },
  {
    business_id: "abcd",
    name: "Beach Ventures Roofing",
    state: "AZ",
    city: "Phoenix",
    stars: 3,
    review_count: 30,
    categories: ["Roofing", "Home Services"],
    hours: {
      Monday: "9:00-17:00",
      Wednesday: "9:00-17:00",
      Friday: "9:00-17:00",
    },
    attributes: {
      Ambience: {
        romantic: true,
        intimate: false,
        classy: false,
        hipster: false,
      },
    },
  },
  {
    business_id: "abcd",
    name: "Alpaul Automobile Wash",
    city: "Charlotte",
    state: "NC",
    stars: 3,
    review_count: 30,
    categories: ["Automotive", "Car Wash"],
    hours: {
      Tuesday: "9:00-17:00",
      Wednesday: "9:00-17:00",
      Sunday: "9:00-17:00",
    },
    attributes: {
      Ambience: {
        romantic: false,
        intimate: false,
        classy: true,
        hipster: false,
      },
    },
  },
];

describe("fromCityInState", () => {
  it("filters businesses correctly by city and state", () => {
    const list = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").getData();
    const list2 = new FluentBusinesses(testData).fromCityInState("Phoenix", "AZ").getData();

    assert(list.length === 3);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
    assert(list[2].name === "Alpaul Automobile Wash");
    assert(list2.length === 1);
    assert(list2[0].name === "Beach Ventures Roofing");
  });

  it("returns an empty list when no matching businesses are found", () => {
    const list = new FluentBusinesses(testData).fromCityInState("Nonexistent", "XX").getData();

    assert(list.length === 0);
  });
});

describe("hasStarsGeq", () => {
  it("filters businesses with stars greater than or equal to the given value", () => {
    const list = new FluentBusinesses(testData).hasStarsGeq(4).getData();

    assert(list.length === 2);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
  });
});

describe("inCategory", () => {
  it("filters businesses in the given category", () => {
    const list = new FluentBusinesses(testData).inCategory("Restaurants").getData();

    assert(list.length === 2);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
  });

  it("returns an empty list if no businesses match the category", () => {
    const list = new FluentBusinesses(testData).inCategory("Nonexistent Category").getData();

    assert(list.length === 0);
  });
});

describe("hasHoursOnDays", () => {
  it("filters businesses correctly by open days", () => {
    const list = new FluentBusinesses(testData).hasHoursOnDays(["Wednesday"]).getData();
    const list2 = new FluentBusinesses(testData).hasHoursOnDays(["Monday"]).getData();

    assert(list.length === 4);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
    assert(list[2].name === "Beach Ventures Roofing");
    assert(list[3].name === "Alpaul Automobile Wash");
    assert(list2.length === 2);
    assert(list2[0].name === "Applebee's");
    assert(list2[1].name === "Beach Ventures Roofing");
  });

  it("returns an empty list when no matching businesses are found", () => {
    const list = new FluentBusinesses(testData).hasHoursOnDays(["Saturday"]).getData();

    assert(list.length === 0);
  });
});

describe("hasAmbience", () => {
  it("filters businesses with the given ambience", () => {
    const list = new FluentBusinesses(testData).hasAmbience("intimate").getData();

    assert(list.length === 1);
    assert(list[0].name === "China Garden");
  });

  it("returns an empty list if no businesses have the specified ambience", () => {
    const list = new FluentBusinesses(testData).hasAmbience("nonexistentAmbience").getData();

    assert(list.length === 0);
  });
});

describe("getTopBusiness", () => {
  it("returns the top business based on primary and secondary attributes", () => {
    const topStars = new FluentBusinesses(testData).getTopBusiness("stars", "review_count");
    assert(topStars);
    assert(topStars.name === "China Garden");

    const topReviews = new FluentBusinesses(testData).getTopBusiness("review_count", "stars");
    assert(topReviews);
    assert(topReviews.name === "Beach Ventures Roofing");
  });

  it("returns undefined when no businesses are available", () => {
    const topBusiness = new FluentBusinesses([]).getTopBusiness("stars", "review_count");
    assert(!topBusiness);
  });
});

describe("compareBusinesses", () => {
  it("compares businesses based on primary attribute", () => {
    const comparison = new FluentBusinesses(testData).compareBusinesses(
      testData[0],
      testData[1],
      "stars",
      "review_count"
    );

    assert(comparison === -1);
  });

  it("breaks tie with secondary attribute", () => {
    const comparison = new FluentBusinesses(testData).compareBusinesses(
      testData[0],
      testData[1],
      "stars",
      "review_count"
    );

    assert(comparison === -1);
  });

  it("returns 0 when both primary and secondary attributes are equal", () => {
    const comparison = new FluentBusinesses(testData).compareBusinesses(
      testData[2],
      testData[3],
      "stars",
      "review_count"
    );

    assert(comparison === 0);
  });

  it("handles missing primary and secondary attributes", () => {
    const tempBusiness: Business = {
      business_id: "4",
      name: "Business D",
    };
    const comparison = new FluentBusinesses(testData).compareBusinesses(
      testData[0],
      tempBusiness,
      "stars",
      "review_count"
    );

    assert(comparison === 1);
  });
});

describe("bestPlace", () => {
  it("filters correctly", () => {
    const list = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").getData();

    assert(list.length === 3);
    assert(list[0].name === "Applebee's");
    assert(list[1].name === "China Garden");
    assert(list[2].name === "Alpaul Automobile Wash");
  });

  it("break tie with review count", () => {
    const best = new FluentBusinesses(testData).fromCityInState("Charlotte", "NC").bestPlace();

    assert(best);
    assert(best.name === "China Garden");
  });

  it("returns undefined when no businesses are available", () => {
    const best = new FluentBusinesses([]).bestPlace();

    assert(!best);
  });
});

describe("mostReviews", () => {
  it("returns the business with the most reviews, breaking ties with star rating", () => {
    const mostReviewed = new FluentBusinesses(testData).mostReviews();

    assert(mostReviewed);
    assert(mostReviewed.name === "Beach Ventures Roofing");
  });

  it("returns undefined when no businesses are available", () => {
    const mostReviewed = new FluentBusinesses([]).mostReviews();

    assert(!mostReviewed);
  });
});
