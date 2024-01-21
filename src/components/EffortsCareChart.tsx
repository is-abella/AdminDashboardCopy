import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import fetchDataFromFirebase from "./fireData.ts";
import { Person } from "./types.ts";
import "chart.js/auto";

//PARTICIPANTS ONLY

interface EngagementProps {
	selectedNamesList: string[];
}

const EffortsCareChart: React.FC<EngagementProps> = ({ selectedNamesList }) => {
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
		const engageRanges: Record<string, number> = {};

		data.forEach((item: Person) => {
			const facilname = item["Name"];
			const support = item["For Group - Efforts, Care & Support and Role"];

			if (filteredNames.includes(facilname)) {
				if (support == "Efforts") {
					engageRanges["Efforts"] =
						(engageRanges["Efforts"] || 0) + 1;
				} else if (support == "Care & Support") {
					engageRanges["Care & Support"] = (engageRanges["Care & Support"] || 0) + 1;
				} else if (support == "Role") {
					engageRanges["Role"] = (engageRanges["Role"] || 0) + 1;
				}
			}
		});

		// Define the specific age range labels
		const labels = [
			"Efforts",
      "Care & Support",
      "Role"
		];

		// Create an array of values corresponding to each age range label
		const values = labels.map((label) => engageRanges[label] || 0);

		const chartData = {
			type: "horizontalBar",
			labels: labels,
			datasets: [
				{
					label: "Number of Growth Facils",
					data: values,
					backgroundColor: "rgba(127, 211, 63, 1)",
					borderColor: "rgba(75, 192, 192, 1)",
					borderWidth: 1,
					borderRadius: 5,
					//type: 'horizontalBar'
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
		//responsive: false,
		//width: '350px', // Set your desired width
		//height: '3400px',

		scales: {
			x: {
				stacked: true,
				beginAtZero: true,
				//max: 20,
				title: {
					display: true,
					text: "Number of Growth Facilitators", // Your x-axis title
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
	const containerStyle = {
		width: "350px", // Set your desired width
		height: "275px", // Set your desired height
	};
	return (
		<div>
			<div className="graph" style={containerStyle}>
				{chartData !== null && <Bar data={chartData} options={options} />}
			</div>
		</div>
	);
};

export default EffortsCareChart;
