/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function DashboardAreaChart({data}) {
  const [chartData, setchartData] = useState([])

  useEffect(() => {
      const arr = data?.map(activities => {
        return {
          name: activities.name,
          credit: activities.credit?.toFixed(2),
          cash: activities.cash?.toFixed(2)
        }
      })
      
      setchartData(arr)
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
            width={500}
            height={300}
            data={chartData}
            margin={{
                top: 10,
                right: 30,
                left: -10,
                bottom: 0,
            }}

        >
            <defs>
                <linearGradient id='colorLast' x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cacaca" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#cacaca" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fa5252" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#fa5252" stopOpacity={0} />
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="1 3" />
            <XAxis dataKey="name" axisLine={false} tick={{fontSize: 14}} />
            <YAxis tick={{fontSize: 14}} />
            <Tooltip />
            <Legend verticalAlign="top" align='left' iconType="square" iconSize={16} height={40} />
            <Area name='Credit' type="monotone" id='credit' dataKey="credit" stroke="#a2a2a2" fill="url(#colorLast)"  />
            <Area name='Cash' type="monotone" id='cash' dataKey="cash" stroke="#fa5252" fill="url(#colorCurrent)" activeDot={{ r: 8 }} />
        </AreaChart>
    </ResponsiveContainer>
  )
}

export default DashboardAreaChart