import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import fetchDataFromFirebase from "./fireData.ts";
import { Person } from "./types.ts";
import "chart.js/auto";

interface CircleNameChartProps {
	selectedNamesList: string[];
}

const circleName = "Wellbeing Growth Circles"; //change to wtv the filter asks for

const CircleNameChart: React.FC<CircleNameChartProps> = ({ selectedNamesList }) => {
	const [error, setError] = useState<Error | null>(null);
	const [chartData, setChartData] = useState<any | null>(null);
	const [uniqueNamesCount, setUniqueNamesCount] = useState<number>(0);
	const [totalNames, setTotalNamesCount] = useState<number>(0);

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
				setUniqueNamesCount(processedData.datasets[0].data[0]);
				setTotalNamesCount(processedData.datasets[0].data[1]);
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
					setUniqueNamesCount(processedData.datasets[0].data[0]);
					setTotalNamesCount(processedData.datasets[0].data[1]);
				} catch (error) {
					setError(error as Error);
				}
			};

			fetchDataForSelectedNames();
		}
	}, [selectedNamesList]);

	const processData = (data: Person[], filteredNames: string[]) => {
		console.log("Processing data:", data);

		// Use set to track unique names and map to store age group for each name
		const uniqueNames = new Set<string>();
		const totalNames = new Set<string>();

		// Collect unique names and their corresponding age groups
		data.forEach((item: Person) => {
			const name = item["Name"];
			const supportCircle = item["Growthcircle Name"] || "NA";
			if (name != "NA" && filteredNames.includes(name)) {
				totalNames.add(name);
			}

			if (name != "NA" && supportCircle == circleName && filteredNames.includes(name)) {
				uniqueNames.add(name);
			}
		});
		const totalNamesCount = totalNames.size;
		const uniqueNamesCount = uniqueNames.size;

		const chartData = {
			type: "doughnut",
			labels: ["Supports Growthcircle", "Does not support"],
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: false,
					},
					datalabels: {
						display: false, // Hide data labels if you want
					},
				},
			},
			datasets: [
				{
					data: [uniqueNamesCount, totalNamesCount - uniqueNamesCount],
					backgroundColor: ["rgba(127, 211, 63, 1)", "rgba(127, 211, 63, 0.22)"],
				},
			],
		};

		return chartData;
	};

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div style={{ position: "relative" }}>
			<div className="graph">{chartData !== null && <Doughnut data={chartData} />}</div>
			<div
				style={{
					position: "absolute",
					top: "60%",
					left: "43%",
					transform: "translate(-50%, -50%)",
					textAlign: "center",
					color: "#565454", // Set the color
					fontSize: "14px",
					//fontWeight: "500"
				}}>
				{((uniqueNamesCount / (uniqueNamesCount + totalNames)) * 100).toFixed(0)}% (
				{uniqueNamesCount})
			</div>
		</div>
	);
};

export default CircleNameChart;
