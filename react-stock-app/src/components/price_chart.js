import Chart from 'react-apexcharts';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import StockContext from '../context/stock_context';

const PriceChart = () => {
    const [chartData, setChartData] = useState([]);
    const context = useContext(StockContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api', {
                    params: {
                        query: {},
                        collection: context.stockSymbol,
                        limit: 1500 // Default Duration is last 7 Days i.e., 1 Week
                    },
                });
                setChartData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [context]);

    const chartOptions = {
        series: [{
            name: "Close Price",
            data: chartData.map((data) => data.close.toFixed(2))
        }
            , {
            name: "Open Price",
            data: chartData.map((data) => data.open.toFixed(2))
        },
        {
            name: "Low",
            data: chartData.map((data) => data.low.toFixed(2))
        },
        {
            name: "High",
            data: chartData.map((data) => data.high.toFixed(2))
        }],
        options: {
            colors: ["#6ab04c", "#2980b9", "#ff4d4d", "#003300"],
            chart: {
                background: "transparant",
                type: "area",
                stacked: false,
                zoom: {
                    type: 'x',
                    enabled: true,
                    autoScaleYaxis: true
                },
                toolbar: {
                    autoSelected: 'zoom'
                }
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                size: 0,
            },
            title: {
                text: 'Stock Price Movement',
                align: 'left'
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.9,
                    opacityTo: 0.25,
                    stops: [100, 100, 100]
                },
            },
            xaxis: {
                categories: chartData.map((data) => data.date),
                type: 'datetime'
            },
            tooltip: {
                x: {
                    formatter: function (val) {
                        return (new Date(val).toDateString());
                    }
                },
            },
            legend: {
                position: "top"
            },
        }
    }

    function update_chart(type) {

        chartOptions.series = [{
            name: "Close Price",
            //arr.filter((_, i) => i % 3 === 2).map((e) => <li>{e}</li>);
            data: chartData.map((data) => data.close)
        }, {
            name: "Open Price",
            data: chartData.map((data) => data.open)
        }]

        chartOptions.options = {
            xaxis: {
                //categories: ["Jan", "Feb"]//, "March", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
                categories: chartData.map((data) => data.symbol)
            },
        }
    }

    /*console.log("close : " + chartData.map((data) => data.close));
    console.log("chartoptions : " + chartOptions.series[0].data);
    <Stack direction={"row"} paddingX={2} justifyContent="space-between">
                <Button variant="contained" onClick={() => update_chart(1)}>1 DAY</Button>
                <Button variant="contained" onClick={() => update_chart(7)}>1 WEEK</Button>
                <Button variant="contained" onClick={() => update_chart(30)}>1 MONTH</Button>
                <Button variant="contained" onClick={() => update_chart(365)}>1 YEAR</Button>
                <Button variant="contained" onClick={() => update_chart(1095)}>3 YEAR</Button>
            </Stack>*/
    return (
        <div id="chart">
            <Chart options={chartOptions.options} series={chartOptions.series} type="line" height="300rem" />

        </div>
    );
}

export default PriceChart;