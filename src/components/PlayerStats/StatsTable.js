import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const styles = theme => ({
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});


const StatsTable = ({ classes, team, players }) => {
    return (
      <React.Fragment>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="none">Skaters</TableCell>
              <TableCell padding="none" numeric>G</TableCell>
              <TableCell padding="none" numeric>A</TableCell>
              <TableCell padding="none" numeric>PIM</TableCell>
              <TableCell padding="none" numeric>Shots</TableCell>
              <TableCell padding="none" numeric>Hits</TableCell>
              <TableCell padding="none" numeric>SB</TableCell>
              <TableCell padding="none" numeric>FO</TableCell>
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
                  <TableCell padding="none" numeric>{stats.goals}</TableCell>
                  <TableCell padding="none" numeric>{stats.assists}</TableCell>
                  <TableCell padding="none" numeric>{stats.pims}</TableCell>
                  <TableCell padding="none" numeric>{stats.shots}</TableCell>
                  <TableCell padding="none" numeric>{stats.hits}</TableCell>
                  <TableCell padding="none" numeric>{stats.shotsBlocked}</TableCell>
                  <TableCell padding="none" numeric>{`${stats.faceoffsWon}/${stats.faceoffsTaken}`}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="none">Goalies</TableCell>
              <TableCell padding="none" numeric>Saves</TableCell>
              <TableCell padding="none" numeric>Shots</TableCell>
              <TableCell padding="none" numeric>SV%</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {team.skaters.goalies.map(item => {
              const player = players[item];
              const { stats } = player;

              if(!stats){
                return null;
              }

              return (
                <TableRow className={classes.row} key={player.id}>
                  <TableCell padding="none" component="th" scope="row">
                    {player.name} ({player.position})
                  </TableCell>
                  <TableCell padding="none" numeric>{stats.saves}</TableCell>
                  <TableCell padding="none" numeric>{stats.shots}</TableCell>
                  <TableCell padding="none" numeric>{((stats.saves / stats.shots)).toFixed(3)}%</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </React.Fragment>
    );
}


export default withStyles(styles)(StatsTable);