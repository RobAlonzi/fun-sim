import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { formatTime } from '@/util/Format';


const styles = theme => ({
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});


const StatsTable = ({ classes, team, players, isFinal }) => {
    return (
      <React.Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="none">Skaters</TableCell>
              { isFinal && (
                <TableCell padding="none" numeric>TOI</TableCell>
              )}
              <TableCell padding="none" numeric>G</TableCell>
              <TableCell padding="none" numeric>A</TableCell>
              { isFinal && (
                <TableCell padding="none" numeric>+/-</TableCell>
              )}
              <TableCell padding="none" numeric>PIM</TableCell>
              <TableCell padding="none" numeric>Shots</TableCell>
              <TableCell padding="none" numeric>Hits</TableCell>
              <TableCell padding="none" numeric>SB</TableCell>
              <TableCell padding="none" numeric>FO</TableCell>
              { isFinal && (
                <React.Fragment>
                  <TableCell padding="none" numeric>PP TOI</TableCell>
                  <TableCell padding="none" numeric>PK TOI</TableCell>
                </React.Fragment>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {team.skaters.players.map(item => {
              const player = players[item];
              const { stats } = player;
              return (
                <TableRow className={classes.row} key={player.id}>
                  <TableCell padding="none" component="th" scope="row">
                    {player.name} ({player.position})
                  </TableCell>
                  { isFinal && (
                    <TableCell padding="none" numeric>{formatTime(stats.minutesPlayed)}</TableCell>
                  )}
                  <TableCell padding="none" numeric>{stats.goals}</TableCell>
                  <TableCell padding="none" numeric>{stats.assists}</TableCell>
                  { isFinal && (
                    <TableCell padding="none" numeric>{stats.plusMinus}</TableCell>
                  )}
                  <TableCell padding="none" numeric>{stats.pims}</TableCell>
                  <TableCell padding="none" numeric>{stats.shots}</TableCell>
                  <TableCell padding="none" numeric>{stats.hits}</TableCell>
                  <TableCell padding="none" numeric>{stats.shotsBlocked}</TableCell>
                  <TableCell padding="none" numeric>{`${stats.faceoffsWon}/${stats.faceoffsTaken}`}</TableCell>
                  { isFinal && (
                    <React.Fragment>
                      <TableCell padding="none" numeric>{formatTime(stats.ppMinutesPlayed)}</TableCell>
                      <TableCell padding="none" numeric>{formatTime(stats.pkMinutesPlayed)}</TableCell>
                    </React.Fragment>  
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="none">Goalies</TableCell>
              { isFinal && (
                <TableCell padding="none" numeric>Record</TableCell>
              )}
              <TableCell padding="none" numeric>Saves</TableCell>
              <TableCell padding="none" numeric>Shots</TableCell>
              <TableCell padding="none" numeric>SV%</TableCell>
              { isFinal && (
                <TableCell padding="none" numeric>TOI</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {team.skaters.goalies.map(item => {
              const player = players[item];
              const { stats } = player;
              
              if(!Object.keys(stats).length){
                return null;
              }

              const svPct = stats.shots === 0 ? 0 : (stats.saves / stats.shots);
              const record = isFinal && stats.decision && `${stats.decision}, ${stats.wins}-${stats.loss}-${stats.otl}`;

              return (
                <TableRow className={classes.row} key={player.id}>
                  <TableCell padding="none" component="th" scope="row">
                    {player.name} ({player.position})
                  </TableCell>
                  { isFinal && (
                    <TableCell padding="none" numeric>{record}</TableCell>
                  )}
                  <TableCell padding="none" numeric>{stats.saves}</TableCell>
                  <TableCell padding="none" numeric>{stats.shots}</TableCell>
                  <TableCell padding="none" numeric>{(svPct).toFixed(3)}%</TableCell>
                  { isFinal && (
                    <TableCell padding="none" numeric>{formatTime(stats.toi)}</TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </React.Fragment>
    );
}


export default withStyles(styles)(StatsTable);