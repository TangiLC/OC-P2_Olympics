import { Game } from './Participation';

export interface CountryDetail {
  id: number;
  country: string;
  shortName:string;
  participations: Game[];
}

export interface CountryTotalData {
  name: string;
  totalParticipations: number;
  totalMedalCount: number[];
  totalAthleteCount: number;
}

/*example of an olympic country:
{
    "id": 1,
    "country": "Italy",
    "participations": [
      { "id": 1, "year": 1988, "city": "Séoul", "medalsCount": [4, 6, 4], "athleteCount": 263 },
      { "id": 2, "year": 1992, "city": "Barcelone", "medalsCount": [6, 5, 8], "athleteCount": 318 },
      { "id": 3, "year": 1996, "city": "Atlanta", "medalsCount": [13, 10, 12], "athleteCount": 346 },
      { "id": 4, "year": 2000, "city": "Sydney", "medalsCount": [13, 8, 13], "athleteCount": 361 },
      { "id": 5, "year": 2004, "city": "Athènes", "medalsCount": [10, 11, 11], "athleteCount": 364 },
      { "id": 6, "year": 2008, "city": "Pékin", "medalsCount": [8, 10, 10], "athleteCount": 347 },
      { "id": 7, "year": 2012, "city": "Londres", "medalsCount": [8, 9, 11], "athleteCount": 372 },
      { "id": 8, "year": 2016, "city": "Rio de Janeiro", "medalsCount": [8, 12, 8], "athleteCount": 375 },
      { "id": 9, "year": 2020, "city": "Tokyo", "medalsCount": [10, 10, 20], "athleteCount": 381 },
      { "id": 10, "year": 2024, "city": "Paris", "medalsCount": [10, 11, 15], "athleteCount": 390 }
    ]
  }
*/
