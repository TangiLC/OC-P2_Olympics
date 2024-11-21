import { CountryDetail, CountryTotalData } from '../../models/Olympic';
import { Game } from '../../models/Participation';

// Return total participations, medals and athletes of a selected country
export function calculateStats(olympics: CountryDetail[] | null): {
  countryData: CountryTotalData[];
  maxTotalParticipations: number;
} {
  if (!olympics || olympics.length === 0) {
    return { countryData: [], maxTotalParticipations: 0 };
  }

  const countryData = olympics.map((country: CountryDetail) => {
    const name = country.country;
    const totalParticipations = country.participations.length;
    const totalMedalCount = country.participations.reduce(
      (acc: number[], participation: Game) => {
        const medals = participation.medalsCount || [];
        const normalizedMedals = [
          medals[0] || 0,
          medals[1] || 0,
          medals[2] || 0,
        ];
        return [
          acc[0] + normalizedMedals[0],
          acc[1] + normalizedMedals[1],
          acc[2] + normalizedMedals[2],
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
    };
  });

  const maxTotalParticipations = Math.max(
    ...countryData.map((country) => country.totalParticipations)
  );

  return { countryData, maxTotalParticipations };
}
