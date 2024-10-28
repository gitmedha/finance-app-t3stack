import React, { memo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const data = [
    { monthname: 'January', Utilization: 50 },
    { monthname: 'February', Utilization: 60 },
    { monthname: 'March', Utilization: 80 },
    { monthname: 'April', Utilization: 45 },
    { monthname: 'May', Utilization: 70 },
    { monthname: 'June', Utilization: 90 },
    { monthname: 'July', Utilization: 65 },
    { monthname: 'August', Utilization: 85 },
    { monthname: 'September', Utilization: 75 },
    { monthname: 'October', Utilization: 95 },
    { monthname: 'November', Utilization: 55 },
    { monthname: 'December', Utilization: 88 },
];

const LineChartDashboard = () => {
    return (
        <div className='sm:h-[36dvh] md:h-[36dvh]'>
            <ResponsiveContainer debounce={300} width='100%' height='100%'>
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='monthname' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        strokeWidth={2}
                        type='monotone'
                        dataKey='Utilization'
                        stroke='#8884d8'
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default memo(LineChartDashboard);
