import * as React from 'react';
import { useState, createContext, useContext } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import App_Bar from './app_bar';
import { grey } from '@mui/material/colors';

import PriceChart from './price_chart';
import Information_and_Basic_Fianacials from './stock_information';
import Header from './header';
import StockContext from '../context/stock_context';


const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 1
        }}
    />
);

export default function LandingPage() {
    const context = useContext(StockContext);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <App_Bar />
            <Grid container spacing={2}>
                <Header />

                <Grid xs={12}><ColoredLine color={grey} /></Grid>

                <Grid container spacing={1}>

                    <Grid container xs={12}>
                        <Grid xs={12}>
                            <PriceChart />
                        </Grid>
                    </Grid>

                    <Grid paddingX={2}>
                        <Information_and_Basic_Fianacials />
                    </Grid>
                </Grid>
            </Grid>
        </Box >
    );
}