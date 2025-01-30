'use client';

import { useEffect, useState } from "react";
import ActualQ1 from "./actualQ1";
import ActualQ2 from "./actualQ2";
import ActualQ3 from "./actualQ3";
import ActualQ4 from "./actualQ4";
import AppMatrics from "./annualBudget";

export default function Home() {
    const [financialYear, setFinancialYear] = useState<string | null>(null)
    useEffect(() => {
        const presentDate = new Date()
        const year = presentDate.getFullYear()
        const month = presentDate.getMonth()
        if (month >= 3) {
            setFinancialYear(`${year.toString()}-${(year + 1).toString().slice(2)}`)
        }
        else {
            setFinancialYear(`${(year - 1).toString()}-${year.toString().slice(2)}`)
        }
    }, [])
    return (
        <div className="mt-4 h-[100vh] gap-4 p-2">
            {
                financialYear && <AppMatrics financialYear={financialYear} />
            }
            {
                financialYear && <div className="mt-3 grid grid-cols-2 gap-4">
                    <ActualQ1 financialYear={financialYear}/>
                    <ActualQ2 financialYear={financialYear}/>
                    <ActualQ3 financialYear={financialYear}/>
                    <ActualQ4 financialYear={financialYear}/>
                </div>
            }
            
        </div>
    );
}
