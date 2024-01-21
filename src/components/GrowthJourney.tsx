import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import fetchDataFromFirebase from "./fireData.ts";
import { Person } from "./types.ts";
import "chart.js/auto";

interface GrowthJourneyProps {
	selectedNamesList: string[];
}
const GrowthChart: React.FC<GrowthJourneyProps> = ({ selectedNamesList }) => {
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
		const statuses: Record<string, number> = {};

		// Use set to track unique names and map to store age group for each name
		const uniqueNames = new Set<string>();
		const statusMap: Record<string, string> = {};

		// Collect unique names and their corresponding age groups
		data.forEach((item: Person) => {
			const name = item["Name"];
			const status = item["Growth Journey"] || "NA";

			if (name && status !== "NA" && filteredNames.includes(name)) {
				uniqueNames.add(name);
				statusMap[name] = status;
			}
		});

		console.log("Unique names:", Array.from(uniqueNames));
		console.log("Age group map:", statusMap);
		// Count occurrences of each age range
		uniqueNames.forEach((name: string) => {
			const status = statusMap[name];
			statuses[status] = (statuses[status] || 0) + 1;
		});
		console.log("Age ranges:", statuses);

		// Define the specific age range labels
		const labels = [
			"Completed Growth Facilitator Training",
			"Attended Onboarding",
			"Completed Training + Practice",
			"Received Certificate",
			"Other Growthcircle Types",
		];

		// Create an array of values corresponding to each age range label
		const values = labels.map((label) => statuses[label] || 0);
		console.log("Labels:", labels);
		console.log("Values:", values);

		const chartData = {
			type: "horizontalBar",
			labels: [
				["Completed Growth", "Facilitator Training"],
				["Attended", "Onboarding"],
				["Completed Training", "and Practice"],
				["Received", "Certificate"],
				["Other Growthcircle", "Types"],
			],
			datasets: [
				{
					label: "Number of Growth Facilitators",
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
		//responsive: false,
		width: "350px", // Set your desired width
		height: "275px",

		maintainAspectRatio: false,
		scales: {
			x: {
				stacked: true,
				beginAtZero: true,
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

export default GrowthChart;
