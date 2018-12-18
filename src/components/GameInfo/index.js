import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { formatCurrency } from '@/util/Format';

const styles = theme => ({
    tabs: {
        padding: '0',
    },
    tab: {
        minWidth: 'inherit'
    },
    spacer:{
        margin: '20px 0'
    },
    container: {
        marginTop: 40
    }
});

class GameInfo extends Component {
    state = {
        tabValue: 2
    }

    handleTabChange = (event, value) => this.setState(() => ({ tabValue: value }));

    renderGameNotes = () => {
        return (
            <React.Fragment>
                <Typography>No Game Notes.</Typography>
            </React.Fragment>
        )
    }

    renderIncome = () => {
        const { classes } = this.props;
        const { sections, income, totals } = this.props.info.venueInfo;

        return (
            <React.Fragment>
                <Grid container direction='column'>
                    <Grid item>
                        <Grid container direction='column'>
                        <Typography gutterBottom variant='h6'>Section Breakdown</Typography>
                        {
                            sections.map(section => {
                                return (
                                    <Grid item>
                                        <Typography>{`${section.name} ticket income`}: {formatCurrency(section.income)}</Typography>
                                    </Grid>
                                )
                            })
                        }
                        </Grid>
                    </Grid>
                    <Grid item className={classes.spacer}>
                        <Grid container direction='column'>
                        <Typography gutterBottom variant='h6'>Income Breakdown</Typography>
                        {
                            income.map(source => {
                                return (
                                    <Grid item>
                                        <Typography>{`${source.name} income`}: {formatCurrency(source.amount)}</Typography>
                                    </Grid>
                                )
                            })
                        }
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom variant='h5'>Total Income: {formatCurrency(totals.income)}</Typography>
                    </Grid>
                </Grid>
            </React.Fragment>
        )

    }

    renderAttendance = () => {
        const { classes } = this.props;
        const { rink, sections, totals } = this.props.info.venueInfo;
        return (
            <React.Fragment>
                <Grid container direction='column'>
                    <Grid item>
                        <Typography gutterBottom >Game was played at the <span style={{ fontWeight: 'bold'}}>{rink}</span></Typography>
                    </Grid>
                    <Grid item className={classes.spacer}>
                        <Grid container direction='column'>
                        <Typography gutterBottom variant='h6'>Section Breakdown</Typography>
                        {
                            sections.map(section => {
                                return (
                                    <Grid item>
                                        <Typography>{`${section.name} attendance`}: {section.attendance.amount} ({section.attendance.pct}%)</Typography>
                                    </Grid>
                                )
                            })
                        }
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Typography gutterBottom variant='h5'>Total Attendance: {totals.attendance.amount} ({totals.attendance.pct}%)</Typography>
                    </Grid>
                </Grid>
            </React.Fragment>
        )
    }

    render() {
        const { classes, info } = this.props;
        return (
            <Paper className={classes.container}>
                <Tabs className={classes.tabs} value={this.state.tabValue} onChange={this.handleTabChange} centered>
                    <Tab className={classes.tab} label="NOTES" />
                    <Tab className={classes.tab} label={`ATTENDANCE`} />
                    <Tab className={classes.tab} label={`INCOME`} />
                </Tabs>

                <Grid container>
                    <Grid style={{ padding: 20 }} item xs>
                        {this.state.tabValue === 0 && this.renderGameNotes()}
                        {this.state.tabValue === 1 && this.renderAttendance()}
                        {this.state.tabValue === 2 && this.renderIncome()}
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}


export default withStyles(styles)(GameInfo);