import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Unstable_Grid2';
import { Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Chart from 'react-apexcharts';
import SeriesDataArray from './stock_series_chart';
import StockContext from '../context/stock_context';

const Information_and_Basic_Fianacials = () => {
    const [informationData, setInformationData] = useState([]);
    const context = useContext(StockContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api', {
                    params: {
                        query: { "symbol": context.stockSymbol },
                        collection: "Stocks_Information",
                        limit: 7 // Default Duration is last 7 Days i.e., 1 Week
                    },
                });
                setInformationData(response.data);


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [context]);


    const data = informationData.map((data) => [parseInt(data.recommendations.buy), parseInt(data.recommendations.hold), parseInt(data.recommendations.sell), parseInt(data.recommendations.strongBuy), parseInt(data.recommendations.strongSell)]);
    const recommedations = {
        series: data.length > 0 ? data[0] : [],
        options: {
            labels: ["Buy", "Hold", "Sell", "Strong Buy", "Strong Sell"],
        },
    };

    return (
        <div>
            <Grid>
                <Typography textAlign={"left"} fontSize={40} fontWeight={600}>About</Typography>
                <Typography textAlign={"justify"}>{informationData.map((data) => data.basics.description)}</Typography>
            </Grid>
            <Grid>
                <Typography textAlign={"left"} fontSize={40} fontWeight={600}>Basic Information</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow><TableCell><Typography fontWeight={600}>Country</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.basics.country)}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>Industry</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.basics.finnhubIndustry)}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>Currency</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.basics.currency)}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>Exchange</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.basics.exchange)}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>IPO</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.basics.ipo)}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid>
                <Typography textAlign={"left"} fontSize={40} fontWeight={600}>Key Facts</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow><TableCell><Typography fontWeight={600}>13 Week Price Return Daily (%)</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.metric["13WeekPriceReturnDaily"])}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>26 week price return daily (%)</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.metric["26WeekPriceReturnDaily"])}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>52 Week High</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.metric["52WeekHigh"])}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>52 Week Low</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.metric["52WeekLow"])}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>Current Ratio Annual</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.metric["currentRatioAnnual"])}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>Quick Ratio Annual</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.metric["quickRatioAnnual"])}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>EPS Annual</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.metric["epsAnnual"])}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>ROI Annual</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.metric["roiAnnual"])}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>Book Value Per Share Annual</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.metric["bookValuePerShareAnnual"])}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>Cash Flow Per Share Annual</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.metric["cashFlowPerShareAnnual"])}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>Market Capitalization</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.metric["marketCapitalization"])}</TableCell></TableRow>
                            <TableRow><TableCell><Typography fontWeight={600}>Net Profit Margin Annual (%)</Typography></TableCell><TableCell align='right'>{informationData.map((data) => data.metric["netProfitMarginAnnual"])}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <Grid>
                <Grid><Typography textAlign={"left"} fontSize={40} fontWeight={600}>Buy/Sell Recommendation</Typography></Grid>
                <Grid container justifyContent={'center'}>
                    <Chart
                        options={recommedations.options}
                        series={recommedations.series}
                        type="pie"
                        width={500}
                    />
                </Grid>
                <Grid xs={12}><SeriesDataArray seriesData={informationData.length > 0 ? informationData.map((e) => e.series.eps)[0] : []} name="Earning Per Share" type="eps" /></Grid>
                <Grid xs={12}><SeriesDataArray seriesData={informationData.length > 0 ? informationData.map((e) => e.series.cashRatio)[0] : []} name="Cash Ratio" type="cashRatio" /></Grid>
                <Grid xs={12}><SeriesDataArray seriesData={informationData.length > 0 ? informationData.map((e) => e.series.longtermDebtTotalEquity)[0] : []} name="Long Term Debt To Total Equity" type="longtermDebtTotalEquity" /></Grid>
                <Grid xs={12}><SeriesDataArray seriesData={informationData.length > 0 ? informationData.map((e) => e.series.totalDebtToEquity)[0] : []} name="Total Debt To Equity" type="totalDebtToEquity" /></Grid>

            </Grid>
        </div>
    );
}

export default Information_and_Basic_Fianacials;
