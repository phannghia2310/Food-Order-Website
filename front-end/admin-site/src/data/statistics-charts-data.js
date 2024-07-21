import { chartsConfig } from "@/configs";
import { getWeeklyOrders, getTopSellingItems, getMonthlyRevenue } from "@/api/homeApi";

const fetchWeeklyOrders = async () => {
  const response = await getWeeklyOrders();
  const data = response.data;
  const seriesData = data.map(item => item.orders);
  const categories = data.map(item => item.day);
  return { seriesData, categories };
};

const fetchTopSellingItems = async () => {
  const response = await getTopSellingItems();
  const data = response.data;
  const seriesData = data.map(item => item.sales);
  const categories = data.map(item => item.itemName);
  return { seriesData, categories };
};

const fetchMonthlyRevenue = async () => {
  const response = await getMonthlyRevenue();
  const data = response.data;
  const seriesData = data.map(item => item.revenue);
  const categories = data.map(item => item.month);
  return { seriesData, categories };
};

const weeklyOrders = async () => {
  const { seriesData, categories } = await fetchWeeklyOrders();
  return {
    type: "bar",
    height: 220,
    series: [
      {
        name: "Orders",
        data: seriesData,
      },
    ],
    options: {
      ...chartsConfig,
      colors: "#388e3c",
      plotOptions: {
        bar: {
          columnWidth: "16%",
          borderRadius: 5,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: categories,
      },
    },
  };
};

const topSellingItems = async () => {
  const { seriesData, categories } = await fetchTopSellingItems();
  return {
    type: "bar",
    height: 220,
    series: [
      {
        name: "Sales",
        data: seriesData,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#388e3c"],
      plotOptions: {
        bar: {
          columnWidth: "16%",
          borderRadius: 5,
        },
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: categories,
      },
    },
  };
};

const monthlyRevenue = async () => {
  const { seriesData, categories } = await fetchMonthlyRevenue();
  return {
    type: "line",
    height: 220,
    series: [
      {
        name: "Revenue",
        data: seriesData,
      },
    ],
    options: {
      ...chartsConfig,
      colors: ["#0288d1"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: categories,
      },
    },
  };
};

export const statisticsChartsData = async () => [
  {
    color: "white",
    title: "Weekly Orders",
    description: "Orders delivered in the last week",
    footer: "",
    chart: await weeklyOrders(),
  },
  {
    color: "white",
    title: "Monthly Revenue",
    description: "Revenue for the year",
    footer: "",
    chart: await monthlyRevenue(),
  },
  {
    color: "white",
    title: "Top Selling Items",
    description: "Top 5 items sold this month",
    footer: "",
    chart: await topSellingItems(),
  },
];

export default statisticsChartsData;
