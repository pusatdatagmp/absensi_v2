"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

const data = [
    { month: "Jan", hadir: 20 },
    { month: "Feb", hadir: 24 },
    { month: "Mar", hadir: 18 },
    { month: "Apr", hadir: 22 },
    { month: "Mei", hadir: 25 },
];

export default function AttendanceChart() {
    return (
        <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold">
                Grafik Kehadiran
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hadir" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}