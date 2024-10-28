'use client';

import AppMatrics from "./martics";
import LineChartDashboard from './lineChart'
import BarchartDashboard from './barChart'

export default function Home() {

    return (
        <div className="flex-grow m-2 mt-4">
            <div className="flex flex-col h-full">
                <div className="flex h-full gap-4 px-2 pb-2">
                    <div className="flex-grow flex flex-col gap-4 max-w-[45%]">
                        <AppMatrics />
                        <div className="bg-white shadow-lg rounded-lg  w-full pb-5 overflow-hidden flex flex-col gap-4 h-[calc(100%/1)]">
                        <div className='flex justify-center mt-5 text-gray-600 font-[500]'>
                                    <h1>Dashboard 1</h1>
                                </div>
                        <BarchartDashboard />
                        </div>
                    </div>
                    <div className="flex-grow max-w-[55%]">
                        <div className="flex flex-col w-full h-full gap-5 p-5 bg-white rounded-lg shadow-lg">
                            <div className='w-full'>
                                <div className='flex justify-center text-gray-600 font-[500]'>
                                    <h1>
                                        Expenses By Month
                                    </h1>
                                </div>
                                <LineChartDashboard />
                                <div className='flex justify-center mt-5 text-gray-600 font-[500]'>
                                    <h1>Dashboard 2</h1>
                                </div>
                                <BarchartDashboard />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
