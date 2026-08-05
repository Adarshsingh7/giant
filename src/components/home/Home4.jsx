import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getSales } from "../../slices/salesSlice";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

const Home4 = () => {
  const dispatch = useDispatch();
  const { salesData } = useSelector((state) => state.sales);
   const {
        overviewFilters: { startDate, endDate }} = useSelector((state) => state.sales);


  useEffect(() => {
  if (startDate && endDate) {
    dispatch(getSales({ DtFrom: startDate, DtTo: endDate }));
  }
}, [dispatch, startDate, endDate]);


  // Step 1: Group sales by ISO week and calculate total sales (price × quantity)
  const weeklyMap = new Map();

  salesData.forEach((item) => {
    const weekStart = dayjs(item.date).startOf("isoWeek").format("DD MMM YYYY");
    const amount = (item.price || 0) * (item.quantity || 0);

    if (!weeklyMap.has(weekStart)) {
      weeklyMap.set(weekStart, { week: weekStart, current: 0 });
    }

    weeklyMap.get(weekStart).current += amount;
  });

  // Step 2: Sort by week and calculate cumulative sales
  let cumulative = 0;
  const chartData = Array.from(weeklyMap.values())
    .sort((a, b) => dayjs(a.week, "DD MMM YYYY").diff(dayjs(b.week, "DD MMM YYYY")))
    .map((weekData) => {
      cumulative += weekData.current;
      return {
        ...weekData,
        current: cumulative,
      };
    });

  return (
    <Box sx={{ width: "100%", px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, md: 4 } }}>
      <Card sx={{ boxShadow: 4, borderRadius: 3, backgroundColor: "#ffffff", p: { xs: 2, sm: 3 } }}>
        <CardContent>
          <Typography
            variant="h6"
            align="center"
            sx={{
              fontWeight: 600,
              color: "primary.main",
              mb: 0.5,
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            CUMULATIVE WEEKLY SALES
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Current Year (£ in Thousands)
          </Typography>

          <Box sx={{ width: "100%", height: { xs: 300, sm: 400 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />
                <XAxis
                  dataKey="week"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => `£ ${(value / 1000).toFixed(1)}k`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 8, fontSize: 14 }}
                  labelStyle={{ fontWeight: 600 }}
                  formatter={(value) => `£ ${value.toLocaleString()}`}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="current"
                  name="Current Sales"
                  stroke="#1976d2"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home4;
