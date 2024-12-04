

const data = [
    {
        bHead: 'PERSONNEL',
        actQ1: "",
        q1bal: "",
        util: "",
        budget: ""
    },
    {
        bHead: 'PROGRAM ACTIVITIES',
        actQ1: "",
        q1bal: "",
        util: "",
        budget: ""
    },
    {
        bHead: 'TRAVEL ',
        actQ1: "",
        q1bal: "",
        util: "",
        budget: ""
    },
    {
        bHead: 'PROGRAM OFFICE',
        actQ1: "",
        q1bal: "",
        util: "",
        budget: ""
    },
    {
        bHead: 'CAPITAL COST',
        actQ1: "",
        q1bal: "",
        util: "",
        budget: ""
    },
    {
        bHead: 'OVERHEADS',
        actQ1: "",
        q1bal: "",
        util: "",
        budget: ""
    }
]
const ActualQ4 = () => {
    return (
        <div className='bg-white shadow-lg  w-full p-2 rounded-md'>
            <table className="  min-w-full table-auto border-collapse p-2">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 text-left text-sm uppercase">
                        <th className="p-2">Budget Head</th>
                        <th className="p-2">Actual 4</th>
                        <th className="p-2">Q1 Balance</th>
                        <th className="p-2">Utilized %</th>
                        <th className="p-2">Budget Q2</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data?.map((item,i) => {
                            return (
                                <tr
                                    key={i}
                                    className=" hover:bg-gray-100 text-sm transition-colors"
                                >
                                    <td className="p-1 border">{item?.bHead}</td>
                                    <td className="p-1 border">{item?.actQ1}</td>
                                    <td className="p-1 border">{item?.q1bal}</td>
                                    <td className="p-1 border">{item?.util}</td>
                                    <td className="p-1 border">{item?.budget}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default ActualQ4