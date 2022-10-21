import React from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

function DashboardPieChart({data}) {
  return (
    <ResponsiveContainer width="100%" height="100%" style={{border: '2px solid #fa5252'}}>
        <PieChart
            width={300} height={300}
        >
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={86}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={data[index].color} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    </ResponsiveContainer>
  )
}

export default DashboardPieChart