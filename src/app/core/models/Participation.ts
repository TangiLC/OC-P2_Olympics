export interface Game {
  id: number;
  year: number;
  city: string;
  medalsCount: [number, number, number]; //  [gold,silver,bronze]
  athleteCount: number;
}

/*
example of participation:
{ "id": 1, "year": 1988, "city": "Séoul", "medalsCount": [4, 6, 4], "athleteCount": 263 },
*/
