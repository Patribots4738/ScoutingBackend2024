import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

function MyBarChart({ width, height, data, margin, barConfigs, teamList }) {
    let max;
    
    const CustomizedAxisTick = (props) => {
        const { x, y, payload } = props;
        let label = payload.value;
        console.log(label);
        if (label.length > 7) {
            // Change this value to adjust the maximum length
            label = label.slice(0, 10) + '...'; // Truncate and add ellipsis
        }

        console.log(data);

        max = JSON.parse(JSON.stringify(data.map((d) => Object.values(d)[0])))
        max = Math.max(...max)
        console.log(max);

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="end"
                    fill="#666"
                    transform="rotate(-35)"
                >
                    {label}
                </text>
            </g>
        );
    };

    return (
        <BarChart width={width} height={height} data={data} margin={margin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="key" tick={<CustomizedAxisTick />} />
            <YAxis domain={[0, 'dataMax+2']} tickFormatter={(value) => `${Math.min(100, ((value/max)*100)).toFixed(0)}%`}/>
            <Tooltip cursor={false} />
            <Legend verticalAlign='top' height={36} />
            {teamList.map((team, index) => {
                return (
                    <Bar
                        key={index}
                        dataKey={team}
                        fill={barConfigs[index].fill}
                        // activeBar={barConfigs[index].activeBar}
                    />
                );
            })}
        </BarChart>
    );
}

export default MyBarChart;
