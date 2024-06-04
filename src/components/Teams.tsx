import { useContext, useMemo } from "react";

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Link from '@mui/material/Link';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import { Person } from "@wca/helpers";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { WCIFContext } from "@/lib/WCIFContext";
import { createTeamToPersonsMap } from "@/lib/teams";

function isLeader(person: Person) {
  return (person.roles || []).includes("delegate");
}

function PersonItem({ p } : { p: Person }) {
  const { name, wcaId, avatar } = p;
  const url = wcaId ? `https://www.worldcubeassociation.org/persons/${wcaId}` : '#';
  return (
    <ListItem component={Link} href={url} target="_blank" rel="noreferrer" dense sx={{p: 0}}>
      <ListItemAvatar>
        {avatar ? (
          <Avatar src={avatar.thumbUrl} />
        ) : (
          <Avatar>
            AA
          </Avatar>
        )}
      </ListItemAvatar>
      <ListItemText primary={name} secondary={wcaId} />
    </ListItem>
  );
}

function comparePerson(a: Person, b: Person) {
  return a.name.localeCompare(b.name);
}

function Team({ id, persons } : { id: string, persons: Person[] }) {
  const leaders = persons.filter(isLeader).sort(comparePerson);
  const members = persons.filter((p) => !isLeader(p)).sort(comparePerson);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">Team {id}</Typography>
        <Stack direction="row">
          {leaders.map(p => <PersonItem key={p.wcaUserId} p={p} />)}
        </Stack>
        <hr />
        <Grid container>
          {members.map(p => (
            <Grid xs={4} key={p.wcaUserId}>
              <PersonItem p={p} />
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default function Teams() {
  const competition = useContext(WCIFContext);
  const teams = useMemo(() => createTeamToPersonsMap(competition), [competition]);
  const teamKeys = [...teams.keys()].filter(teamId => teamId !== 'none').sort();
  const rows = [];
  // Construct rows manually because I want to manually insert a page break
  for (let i = 0; i < teamKeys.length; i += 2) {
    rows.push([teamKeys[i], (i+1) < teamKeys.length ? teamKeys[i+1] : '']);
  }
  return (
    <Box sx={{p: 1}}>
      {rows.map(([a, b]) => (
        <Grid container spacing={2} key={a} className="pagebreak-after">
          <Grid xs={6}>
            <Team key={a} id={a} persons={teams.get(a) || []} />
          </Grid>
          {b !== '' && (
            <Grid xs={6}>
              <Team key={b} id={b} persons={teams.get(b) || []} />
            </Grid>
          )}
        </Grid>
      ))}
    </Box>
  );
}
