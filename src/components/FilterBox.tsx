import React from "react";
import { IoCloseCircle } from "react-icons/io5";
import "./FilterBox.css";
import Dropdown from "./Dropdown";
import DateFilter from "./DateFilter";
import fetchDataFromFirebase from "./fireData.ts";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useAppContext } from "./AppContext";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface FilterBoxProps {
	onClose: () => void;
	onApply: (finalList: string[]) => void;
}

interface SelectedFilters {
	Date: { startDate: string | null; endDate: string | null } | null;
	Cohort: string;
	LocationOrganisation: string;
	Gc: string;
	Age: string;
	Gender: string;
	Individual: string;
}

const FilterBox: React.FC<FilterBoxProps> = ({ onClose, onApply }) => {
	const [cohortOptions, setCohortOptions] = useState<string[]>([]);
	const [locationOptions, setLocationOptions] = useState<string[]>([]);
	const [organisationOptions, setOrganisationOptions] = useState<string[]>([]);
	const [locationOrganisationOptions, setLocationOrganisationOptions] = useState<string[]>([]);
	const [gcOptions, setGcOptions] = useState<string[]>([]);
	const [genderOptions, setGenderOptions] = useState<string[]>([]);
	const [ageOptions, setAgeOptions] = useState<string[]>([]);
	const [individualOptions, setIndividualOptions] = useState<string[]>([]);
	const { setNamesList } = useAppContext();

	useEffect(() => {
		fetchFilterOptions("Cohort", setCohortOptions);
		fetchFilterOptions("Location", setLocationOptions);
		fetchFilterOptions("Organisation", setOrganisationOptions);
		fetchFilterOptions("Growthcircle Name", setGcOptions);
		fetchFilterOptions("Gender", setGenderOptions);
		fetchFilterOptions("Age Range", setAgeOptions);
	}, []);

	//combine location and organisation options
	useEffect(() => {
		const uniqueOptionsSet = new Set([...locationOptions, ...organisationOptions]);
		const uniqueOptions = Array.from(uniqueOptionsSet);

		setLocationOrganisationOptions(uniqueOptions);
	}, [locationOptions, organisationOptions]);

	const fetchFilterOptions = async (
		filterType: string,
		setOptions: React.Dispatch<React.SetStateAction<string[]>>
	) => {
		try {
			const data = await fetchDataFromFirebase();
			if (data) {
				// Extract unique values for the specified filter type from the fetched data
				let uniqueOptions = Array.from(
					new Set(data.map((entry) => entry[filterType]))
				).filter((option) => option !== "NA");
				setOptions(uniqueOptions);
			}
		} catch (error) {
			console.error(`Error fetching ${filterType} data:`, error.message);
		}
	};

	const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
		Date: { startDate: null, endDate: null },
		Cohort: "All",
		LocationOrganisation: "All",
		Gc: "All",
		Age: "All",
		Gender: "All",
		Individual: "All",
	});

	useEffect(() => {
		// Fetch individual options based on selected filters
		fetchIndividualOptions(selectedFilters);
	}, [selectedFilters]);

	const fetchIndividualOptions = async (filters: SelectedFilters) => {
		try {
			const data = await fetchDataFromFirebase();
			if (data) {
				let filteredData = data.filter((entry) => {
					const entryDate = dayjs(entry.Date, "MMMM DD, YYYY");

					// Convert the filter start and end dates to dayjs format
					const startDate = filters.Date?.startDate
						? dayjs(filters.Date.startDate, "DD/MM/YY")
						: null;
					const endDate = filters.Date?.endDate
						? dayjs(filters.Date.endDate, "DD/MM/YY")
						: null;

					return (
						(filters.Cohort === "All" || entry.Cohort === filters.Cohort) &&
						(filters.Gender === "All" || entry.Gender === filters.Gender) &&
						(filters.LocationOrganisation === "All" ||
							entry.Location === filters.LocationOrganisation ||
							entry.Organisation === filters.LocationOrganisation) &&
						(filters.Age === "All" || entry["Age Range"] === filters.Age) &&
						(filters.Gc === "All" || entry["Growthcircle Name"] === filters.Gc) &&
						(!startDate ||
							!endDate ||
							(entryDate.isSameOrAfter(startDate) &&
								entryDate.isSameOrBefore(endDate)))
					);
				});

				// Extract unique names for the "Individual" filter from the filtered data
				const uniqueIndividualOptions = Array.from(
					new Set(filteredData.map((entry) => entry.Name))
				);

				setIndividualOptions(uniqueIndividualOptions);
			}
		} catch (error) {
			console.error("Error fetching individual options:", error.message);
		}
	};

	const handleFilterSelect = (
		filterType: string,
		selectedOption: string | { startDate: string | null; endDate: string | null }
	) => {
		// Update the selected filters directly
		setSelectedFilters((prevFilters) => ({
			...prevFilters,
			[filterType]: selectedOption,
		}));
		console.log(`Filter "${filterType}" selected option: ${JSON.stringify(selectedOption)}`);
	};

	const handleApply = () => {
		const finalList =
			selectedFilters.Individual === "All" ? individualOptions : [selectedFilters.Individual];
		onApply(finalList);
		setNamesList(finalList);
	};

	return (
		<div className="filter-box">
			<IoCloseCircle onClick={onClose} className="close-button" />
			<div className="filter-content">
				<DateFilter onSelect={(dateRange) => handleFilterSelect("Date", dateRange)} />
				<div style={{ margin: "8px" }} />
				<Dropdown
					label="Batch/Cohort"
					options={cohortOptions}
					onSelect={(option) => handleFilterSelect("Cohort", option)}
				/>
				<div style={{ margin: "8px" }} />
				<Dropdown
					label="Location/Organisation"
					options={locationOrganisationOptions}
					onSelect={(option) => handleFilterSelect("LocationOrganisation", option)}
				/>
				<div style={{ margin: "8px" }} />
				<Dropdown
					label="Type of Growthcircle"
					options={gcOptions}
					onSelect={(option) => handleFilterSelect("Gc", option)}
				/>
				<div style={{ margin: "8px" }} />
				<Dropdown
					label="Age"
					options={ageOptions}
					onSelect={(option) => handleFilterSelect("Age", option)}
				/>
				<div style={{ margin: "8px" }} />
				<Dropdown
					label="Gender"
					options={genderOptions}
					onSelect={(option) => handleFilterSelect("Gender", option)}
				/>
				<div style={{ margin: "8px" }} />
				<Dropdown
					label="Individual"
					options={individualOptions}
					onSelect={(option) => handleFilterSelect("Individual", option)}
					individualOptions={individualOptions}
				/>
			</div>
			<div className="filter-footer">
				<button
					onClick={handleApply}
					className={`set-button ${individualOptions.length === 0 ? "disabled" : ""}`}
					disabled={individualOptions.length === 0}>
					Set
				</button>
			</div>
		</div>
	);
};

export default FilterBox;
