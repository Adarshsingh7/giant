import React, { useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getSales } from "../../slices/salesSlice";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

const Home3 = () => {
   const dispatch = useDispatch();
  const { salesData } = useSelector((state) => state.sales);
  const { overviewFilters: { startDate, endDate } } = useSelector((state) => state.sales);
  const selectedLocation = useSelector((state) => state.location.selected.code);

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(getSales({ DtFrom: startDate, DtTo: endDate }));
    }
  }, [dispatch, startDate, endDate, selectedLocation]);

  // Step 1: Group data by ISO week and calculate total sales (price * quantity)
  const weeklyMap = new Map();

  salesData.forEach((item) => {
    const week = dayjs(item.date).startOf("isoWeek").format("DD MMM YYYY");
    const amount = (item.price || 0) * (item.quantity || 0);

    if (!weeklyMap.has(week)) {
      weeklyMap.set(week, { week, current: 0 });
    }

    weeklyMap.get(week).current += amount;
  });

  // Step 2: Convert to array and sort by week
  const weeklyData = Array.from(weeklyMap.values()).sort(
    (a, b) => dayjs(a.week, "DD MMM YYYY").diff(dayjs(b.week, "DD MMM YYYY"))
  );

  return (
    <Box sx={{ width: "100%", px: { xs: 2, sm: 3, md: 4 }, py: { xs: 2, md: 4 } }}>
      <Card sx={{ boxShadow: 4, borderRadius: 3, p: { xs: 2, sm: 3 } }}>
        <CardContent>
          <Typography
            variant="h6"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "primary.main",
              fontSize: { xs: "1rem", sm: "1.25rem" },
              mb: 3,
            }}
          >
            WEEKLY SALES PERFORMANCE
          </Typography>

          <Box sx={{ width: "100%", height: { xs: 300, sm: 400 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
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
                  formatter={(value) => `£ ${value.toLocaleString()}`}
                  labelStyle={{ fontWeight: 600 }}
                  contentStyle={{ borderRadius: 8 }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="current"
                  name="Sales"
                  stroke="#1976d2"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Home3;
