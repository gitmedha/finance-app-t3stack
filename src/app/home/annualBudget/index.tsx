import { useEffect, useState, type FC } from "react";
import { api } from "~/trpc/react";

// Define types for maricsList items
interface MetricItem {
    count: number|string;
    title: string;
    name: string;
    viewLink?: string;
    addOn?:string
}

const maricsList: MetricItem[] = [
    { count: "", title: 'Financial Year', name: 'noofweektimesheetpendingapproval' },
    { count: 33, title: 'Annual Budget', name: 'totalnoofskills',addOn:"INR"},
    { count: 4, title: 'Annual Actual', name: 'totalprojectsworked',addOn:"INR"},
    { count: 40, title: 'Annual Balance', name: 'noofweektimesheetpendingsubmission',addOn:"INR"},
    { count: 1, title: 'Annual Utilized %', name: 'noofweektimesheetpendingapproval',addOn:"%"},
];

// Define types for PendingCard props
interface PendingCardProps {
    count: number|string;
    title: string;
    addOn?:string
}

const PendingCard: FC<PendingCardProps> = ({ count, title,addOn }) => {

    return (
        <div className="p-3 bg-white rounded-lg shadow-lg min-h-[70px]">
            <div className="w-full text-left">
                <p className="mr-2 text-3xl font-bold text-[#fe9701]">{count || 0}&nbsp;{addOn}</p>
                <p className="text-sm font-semibold inline-flex justify-start text-primary">{title}</p>
            </div>
        </div>
    );
};


const AnnualBudget = ({ financialYear }: { financialYear :string}) => {
    // call to get total sum 
    const { data: totalBudgetSum, isLoading: totalBudgetSumLoading } = api.get.getTotalBudgetSum.useQuery(
        { financialYear:financialYear}
    )
    return (
                 <div className="grid grid-cols-5 gap-4">
                    {maricsList.map((item) => (
                        <PendingCard
                            key={item.title}
                            count={item.title == "Annual Budget" ? totalBudgetSum ? Math.round(Number(totalBudgetSum)) : 0 : item.title == "Financial Year" ? financialYear : item.count}
                            title={item.title}
                            addOn={item.addOn}
                        />
                    ))}
                </div>
        
    );
};

export default AnnualBudget;
