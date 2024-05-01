// @ts-nocheck
import React, {useState,useEffect} from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJs.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export default function BarChart({ title, label, labels, data, beginDate, endDate }:
    {
        title: string,
        label: string,
        labels: string[],
        data: number[],
        beginDate: Date,
        endDate: Date
    }) {

    const [chartData, setChartData] = useState({
        datasets: [],
    } as any);

    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        setChartData({
            labels: labels,
            datasets: [
                {
                    label:label,
                    data: data,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235, 0.4',

                },
            ]
        })
        setChartOptions({
            plugins: {
                legend : {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: title
                }
            },
            maintainAspectRatio: false,
            responsive: true
        })

        console.log("Chart reloaded")

    }, [beginDate, endDate, data])

    return (
        <>
            <div className='w=full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg'>
                <Bar data={chartData} options={chartOptions}/>
            </div>
        </>
    );
}
