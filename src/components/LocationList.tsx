import React, { useEffect, useState } from "react";
import fetchDataFromFirebase from "./fireData.ts";
import { Person } from "./types";

interface LocationProps {
	selectedNamesList: string[];
}
const LocationList: React.FC<LocationProps> = ({ selectedNamesList }) => {
	const [locationData, setLocationData] = useState<{ [location: string]: number }>({});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data: Person[] | null = await fetchDataFromFirebase();

				if (data !== null) {
					const uniqueFacilitators = new Set<string>();
					const locationCounts: { [location: string]: number } = {};

					data.forEach((person) => {
						// Check if the person is a facilitator
						if (person["Session Role"] === "Facilitator") {
							// Check if the facilitator is unique based on their name
							if (!uniqueFacilitators.has(person.Name)) {
								uniqueFacilitators.add(person.Name);

								// Increment the count for the organization
								const location = person.Location || "Unknown"; // Use 'Unknown' if organization is not specified
								locationCounts[location] = (locationCounts[location] || 0) + 1;
							}
						}
					});

					setLocationData(locationCounts);
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
			const locationCounts: { [location: string]: number } = {};

			fetchedData.forEach((person) => {
				// Check if the person is a facilitator
				if (
					person["Session Role"] === "Facilitator" &&
					selectedNamesList?.includes(person.Name)
				) {
					// Check if the facilitator is unique based on their name
					if (!uniqueFacilitators.has(person.Name)) {
						uniqueFacilitators.add(person.Name);

						// Increment the count for the organization
						const location = person.Location || "Unknown"; // Use 'Unknown' if organization is not specified
						locationCounts[location] = (locationCounts[location] || 0) + 1;
					}
				}
			});

			setLocationData(locationCounts);
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
				{Object.entries(locationData).map(([location, count]) => (
					<div
						key={location}
						style={{
							marginBottom: "5px",
							padding: "5px",
							backgroundColor: "#FDF5E6",
							borderRadius: "5px",
							textAlign: "left",
							color: "#565454",
							//boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
							//display: 'flex', // Add flex display
							//alignItems: 'center', // Center content vertically
						}}>
						<div style={{ flex: 1 }}>
							{location} ({count})
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default LocationList;
