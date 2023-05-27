import * as React from 'react';
import { Stack } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

import { Price, Headings } from './current_price';
import { useContext } from 'react';
import StockContext from '../context/stock_context';

const Header = () => {
    const [info, setInfo] = useState([]);
    const context = useContext(StockContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/basics', {
                    params: {
                        query: { "symbol": context.stockSymbol },
                    },
                });
                setInfo(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [context]);

    return (
        <div className='header'>
            <Grid container xs={12} paddingX={3} marginTop={"20px"}>
                <Grid>
                    <Avatar alt="LOGO" src={info.logo} sx={{ width: 100, height: 100 }} />
                </Grid>
                <Stack marginLeft={3} direction={"column"}>
                    <Stack direction={"row"}>
                        <Headings fontSize={40} fontWeight={600}>{context.stockSymbol}</Headings>
                        <Headings fontSize={40}>{info.name}</Headings>
                    </Stack>
                    <Grid>
                        <Price name={context.stockSymbol} />
                    </Grid>
                </Stack>

            </Grid>
        </div>
    );
}

export default Header;