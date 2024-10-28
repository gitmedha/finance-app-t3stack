import { FC } from "react";
import Link from "next/link";

// Define types for maricsList items
interface MetricItem {
    count: number;
    title: string;
    name: string;
    viewLink?: string;
}

const maricsList: MetricItem[] = [
    { count: 1, title: 'Label 1', name: 'totalnoofskills', viewLink: '/app/workforce/eprofile' },
    { count: 4, title: 'Label 2', name: 'totalprojectsworked', viewLink: '/app/workforce/eprofile' },
    { count: 1, title: 'Label 3', name: 'noofweektimesheetpendingsubmission', viewLink: '/app/projects/timesheet' },
    { count: 1, title: 'Label 4', name: 'noofweektimesheetpendingapproval', viewLink: '/app/projects/timesheet' },
    { count: 4, title: 'Label 5', name: 'profilecompleteness' },
    { count: 7, title: 'Label 6', name: 'currentallocation' }
];

// Define types for PendingCard props
interface PendingCardProps {
    count: number;
    title: string;
    link?: string;
}

const PendingCard: FC<PendingCardProps> = ({ count, title, link }) => {
    const isProgressBarShown = !['Label 1', 'Label 2', 'Label 3', 'Label 4'].includes(title);
    const showTitleBelow = ['Total Allocation', 'Timesheet Compliance', 'Profile Completeness',].includes(title);
    const widthStyle = { width: `${count || 0}%` };

    return (
        <div className="p-3 bg-white rounded-lg shadow-lg min-h-[70px]">
            {isProgressBarShown && (
                <div className="flex items-center justify-start w-full space-x-1">
                    <div className="w-full h-3 overflow-hidden bg-gray-200 rounded-full">
                        <div
                            className="flex items-center justify-center h-3 text-xs font-semibold text-white rounded-lg bg-[#fe9701]"
                            style={widthStyle}
                        >
                            {!showTitleBelow && `${count || 0}%`}
                        </div>
                    </div>
                    <span className="text-sm font-semibold text-primary">{count || 0}%</span>
                </div>
            )}
            <div className="flex items-center w-full text-left">
                {!showTitleBelow && (
                    <span className="mr-2 text-3xl font-bold text-primary">{count || 0}</span>
                )}
                <div className="w-full flex justify-between items-center">
                    <span className="text-sm font-semibold inline-flex justify-start text-gray-600">{title}</span>
                    {!isProgressBarShown && link && (
                        <Link href={link} className="text-[#fe9701]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 4.5l7.5 7.5-7.5 7.5m6-15l7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};


const AppMatrics = () => {
    return (
        <div className="w-full gap-4 flex flex-col">
            <div className="grid grid-cols-2 gap-4">
                {maricsList.map((item) => (
                    <PendingCard
                        link={item.viewLink}
                        key={item.title}
                        count={item?.count}
                        title={item.title}
                    />
                ))}
            </div>
        </div>
    );
};

export default AppMatrics;
