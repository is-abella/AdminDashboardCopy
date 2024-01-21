import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import fetchDataFromFirebase from "./fireData.ts";
import { Person } from "./types.ts";
import "chart.js/auto";

interface SatisfactionSelfProps {
	selectedNamesList: string[];
}

//PARTICIPANTS ONLY

const SatisChart: React.FC<SatisfactionSelfProps> = ({ selectedNamesList }) => {
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
		//const uniqueNames = new Set<string>();
		let count = 0;
		let totalSat = 0;
		data.forEach((item: Person) => {
			//const name = item["Name"];
			const facilName = item["For Facil - Please write your Growth Facilitator's Name"];
			const satisfaction =
				item[
					"For Self - On a scale of 0-10, how satisfied are you with today’s Growth Circle?"
				];
			console.log("satis", satisfaction);
			if (additionalStrings.includes(facilName)) {
				count += 1;
				totalSat += parseInt(satisfaction, 10);
			}
		});
		//console.log(satisfaction);
		console.log(count);

		const chartData = {
			type: "horizontalBar",
			labels: ["Rating"],
			datasets: [
				{
					label: "Rating",

					data: [totalSat / count],
					backgroundColor: "rgba(127, 211, 63, 1)",
					borderColor: "rgba(75, 192, 192, 1)",
					borderWidth: 1,
					borderRadius: 5,
					barThickness: 50,
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
				max: 10,
				title: {
					display: true,
					text: "Average Rating", // Your x-axis title
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
			title: {
				display: true,
				text: [
					["“On a scale of 1-10, how satisfied"],
					['are you with today’s Growthcircle?"'],
				], // Your chart title
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

export default SatisChart;
