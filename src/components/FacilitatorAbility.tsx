import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import fetchDataFromFirebase from "./fireData.ts";
import { Person } from "./types.ts";
import "chart.js/auto";
interface ORSselfPartProps {
	selectedNamesList: string[];
}
const FacilitatorAbility: React.FC<ORSselfPartProps> = ({ selectedNamesList }) => {
  const [error, setError] = useState<Error | null>(null);
  const [chartData, setChartData] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Person[] | null = await fetchDataFromFirebase();

        if (data === null) {
          console.error("No data available");
          return;
        }

        const allNames: string[] = data
					.filter((person) => person["Name"] !== "NA")
					.map((person) => person["Name"]);
				const processedData = processData(data, allNames);
				console.log("Updated chartData:", processedData);

				// Set chartData in state
				setChartData(processedData);
      } catch (error) {
        setError(error as Error);
      }
    };

    if (selectedNamesList && selectedNamesList.length === 0) {
			fetchData();
		} else {
			const fetchDataForSelectedNames = async () => {
				try {
					const fetchedData: Person[] | null = await fetchDataFromFirebase();

					if (fetchedData === null) {
						console.error("No data available");
						return;
					}

					const filteredNames = selectedNamesList.filter((name) => name !== "NA");
					const processedData = processData(fetchedData, filteredNames);
					setChartData(processedData);
				} catch (error) {
					setError(error as Error);
				}
			};

			fetchDataForSelectedNames();
		}
  }, [selectedNamesList]);

  const processData = (data: Person[], selectedNamesList: string[]) => {
    console.log("Processing data:", data);

    const uniqueNames = new Set<string>();
    const dataArray = [0, 0, 0, 0, 0, 0, 0, 0];

    data.forEach((item: Person) => {
      const name = item["Name"];

      if (selectedNamesList.includes(name) && name !== "NA" && !uniqueNames.has(name)) {
        uniqueNames.add(name);
        dataArray[1] += parseInt(item["For Facil - Communicate well with the group"], 10);
        dataArray[0] += parseInt(item["For Facil - Create a space that made us feel safe to share"], 10);
        dataArray[6] += parseInt(item["For Facil - Empower us to support one another"], 10);
        dataArray[2] += parseInt(item["For Facil - Engage the group effectively"], 10);
        dataArray[4] += parseInt(item["For Facil - Facilitate learning through reflections"], 10);
        dataArray[5] += parseInt(item["For Facil - Have the necessary knowledge and skills for the role"], 10);
        dataArray[7] += parseInt(item["For Facil - Invite and embrace all perspectives"], 10);
        dataArray[3] += parseInt(item["For Facil - Provide useful insights"], 10);
      }
    });

    const chartData = {
      type: "horizontalBar",
      labels: [
        "Create a space that made us feel safe to share",
        'Communicate well with the group',
        'Engage the group effectively',
        'Provide useful insights',
        'Facilitate learning through reflections',
        'Have the necessary knowledge and skills',
        'Empower us to support one another',
        'Invite and embrace all perspectives',
      ],
      datasets: [
        {
          label: '',
          data: dataArray.map((value) => value / uniqueNames.size),
          backgroundColor: ['#6070FF', '#00A1C5', '#D0698E', '#E1B826', '#53A9DA', '#AF91F0', '#F2A838', '#7FD33F'],
          borderRadius: 5,
        },
      ],
    };

    return chartData;
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const options = {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 30,
        right: 40, // Increase right padding for larger container
        top: 30, // Increase top padding for larger container
        bottom: 40, // Increase bottom padding for larger container
      },
    },
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
        },
        ticks: {
          autoSkip: false,
          maxRotation: 90, // Adjust the rotation angle as needed
          minRotation: 0, // Allow for less rotation when labels are short
          maxTicksLimit: 8, // Adjust the maximum number of ticks displayed
        },
      },
      y: {
        stacked: true,
        ticks: {
          autoSkip: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    indexAxis: "y" as "y",
  };

  const containerStyle = {
    width: '600px', // Increase the width for a larger chart
    height: '500px', // Increase the height for a larger chart
  };

  return (
    <div>
      <div className="graph" style={containerStyle}>
        {chartData !== null && <Bar data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default FacilitatorAbility;
