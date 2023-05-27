import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Stack, Typography, colors } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import StockContext from '../context/stock_context';

export const Headings = styled(Typography)(({ theme }) => ({
    padding: "0px 10px 0px 10px",
    textAlign: 'left',
    margin: "0px 0px 0px 0px"
}));

export const Price = () => {
    const [price, setcurrentPrice] = useState([]);
    const context = useContext(StockContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/price', {
                    params: {
                        query: { "symbol": context.stockSymbol },
                    },
                });
                setcurrentPrice(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [context]);

    const price_change = (price.close - price.open).toFixed(2);
    const percentage_change = ((price_change / price.open) * 100).toFixed(2);
    const symbol = price_change > 0 ? "+" : "";

    return (<div>
        <Stack direction={"row"}>
            <Headings lineHeight={1} fontSize={25} color={"#000"} fontWeight={600}>{price.close} USD</Headings>
            <Headings lineHeight={1} fontSize={25} color={symbol == "+" ? "#32a852" : "#ff4d4d"} fontWeight={600}> {symbol}{price_change} {symbol}{percentage_change}%</Headings>
        </Stack>
    </div>);
}

export default Price;