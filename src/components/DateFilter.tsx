import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import "./Dropdown.css";
import { DateField } from "@mui/x-date-pickers/DateField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";
import dayjs from "dayjs";
import { StyledEngineProvider } from "@mui/material/styles";

interface DateFilterProps {
	onSelect: (dateRange: { startDate: string | null; endDate: string | null }) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ onSelect }) => {
	const [startDate, setStartDate] = useState<string | null>(null);
	const [endDate, setEndDate] = useState<string | null>(null);
	const [isDropdownVisible, setDropdownVisible] = useState(false);

	const handleDropdownToggle = () => {
		setDropdownVisible(!isDropdownVisible);
	};

	const handleDateChange = (newValue: dayjs.Dayjs | null, type: "start" | "end") => {
		// Validate the selected dates if needed
		const formattedDate = newValue ? newValue.format("DD/MM/YY") : null;

		if (type === "start") {
			setStartDate(formattedDate);
			onSelect({ startDate: formattedDate, endDate });
		} else {
			setEndDate(formattedDate);
			onSelect({ startDate, endDate: formattedDate });
		}
	};

	return (
		<div className="filter-type">
			<div className="dropdown-container">
				<div className="label" onClick={handleDropdownToggle}>
					<label>Date</label>{" "}
					{isDropdownVisible ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
				</div>
				{isDropdownVisible && (
					<div className="date-input">
						<StyledEngineProvider injectFirst>
							<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
								<DateField
									value={startDate ? dayjs(startDate, "DD/MM/YY") : null}
									onChange={(newValue) => handleDateChange(newValue, "start")}
									format="DD/MM/YY"
									shouldRespectLeadingZeros
								/>
							</LocalizationProvider>
							<span>to</span>
							<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
								<DateField
									value={endDate ? dayjs(endDate, "DD/MM/YY") : null}
									onChange={(newValue) => handleDateChange(newValue, "end")}
									format="DD/MM/YY"
									shouldRespectLeadingZeros
								/>
							</LocalizationProvider>
						</StyledEngineProvider>
					</div>
				)}
			</div>
		</div>
	);
};

export default DateFilter;
