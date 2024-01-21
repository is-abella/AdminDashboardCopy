import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import fetchDataFromFirebase from "./fireData.ts";
import { Person } from "./types.ts";
import "chart.js/auto";

interface GenderProps {
	selectedNamesList: string[];
}

const GenderChart: React.FC<GenderProps> = ({ selectedNamesList }) => {
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
		const genders: Record<string, number> = {};

		// Use set to track unique names and map to store age group for each name
		const uniqueNames = new Set<string>();
		const genderMap: Record<string, string> = {};

		// Collect unique names and their corresponding age groups
		data.forEach((item: Person) => {
			const name = item["Name"];
			const gender = item["Gender"] || "NA";

			if (name && gender !== "NA" && additionalStrings.includes(name)) {
				uniqueNames.add(name);
				genderMap[name] = gender;
			}
		});

		// Count occurrences of each age range
		uniqueNames.forEach((name: string) => {
			const gen = genderMap[name];
			genders[gen] = (genders[gen] || 0) + 1;
		});

		// Define the specific age range labels
		const labels = ["Male", "Female", "Others"];

		// Create an array of values corresponding to each age range label
		const values = labels.map((label) => genders[label] || 0);
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

export default GenderChart;
