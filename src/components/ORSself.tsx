import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import fetchDataFromFirebase from "./fireData.ts";
import { Person } from "./types.ts";
import "chart.js/auto";

interface ORSselfProps {
	selectedNamesList: string[];
}

const ORSselfChart: React.FC<ORSselfProps> = ({ selectedNamesList }) => {
	const [error, setError] = useState<Error | null>(null);
	const [chartData, setChartData] = useState<any | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedData: Person[] | null = await fetchDataFromFirebase();

				if (fetchedData === null) {
					console.error("No data available");
					return;
				}
				const allNames: string[] = fetchedData
					.filter((person) => person["Name"] !== "NA")
					.map((person) => person["Name"]);
				const processedData = processData(fetchedData, allNames);
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

	const processData = (data: Person[], filteredNames: string[]) => {
		console.log("Processing data:", data);

		//const uniqueNames = new Set<string>(); // not actually considering only unique names.
		//Might have multiple instances of same name but across diff sessions. So taking average across all sessions
		let count = 0;
		const dataArray = [
			[0, 0],
			[0, 0],
			[0, 0],
			[0, 0],
		]; //first of each element is pre, 2nd is post.
		data.forEach((item: Person) => {
			const name = item["Name"];

			if (name !== "NA" && filteredNames.includes(name)) {
				count += 1;
				dataArray[0][0] += parseInt(item["CheckIn Individually"], 10);
				dataArray[0][1] += parseInt(item["CheckOut Individually"], 10);
				dataArray[1][0] += parseInt(item["CheckIn Interpersonally"], 10);
				dataArray[1][1] += parseInt(item["CheckOut Interpersonally"], 10);
				dataArray[2][0] += parseInt(item["CheckIn Overall"], 10);
				dataArray[2][1] += parseInt(item["CheckOut Overall"], 10);
				dataArray[3][0] += parseInt(item["CheckIn Social"], 10);
				dataArray[3][1] += parseInt(item["CheckOut Social"], 10);
			}
		});
		//console.log('datarry Data:', dataArray);

		const chartData = {
			type: "horizontalBar",
			labels: ["Individually", "Interpersonally", "Overall", "Social"],
			datasets: [
				{
					label: "Before",
					data: dataArray.map((values) => values[0] / count),
					backgroundColor: ["#BADDF0", "#DFD3F9", "#FADCAF", "#CCEEB2"],
					borderRadius: 5,
				},
				{
					label: "After",
					data: dataArray.map((values) => values[1] / count),
					backgroundColor: ["#53A9DA", "#AF91F0", "#F2A838", "#7FD33F"],
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

		scales: {
			x: {
				stacked: true,
				beginAtZero: true,
				max: 20,
				title: {
					display: true,
					// Your x-axis title
				},
			},
			y: {
				stacked: true,
			},
		},
		plugins: {
			legend: {
				display: false,
			},
		},
		indexAxis: "y" as "y", // Set indexAxis to 'y' for a horizontal bar chart
	};

	return (
		<div>
			<div className="graph">
				{chartData !== null && <Bar data={chartData} options={options} />}
			</div>
		</div>
	);
};

export default ORSselfChart;
