import React, { useEffect, useState } from "react";
import fetchDataFromFirebase from "./fireData.ts";
import { Person } from "./types";

interface TopFiveProps {
	selectedNamesList: string[];
}
const TopFiveChart: React.FC<TopFiveProps> = ({ selectedNamesList }) => {
	const [topicData, setTopicData] = useState<{ [location: string]: number }>({});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data: Person[] | null = await fetchDataFromFirebase();

				if (data !== null) {
					const uniqueFacilitators = new Set<string>();
					const topicCounts: { [location: string]: number } = {};

					data.forEach((item: Person) => {
						// Check if the person is a facilitator
						if (item["Session Role"] === "Facilitator") {
							// Check if the facilitator is unique based on their name
							if (!uniqueFacilitators.has(item.Name)) {
								uniqueFacilitators.add(item.Name);

								// Increment the count for the organization
								const topic = item["Topic"] || "Unknown"; // Use 'Unknown' if organization is not specified
								topicCounts[topic] = (topicCounts[topic] || 0) + 1;
							}
						}
					});

					setTopicData(topicCounts);
				} else {
					console.log("No data available");
				}
			} catch (error) {
				console.error(
					"Error fetching data:",
					error instanceof Error ? error.message : "Unexpected error"
				);
			}
		};

		if (selectedNamesList && selectedNamesList.length === 0) {
			fetchData();
		} else {
			fetchDataForSelectedNames();
		}
	}, [selectedNamesList]);

	const fetchDataForSelectedNames = async () => {
		try {
			const fetchedData: Person[] | null = await fetchDataFromFirebase();

			if (fetchedData === null) {
				console.error("No data available");
				return;
			}

			const uniqueFacilitators = new Set<string>();
			const topicCounts: { [location: string]: number } = {};

			fetchedData.forEach((item: Person) => {
				// Check if the person is a facilitator
				if (
					item["Session Role"] === "Facilitator" &&
					selectedNamesList?.includes(item.Name)
				) {
					// Check if the facilitator is unique based on their name
					//if (!uniqueFacilitators.has(item.Name)) {
					//uniqueFacilitators.add(item.Name);

					// Increment the count for the organization
					const topic = item["Topic"] || "Unknown"; // Use 'Unknown' if organization is not specified
					topicCounts[topic] = (topicCounts[topic] || 0) + 1;
					// }
				}
			});

			setTopicData(topicCounts);
		} catch (error) {
			console.error(
				"Error fetching data:",
				error instanceof Error ? error.message : "Unexpected error"
			);
		}
	};

	return (
		<div className="graph">
			<div>
				{Object.entries(topicData)
					.sort(([, countA], [, countB]) => countB - countA)
					.slice(0, 5)
					.map(([topic, count], index) => (
						<div
							key={topic}
							style={{
								marginBottom: "5px",
								padding: "5px",
								backgroundColor: "#FDF5E6",
								borderRadius: "5px",
								textAlign: "left",
								color: "#565454",
							}}>
							<div style={{ flex: 1 }}>
								<strong>{`${index + 1}${
									index + 1 === 1
										? "st"
										: index + 1 === 2
										? "nd"
										: index + 1 === 3
										? "rd"
										: "th"
								} - `}</strong>
								{`${topic} (${count})`}
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default TopFiveChart;
