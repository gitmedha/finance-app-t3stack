import { useSession } from "next-auth/react";
import { FC } from "react";
import { api } from "~/trpc/react";

interface MetricItem {
  count: number | string;
  title: string;
  addOn?: string;
}

const PendingCard: FC<{
  count: number | string;
  title: string;
  addOn?: string;
}> = ({ count, title, addOn }) => (
  <div className="min-h-[70px] rounded-lg bg-white p-3 shadow-lg">
    <p className="text-3xl font-bold text-[#fe9701]">
      {count || 0} {addOn}
    </p>
    <p className="text-sm font-semibold text-primary">{title}</p>
  </div>
);

const AnnualBudget: FC<{ financialYear: string }> = ({ financialYear }) => {
  const userData = useSession();
  const { data } = api.get.getTotalBudgetSum.useQuery({
    financialYear,
    departmentId: userData.data?.user.departmentId,
  });
 
  // default to zero if data is still loading or absent
  const planned = data ?? 0;
  const actual = data ?? 0;
  const balance = Number(planned) - Number(actual);
  const utilizedPct =
    Number(planned) > 0
      ? ((Number(actual) / Number(planned)) * 100).toFixed(1) + "%"
      : "0%";

  const metricsList: MetricItem[] = [
    { title: "Financial Year", count: financialYear },
    {
      title: "Budget Planned",
      count: Number(planned).toLocaleString("hi-IN"),
      addOn: "INR",
    },
    {
      title: "Budget Actual",
      count: Number(actual).toLocaleString("hi-IN"),
      addOn: "INR",
    },
    {
      title: "Budget Balance",
      count: Number(balance).toLocaleString("hi-IN"),
      addOn: "INR",
    },
    { title: "Budget Utilized %", count: utilizedPct },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {metricsList.map((m) => (
        <PendingCard
          key={m.title}
          count={m.count}
          title={m.title}
          addOn={m.addOn}
        />
      ))}
    </div>
  );
};

export default AnnualBudget;
