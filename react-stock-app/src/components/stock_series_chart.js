import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';


const SeriesDataArray = (props) => {
    /*const [seriesData, setSeriesData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/series/information', {
                    params: {
                        query: { "symbol": props.symbol },
                        project: props.project,
                        type: props.type
                    },
                });
                setSeriesData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);*/

    const serieschartOptions = {
        series: [{
            name: props.name,
            data: props.seriesData.map((data) => { return data.v.toFixed(2) })
        }],
        options: {
            colors: ["#6ab04c"],
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
                text: props.name,
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
                categories: props.seriesData.map((data) => { return new Date(data.period).getTime() }),
                type: 'datetime'
            },
            tooltip: {
                x: {
                    formatter: function (val) {
                        return (new Date(val).toDateString());
                    }
                },
                y: {
                    formatter: function (val1) {
                        return parseFloat(val1).toFixed(5)
                    }
                }
            },
            legend: {
                position: "top"
            },
        }
    }

    return (
        <div id="chart" >
            <Chart options={serieschartOptions.options} series={serieschartOptions.series} type="line" height="300rem" />
        </div >
    );
}
export default SeriesDataArray
