'use client';

import ActualQ1 from "./actualQ1";
import ActualQ2 from "./actualQ2";
import ActualQ3 from "./actualQ3";
import ActualQ4 from "./actualQ4";
import AppMatrics from "./annualBudget";

export default function Home() {

    return (
        <div className="mt-4 h-[100vh] gap-4 p-2">
            <AppMatrics />
            <div className="mt-3 grid grid-cols-2 gap-4">
                <ActualQ1 />
                <ActualQ2 />
                <ActualQ3 />
                <ActualQ4 />
            </div>
        </div>
    );
}
