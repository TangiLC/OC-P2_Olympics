import { calculateStats } from './calculate.utils';
import { CountryDetail } from '../../models/Olympic';

describe('calculateStats', () => {
  it('should return default values when input is null or empty', () => {
    expect(calculateStats(null)).toEqual({
      countryData: [],
      maxTotalParticipations: 0,
    });
    expect(calculateStats([])).toEqual({
      countryData: [],
      maxTotalParticipations: 0,
    });
  });

  it('should calculate stats for a country with multiple participations', () => {
    const mockOlympics: CountryDetail[] = [
      {
        country: 'Country A',
        participations: [
          {
            year: 1988,
            city: 'Seoul',
            medalsCount: [2, 1, 0],
            athleteCount: 100,
          },
          {
            year: 1992,
            city: 'Barce',
            medalsCount: [3, 2, 1],
            athleteCount: 120,
          },
        ],
      },
    ];
    const result = calculateStats(mockOlympics);
    expect(result.countryData).toEqual([
      {
        name: 'Country A',
        totalParticipations: 2,
        totalMedalCount: [5, 3, 1],
        totalAthleteCount: 220,
      },
    ]);
    expect(result.maxTotalParticipations).toBe(2);
  });

  it('should calculate stats for multiple countries', () => {
    const mockOlympics: CountryDetail[] = [
      {
        country: 'Country A',
        participations: [
          {
            year: 1992,
            city: 'Barce',
            medalsCount: [3, 2, 1],
            athleteCount: 120,
          },
        ],
      },
      {
        country: 'Country B',
        participations: [
          {
            year: 1988,
            city: 'Seoul',
            medalsCount: [9, 8, 7],
            athleteCount: 50,
          },
          {
            year: 1992,
            city: 'Barce',
            medalsCount: [1, 2, 3],
            athleteCount: 100,
          },
        ],
      },
    ];

    const result = calculateStats(mockOlympics);

    expect(result.countryData).toEqual([
      {
        name: 'Country A',
        totalParticipations: 1,
        totalMedalCount: [3, 2, 1],
        totalAthleteCount: 120,
      },
      {
        name: 'Country B',
        totalParticipations: 2,
        totalMedalCount: [10, 10, 10],
        totalAthleteCount: 150,
      },
    ]);

    expect(result.maxTotalParticipations).toBe(2);
  });

  it('should handle countries with no participations', () => {
    const mockOlympics: CountryDetail[] = [
      { country: 'Country A', participations: [] },
    ];

    const result = calculateStats(mockOlympics);

    expect(result.countryData).toEqual([
      {
        name: 'Country A',
        totalParticipations: 0,
        totalMedalCount: [0, 0, 0],
        totalAthleteCount: 0,
      },
    ]);

    expect(result.maxTotalParticipations).toBe(0);
  });
});
