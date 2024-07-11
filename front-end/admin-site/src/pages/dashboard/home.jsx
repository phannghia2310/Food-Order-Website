import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import { statisticsChartsData } from "@/data";
import { BanknotesIcon, ChartBarIcon, CheckCircleIcon, ClockIcon, ShoppingBagIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { getStatistics } from "@/api/homeApi";

export function Home() {
  const [statistics, setStatistics] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await statisticsChartsData();
        setChartData(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    getStatistics()
      .then(response => setStatistics(response.data))
      .catch(error => console.error('Error fetching statistics:', error));
  }, []);

  const icons = {
    BanknotesIcon: BanknotesIcon,
    UserPlusIcon: UserPlusIcon,
    ShoppingBagIcon: ShoppingBagIcon,
    ChartBarIcon: ChartBarIcon,
  };

  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statistics.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icons[icon], {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {chartData.length > 0 ? (
          chartData.map((props) => (
            <StatisticsChart
              key={props.title}
              {...props}
              footer={
                <Typography
                  variant="small"
                  className="flex items-center font-normal text-blue-gray-600"
                >
                  <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                  &nbsp;{props.footer}
                </Typography>
              }
            />
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}

export default Home;
