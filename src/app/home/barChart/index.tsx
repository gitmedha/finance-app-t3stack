import React, { type FC } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define types for props
interface BarchartDashboardProps {
  fontSize?: number;
}

// Define types for mock data items
// interface ChartDataItem {
//   MonthName: string;
//   Project: number;
//   Organization: number;
//   Miscellaneous: number;
// }

// Mock data
const mockData = [
  { MonthName: "January", "Department 1": 40, 'Department 2': 35, 'Department 3': 20 },
  { MonthName: "February", "Department 1": 50, 'Department 2': 30, 'Department 3': 25 },
  { MonthName: "March", "Department 1": 45, 'Department 2': 40, 'Department 3': 30 },
  { MonthName: "April", "Department 1": 60, 'Department 2': 20, 'Department 3': 35 },
  { MonthName: "May", "Department 1": 50, 'Department 2': 45, 'Department 3': 30 },
  { MonthName: "June", "Department 1": 55, 'Department 2': 30, 'Department 3': 25 },
];

const BarchartDashboard: FC<BarchartDashboardProps> = ({ fontSize = 14 }) => {
  return (
    <div className='sm:h-[36dvh] md:h-[36dvh]'>
      <ResponsiveContainer debounce={300} width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={mockData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis fontSize={fontSize} dataKey="MonthName" />
          <YAxis fontSize={fontSize} />
          <Tooltip />
          <Legend fontSize={fontSize} />
          <Bar dataKey="Department 1" stackId="a" fill="#8884d8" />
          <Bar dataKey="Department 2" stackId="a" fill="#82ca9d" />
          <Bar dataKey="Department 3" stackId="a" fill="#57779b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarchartDashboard;
