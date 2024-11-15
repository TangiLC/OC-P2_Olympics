import { CountryDetail, CountryTotalData } from '../../models/Olympic';
import { Game } from '../../models/Participation';

export function calculateStats(olympics: CountryDetail[]): {
  countryData: CountryTotalData[];
  maxTotalParticipations: number;
} {
  if (!olympics) {
    return { countryData: [], maxTotalParticipations: 0 };
  }

  const countryData = olympics.map((country: CountryDetail) => {
    const name = country.country;
    const totalParticipations = country.participations.length;
    const totalMedalCount = country.participations.reduce(
      (acc: number[], participation: Game) => {
        return [
          acc[0] + (participation.medalsCount[0] || 0),
          acc[1] + (participation.medalsCount[1] || 0),
          acc[2] + (participation.medalsCount[2] || 0),
        ];
      },
      [0, 0, 0]
    );
    const totalAthleteCount = country.participations.reduce(
      (acc: number, participation: Game) => acc + participation.athleteCount,
      0
    );

    return {
      name,
      totalParticipations,
      totalMedalCount,
      totalAthleteCount,
      participations: country.participations,
    };
  });

  const maxTotalParticipations = Math.max(
    ...countryData.map((country) => country.totalParticipations)
  );

  return { countryData, maxTotalParticipations };
}
