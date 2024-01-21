import React from "react";
import { NavLink } from "react-router-dom";
import "../App.css";

function Sidebar() {
	const SidebarData = [
		{
			path: "/",
			name: "Overview",
		},
		{
			path: "/ForSelf",
			name: "For Self",
		},
		{
			path: "/ForFacil",
			name: "For Facilitators",
		},
		{
			path: "/ForGroup",
			name: "For Group",
		},
	];

	return (
		<div className="sidebar">
			<div className="sidebarlist">
				{SidebarData.map((item, index) => (
					<NavLink to={item.path} key={index} className="link">
						<div className="link_text">{item.name}</div>
					</NavLink>
				))}
			</div>
		</div>
	);
}

export default Sidebar;
