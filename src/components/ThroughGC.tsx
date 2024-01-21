import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import fetchDataFromFirebase from "./fireData.ts";
import { Person } from "./types.ts";
import "chart.js/auto";

interface ThroughGCProps {
	selectedNamesList: string[];
}

//ONLY Participants
const ThroughThisChart: React.FC<ThroughGCProps> = ({ selectedNamesList }) => {
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
		const dataArray = [0, 0, 0, 0, 0]; //first of each element is pre, 2nd is post.
		data.forEach((item: Person) => {
			const facilname = item["For Facil - Please write your Growth Facilitator's Name"];

			if (filteredNames.includes(facilname)) {
				count += 1;
				dataArray[0] += parseInt(item["For Self - I feel heard and understood"], 10);
				dataArray[1] += parseInt(
					item["For Self - I have gained new perspectives or Ideas"],
					10
				);
				dataArray[2] += parseInt(item["For Self - I am inspired and encouraged"], 10);
				dataArray[3] += parseInt(item["For Self - I feel I understand myself better"], 10);
				dataArray[4] += parseInt(
					item["For Self - I was able to think deeper because of questions asked"],
					10
				);
			}
		});
		//console.log('datarry Data:', dataArray);

		const chartData = {
			type: "horizontalBar",
			labels: [
				["I feel heard", "& understood"],
				["I have gained new", "perspectives/ideas"],
				["I am inspired", "& encouraged"],
				["I understand", " myself better"],
				["I was able to", " think deeper"],
			],
			datasets: [
				{
					label: "Average Rating",
					data: dataArray.map((values) => values / count),
					backgroundColor: ["#BADDF0", "#DFD3F9", "#FADCAF", "#CCEEB2", "#FFECA6"],
					borderRadius: 5,
                    //barThickness: 15,
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
				//max: 5,
				title: {
					display: true,
					text: "Average Rating",
				},
                categoryPercentage: 0.8, // Adjust the space between bars
                barPercentage: 0.9,
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

export default ThroughThisChart;
