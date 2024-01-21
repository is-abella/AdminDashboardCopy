// src/components/NumOfGrowthFacils.tsx
import React, { useEffect, useState } from "react";
import fetchDataFromFirebase from "./fireData.ts";
import { Person } from "./types";
import "./NumOfGrowthFacils.css";

interface NumOfGrowthFacilsProps {
	selectedNamesList: string[];
}

const NumOfGrowthFacils: React.FC<NumOfGrowthFacilsProps> = ({ selectedNamesList }) => {
	const [uniqueNames, setUniqueNames] = useState<string[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data: Person[] | null = await fetchDataFromFirebase();

				if (data !== null) {
					const facilitatorData = data.filter(
						(person) => person["Session Role"] === "Facilitator"
					);
					const uniqueFacilitatorNames = Array.from(
						new Set(facilitatorData.map((person) => person.Name))
					);
					setUniqueNames(() => uniqueFacilitatorNames);
				} else {
					setUniqueNames(() => []);
				}
			} catch (error: unknown) {
				if (error instanceof Error) {
					console.error("Error fetching data:", error.message);
				} else {
					console.error("Unexpected error:", error);
				}
			}
		};

		if (selectedNamesList && selectedNamesList.length === 0) {
			fetchData();
		} else {
			const filteredNames = selectedNamesList.filter((name) => name !== "NA");
			setUniqueNames(() => filteredNames);
		}
	}, [selectedNamesList]);

	return (
		<div>
			<div className="graph">
				<span className="rowCountText">{uniqueNames.length}</span>
				<span style={{ color: "#565454", fontSize: "32px", fontWeight: "500" }}>
					to date{" "}
				</span>
			</div>
		</div>
	);
};

export default NumOfGrowthFacils;
