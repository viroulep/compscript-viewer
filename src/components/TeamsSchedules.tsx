import type { Activity, Competition, Person, Room, Schedule, Venue } from '@wca/helpers';
import { useMemo } from 'react';

import FullCalendar from '@fullcalendar/react';
import { formatDate } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
//import { Resource } from '@fullcalendar/resource/inter';


const extId = 'org.cubingusa.natshelper.v1.Person';
// This could actually just be properties: object.
type PersonExt = {
  properties?: {
    'scrambles-events': string[],
    'kind'?: string,
    'staff-team'?: string,
  },
};

type TeamToPersonsMap = {
  [id: string]: Person[];
};

const DEFAULT_VAL = {
  properties: {
    'scrambles-events': [],
  }
};

function teamForPerson(person: Person) {
  const ext = person.extensions.find(e => e.id === extId);

  const extData: PersonExt = ext ? ext.data as PersonExt : DEFAULT_VAL;
  return extData.properties ? extData.properties['staff-team'] : undefined;
}

function personIsInTeam(person: Person) {
  return teamForPerson(person) !== undefined;
}

function asResources(persons: Person[]) {
  return persons.filter(personIsInTeam).map(p => ({
    id: p.wcaUserId.toString(),
    title: p.name,
    teamId: `Team ${teamForPerson(p)}`,
  }));
}

// I'm sure this exists somewhere!
// It looks like Calendar::formatIso but I can't seem to import it.
function toIsoDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

type PartialActivity = {
  venueName: string,
  roomName: string,
  roomColor: string,
  name: string,
  activityCode: string,
  start: string,
  end: string,
};

type IdToActivityMap = {
  [id: number]: PartialActivity,
};

function toPartialActivity(v: Venue, r: Room, a: Activity): PartialActivity {
  return {
    venueName: v.name,
    roomName: r.name,
    roomColor: r.color,
    name: a.name,
    activityCode: a.activityCode,
    start: a.startTime,
    end: a.endTime,
  }
}

function computeActivitiesById(sched: Schedule): IdToActivityMap {
  let ret: IdToActivityMap = {};
  sched.venues.forEach(v => v.rooms.forEach(r => r.activities.forEach(a => {
    ret[a.id] = toPartialActivity(v, r, a);
    a.childActivities.forEach(ca => {
      ret[ca.id] = toPartialActivity(v, r, ca);
    })
  })));
  return ret;
}

function shortCode(code: string): string {
  const [mainAssign, subAssign] = code.split('-');
  switch (mainAssign) {
    case 'competitor':
      return 'C';
    case 'staff':
      return subAssign[0].toUpperCase();
    default:
      return '?';
  }
}

function computeEvents(persons: Person[], partialActivities: IdToActivityMap) {
  return persons.flatMap(p => (p.assignments || []).map(a => {
    const { activityCode, start, end, roomColor } = partialActivities[a.activityId];

    return {
      start,
      end,
      resourceId: p.wcaUserId.toString(),
      allDay: false,
      title: `${shortCode(a.assignmentCode)}-${activityCode}`,
      backgroundColor: roomColor,
      textColor: roomColor === '#f7ef18' ? 'black' : 'white',
    };
  }));
}

export default function TeamsSchedules({
  competition,
} : {
  competition: Competition
}) {
  const resources = useMemo(
    () => asResources(competition.persons),
    [competition.persons]
  );
  const scheduleActivities = useMemo(
    () => computeActivitiesById(competition.schedule),
    [competition.schedule]
  );

  const events = useMemo(
    () => computeEvents(competition.persons, scheduleActivities),
    [competition.persons, scheduleActivities]
  );

  const startDate = new Date(competition.schedule.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + competition.schedule.numberOfDays);
  console.log(competition.schedule.venues);

  return (
    <FullCalendar
      schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
      plugins={[dayGridPlugin, resourceTimelinePlugin, interactionPlugin]}
      initialView="compDayView"
      initialDate={competition.schedule.startDate}
      titleFormat={{
        year: 'numeric', month: 'short', day: 'numeric', weekday: 'short'
      }}
      validRange={{
        start: toIsoDate(startDate),
        end: toIsoDate(endDate),
      }}
      views={{
        compDayView: {
          type: 'resourceTimeline',
          duration: { days: 1 },
        },
      }}
      dayHeaderFormat={{
        weekday: 'short'
      }}
      slotMinTime="08:00:00"
      slotMaxTime="21:00:00"
      slotLabelFormat={{
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
      }}
      resourceOrder="teamId,title"
      resourceGroupField="teamId"
      resourcesInitiallyExpanded={false}
      resources={resources}
      events={events}
    />
  )
}
