import React, { useState, useEffect } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import "./Dropdown.css";

interface DropdownProps {
	label: string;
	options: string[];
	onSelect: (option: string) => void;
	individualOptions?: string[];
}

const Dropdown: React.FC<DropdownProps> = ({
	label,
	options,
	onSelect,
	individualOptions = [],
}) => {
	const dropdownOptions =
		label === "Individual"
			? individualOptions.length === 0
				? ["No results"]
				: ["All", ...individualOptions.filter((opt) => opt !== "NA")]
			: ["All", ...options];

	const [selectedOption, setSelectedOption] = useState("All");
	const [isDropdownVisible, setDropdownVisible] = useState(false);

	const handleDropdownToggle = () => {
		setDropdownVisible(!isDropdownVisible);
	};

	useEffect(() => {
		if (!dropdownOptions.includes(selectedOption)) {
			setSelectedOption(dropdownOptions[0]);
		}
	}, [dropdownOptions, selectedOption]);

	const handleOptionSelect = (option: string) => {
		if (label === "Individual" && option === "No results") {
			return;
		}

		setSelectedOption(option);
		setDropdownVisible(false);
		onSelect(option);
	};

	return (
		<div className="filter-type">
			<div className="dropdown-container">
				<div className="labelandoption">
					<div className="label" onClick={handleDropdownToggle}>
						<label>{label}</label>{" "}
						{isDropdownVisible ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
					</div>
					<div className="selected">{selectedOption}</div>
				</div>
				{isDropdownVisible && (
					<ul className="options-list">
						{dropdownOptions.map((option) => (
							<li
								key={option}
								onClick={() => handleOptionSelect(option)}
								style={{
									color: option === selectedOption ? "#EB8181" : "#565454",
									cursor:
										label === "Individual" && option === "No results"
											? "not-allowed"
											: "pointer",
								}}>
								{option}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default Dropdown;
