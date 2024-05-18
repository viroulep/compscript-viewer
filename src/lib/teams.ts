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

export function createTeamToPersonsMap(competition: Competition) {
  let teams: TeamToPersonsMap = new Map();
  competition.persons.forEach(p => {
    const team = teamForPerson(p);
    const teamId = team ? team : 'none';
    const teamInMap = teams.get(teamId);
    if (teamInMap) {
      teamInMap.push(p);
    } else {
      teams.set(teamId, [p]);
    }
  });
  return teams;
}
