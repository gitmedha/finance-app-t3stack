import { type FC } from "react";
import { api } from "~/trpc/react";

// Define types for maricsList items
interface MetricItem {
    count: number|string;
    title: string;
    name: string;
    viewLink?: string;
}

const maricsList: MetricItem[] = [
    { count: "2023-24", title: 'Financial Year', name: 'noofweektimesheetpendingapproval' },
    { count: 33, title: 'Annual Budget', name: 'totalnoofskills'},
    { count: 4, title: 'Annual Actual', name: 'totalprojectsworked'},
    { count: 40, title: 'Annual Balance', name: 'noofweektimesheetpendingsubmission'},
    { count: 1, title: 'Annual Utilized %', name: 'noofweektimesheetpendingapproval'},
];

// Define types for PendingCard props
interface PendingCardProps {
    count: number|string;
    title: string;
}

const PendingCard: FC<PendingCardProps> = ({ count, title }) => {

    return (
        <div className="p-3 bg-white rounded-lg shadow-lg min-h-[70px]">
            <div className="w-full text-left">
                <p className="mr-2 text-3xl font-bold text-[#fe9701]">{count || 0}</p>
                <p className="text-sm font-semibold inline-flex justify-start text-primary">{title}</p>
            </div>
        </div>
    );
};


const AnnualBudget = () => {
    // call to get total sum 
    const { data: totalBudgetSum, isLoading: totalBudgetSumLoading } = api.get.getTotalBudgetSum.useQuery({ financialYear:"2023-24"})
    return (
        <div className="grid grid-cols-5 gap-4">
            {maricsList.map((item) => (
                <PendingCard
                    key={item.title}
                    // we should not make the totalBudgetSum as number
                    count={item.title == "Annual Budget" ? totalBudgetSum ? Number(totalBudgetSum) : 0: item.count}
                    title={item.title}
                />
            ))}
        </div>
    );
};

export default AnnualBudget;
