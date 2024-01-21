import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import fetchDataFromFirebase from "./fireData.ts";
import { Person } from "./types.ts";
import "chart.js/auto";

interface AgeChartProps {
	selectedNamesList: string[];
}

const AgeChart: React.FC<AgeChartProps> = ({ selectedNamesList }) => {
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

	const processData = (data: Person[], additionalStrings: string[]) => {
		console.log("Processing data:", data);
		const ageRanges: Record<string, number> = {};

		// Use set to track unique names and map to store age group for each name
		const uniqueNames = new Set<string>();
		const ageGroupMap: Record<string, string> = {};

		// Collect unique names and their corresponding age groups
		data.forEach((item: Person) => {
			const name = item["Name"];
			const ageRange = item["Age Range"] || "NA";

			if (name && ageRange !== "NA" && additionalStrings.includes(name)) {
				uniqueNames.add(name);
				ageGroupMap[name] = ageRange;
			}
		});

		// Count occurrences of each age range
		uniqueNames.forEach((name: string) => {
			const ageRange = ageGroupMap[name];
			ageRanges[ageRange] = (ageRanges[ageRange] || 0) + 1;
		});
		console.log("Age ranges:", ageRanges);

		// Define the specific age range labels
		const labels = ["15 to 24", "25 to 34", "35 to 44", "45 to 54", "55 to 65", "65 and above"];

		// Create an array of values corresponding to each age range label
		const values = labels.map((label) => ageRanges[label] || 0);
		console.log("Labels:", labels);
		console.log("Values:", values);

		const chartData = {
			type: "horizontalBar",
			labels: labels,
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
		maintainAspectRatio: false,
		//responsive: false,
		//width: '350px', // Set your desired width
		//height: '3400px',

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

export default AgeChart;
