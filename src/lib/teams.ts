import type { Competition, Person } from '@wca/helpers';

const extId = 'org.cubingusa.natshelper.v1.Person';
// This could actually just be properties: object.
export type PersonExt = {
  properties?: {
    'scrambles-events': string[],
    'kind'?: string,
    'staff-team'?: string,
    'staff-team-others'?: string,
  },
};

export type TeamToPersonsMap = Map<string, Person[]>;

const DEFAULT_VAL = {
  properties: {
    'scrambles-events': [],
  }
};

export function teamForPerson(person: Person) {
  const ext = person.extensions.find(e => e.id === extId);

  const extData: PersonExt = ext ? ext.data as PersonExt : DEFAULT_VAL;
  return extData.properties ?
    extData.properties['staff-team'] || extData.properties['staff-team-others'] :
    undefined;
}

export function personIsInTeam(person: Person) {
  return teamForPerson(person) !== undefined;
}

const EURO_MAPPING: { [id:string]: string } = {
  '1': 'Giants',
  '2': 'Eguzkilore',
  '3': 'Pañuelico',
  '4': 'Lauburu',
  '5': 'Akelarre',
};

function prettyTeamId(teamId: string, competition: Competition) {
  if (competition.id !== "Euro2024") {
    return teamId;
  }
  const name = EURO_MAPPING[teamId];
  return name ? name : teamId;
}

export function sorter(competition: Competition) {
  const reverseMapping: typeof EURO_MAPPING = {};
  Object.keys(EURO_MAPPING).forEach((key: string) => {
    reverseMapping[EURO_MAPPING[key]] = key;
  });
  return (a: string, b: string) => {
    const realA = reverseMapping[a] ? reverseMapping[a] : a;
    const realB = reverseMapping[b] ? reverseMapping[b] : b;
    if (realA < realB) {
      return -1;
    } else if (realA > realB) {
      return 1;
    } else {
      return 0;
    }
  };
}

export function createTeamToPersonsMap(competition: Competition) {
  let teams: TeamToPersonsMap = new Map();
  competition.persons.forEach(p => {
    const team = teamForPerson(p);
    const teamId = prettyTeamId(team ? team : 'none', competition);
    const teamInMap = teams.get(teamId);
    if (teamInMap) {
      teamInMap.push(p);
    } else {
      teams.set(teamId, [p]);
    }
  });
  return teams;
}
