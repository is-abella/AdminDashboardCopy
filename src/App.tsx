// import React from "react";
import "./App.css";
import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Overview from "./pages/Overview";
import ForSelf from "./pages/ForSelf";
import ForFacil from "./pages/ForFacil";
import ForGroup from "./pages/ForGroup";
import Header from "./components/Header";
import { IoFilterCircle } from "react-icons/io5";
// import Data from "./Data";
// import Card from "./Card";
// import Buttons from "./Buttons";
import FilterBox from "./components/FilterBox";
import Sidebar from "./components/Sidebar";

const users = [
	{ firstName: "John", id: 1 },
	{ firstName: "Emily", id: 2 },
	{ firstName: "Michael", id: 3 },
	{ firstName: "Sarah", id: 4 },
	{ firstName: "David", id: 5 },
	{ firstName: "Jessica", id: 6 },
	{ firstName: "Daniel", id: 7 },
	{ firstName: "Olivia", id: 8 },
	{ firstName: "Matthew", id: 9 },
	{ firstName: "Sophia", id: 10 },
];

function App() {
	// const [item, setItem] = useState(Data);
	// const menuItems = [...new Set(Data.map((Val) => Val.category))];

	// const filterItem = (curcat: any) => {
	// 	const newItem = Data.filter((newVal) => {
	// 		return newVal.category === curcat;
	// 	});
	// 	setItem(newItem);
	// };
	const [searchItem, setSearchItem] = useState("");
	const [filteredUsers, setFilteredUsers] = useState(users);

	const handleInputChange = (e: any) => {
		const searchTerm = e.target.value;
		setSearchItem(searchTerm);

		const filteredItems = users.filter((user) =>
			user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
		);

		setFilteredUsers(filteredItems);
	};

	const [searchBarActive, setSearchBarActive] = useState(false);

	const handleSearchBarClick = () => {
		setSearchBarActive(!searchBarActive);
	};

	const [isFilterBoxVisible, setFilterBoxVisible] = useState(false);

	const handleFilterButtonClick = () => {
		setFilterBoxVisible(!isFilterBoxVisible);
	};
	return (
		<BrowserRouter>
			<Header />
			<div className="app-container">
				<Sidebar />
				<div className="content">
					<IoFilterCircle onClick={handleFilterButtonClick} className="button-style" />
					{isFilterBoxVisible && (
						<FilterBox
							onClose={() => setFilterBoxVisible(false)}
							onApply={(finalList) => console.log(finalList)}
						/>
					)}
					{/* <div className="filter">
						<Buttons filterItem={filterItem} setItem={setItem} menuItems={menuItems} />
						<Card item={item} />
					</div> */}
					<div className="searchbar">
						<input
							type="text"
							value={searchItem}
							onChange={handleInputChange}
							placeholder=" 🔍 Type to search"
							onClick={handleSearchBarClick}
						/>
						{searchBarActive && (
							<div className="user-list-container">
								<ul className="user-list">
									{filteredUsers.map((user) => (
										<li key={user.id}>{user.firstName}</li>
									))}
								</ul>
							</div>
						)}
					</div>

					<Routes>
						<Route path="/" element={<Overview />} />
						<Route path="/ForSelf" element={<ForSelf />} />
						<Route path="/ForFacil" element={<ForFacil />} />
						<Route path="/ForGroup" element={<ForGroup />} />

					</Routes>
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
