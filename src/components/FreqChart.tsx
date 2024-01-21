import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import fetchDataFromFirebase from "./fireData.ts";
import { Person } from "./types.ts";
import "chart.js/auto";
interface FreqChartProps {
	selectedNamesList: string[];
}

const FreqChart: React.FC<FreqChartProps> = ({ selectedNamesList }) => {
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
		const freqRanges: Record<string, number> = {};

		// Use set to track unique names and map to store age group for each name
		const uniqueNames = new Set<string>();
		const onboardMap: Record<string, string> = {};

		// Collect unique names and their corresponding age groups
		data.forEach((item: Person) => {
			const name = item["Name"];
			const onboardTimes = item["Times Attended Onboarding"] || "NA";

			if (name && onboardTimes !== "NA" && filteredNames.includes(name)) {
				uniqueNames.add(name);
				onboardMap[name] = onboardTimes;
			}
		});

		// Count occurrences of each age range
		uniqueNames.forEach((name: string) => {
			const freq = onboardMap[name];
			if (Number(freq) == 0) {
				freqRanges["0"] = (freqRanges["0"] || 0) + 1;
			} else if (Number(freq) >= 1 && Number(freq) <= 3) {
				freqRanges["1 to 3"] = (freqRanges["1 to 3"] || 0) + 1;
			} else if (Number(freq) >= 4) {
				freqRanges["4 and above"] = (freqRanges["4 and above"] || 0) + 1;
			}
		});

		// Define the specific age range labels
		const labels = ["4 and above", "1 to 3", "0"];

		// Create an array of values corresponding to each age range label
		const values = labels.map((label) => freqRanges[label] || 0);

		const chartData = {
			type: "horizontalBar",
			labels: [["4 and", "above"], "1 to 3", "0"],
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

export default FreqChart;
