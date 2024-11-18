import { calculateStats } from './calculate.utils';
import { CountryDetail } from '../../models/Olympic';

describe('calculateStats', () => {
  it('should return default values when input is null or undefined', () => {
    expect(calculateStats(null)).toEqual({
      countryData: [],
      maxTotalParticipations: 0,
    });
  });

  it('should return empty data and zero maxTotalParticipations for empty array input', () => {
    const result = calculateStats([]);
    expect(result).toEqual({ countryData: [], maxTotalParticipations: 0 });
  });

  it('should calculate stats for a single country with multiple participations', () => {
    const mockOlympics: CountryDetail[] = [
      {
        id: 1,
        country: 'Country A',
        participations: [
          {
            id: 1,
            year: 1988,
            city: 'Seoul',
            medalsCount: [2, 1, 0],
            athleteCount: 100,
          },
          {
            id: 2,
            year: 1992,
            city: 'Barcelona',
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
        //participations: mockOlympics[0].participations,
      },
    ]);

    expect(result.maxTotalParticipations).toBe(2);
  });

  it('should calculate stats for multiple countries', () => {
    const mockOlympics: CountryDetail[] = [
      {
        id: 1,
        country: 'Country A',
        participations: [
          {
            id: 1,
            year: 1988,
            city: 'Seoul',
            medalsCount: [2, 1, 0],
            athleteCount: 100,
          },
        ],
      },
      {
        id: 2,
        country: 'Country B',
        participations: [
          {
            id: 2,
            year: 1992,
            city: 'Barcelona',
            medalsCount: [5, 3, 1],
            athleteCount: 150,
          },
          {
            id: 3,
            year: 1996,
            city: 'Atlanta',
            medalsCount: [6, 4, 2],
            athleteCount: 200,
          },
        ],
      },
    ];

    const result = calculateStats(mockOlympics);

    expect(result.countryData).toEqual([
      {
        name: 'Country A',
        totalParticipations: 1,
        totalMedalCount: [2, 1, 0],
        totalAthleteCount: 100,
        //participations: mockOlympics[0].participations,
      },
      {
        name: 'Country B',
        totalParticipations: 2,
        totalMedalCount: [11, 7, 3], // [5+6, 3+4, 1+2]
        totalAthleteCount: 350, // 150+200
        //participations: mockOlympics[1].participations,
      },
    ]);

    expect(result.maxTotalParticipations).toBe(2);
  });

  it('should handle countries with no participations', () => {
    const mockOlympics: CountryDetail[] = [
      {
        id: 1,
        country: 'Country A',
        participations: [], // No participations
      },
    ];

    const result = calculateStats(mockOlympics);

    expect(result.countryData).toEqual([
      {
        name: 'Country A',
        totalParticipations: 0,
        totalMedalCount: [0, 0, 0],
        totalAthleteCount: 0,
        //participations: [],
      },
    ]);

    expect(result.maxTotalParticipations).toBe(0);
  });
});
