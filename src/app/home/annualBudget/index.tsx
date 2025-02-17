import { useSession } from "next-auth/react";
import {  type FC } from "react";
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
    { count: 33, title: 'Budget Planned', name: 'totalnoofskills',addOn:"INR"},
    { count: 4, title: 'Budget Actual', name: 'totalprojectsworked',addOn:"INR"},
    { count: 40, title: 'Budget Balance', name: 'noofweektimesheetpendingsubmission',addOn:"INR"},
    { count: 1, title: 'Budget Utilized %', name: 'noofweektimesheetpendingapproval',addOn:"%"},
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
    const userData = useSession()
    // call to get total sum 
    const { data: totalBudgetSum } = api.get.getTotalBudgetSum.useQuery(
        { financialYear:financialYear,departmentId:userData.data?.user.departmentId}
    )
    return (
                 <div className="grid grid-cols-5 gap-4">
                    {maricsList.map((item) => (
                        <PendingCard
                            key={item.title}
                            count={item.title == "Budget Planned" ? totalBudgetSum ? Math.round(Number(totalBudgetSum)).toLocaleString('hi-IN') : 0 : item.title == "Financial Year" ? financialYear : item.count}
                            title={item.title}
                            addOn={item.addOn}
                        />
                    ))}
                </div>
        
    );
};

export default AnnualBudget;
