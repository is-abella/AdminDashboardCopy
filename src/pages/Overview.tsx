// src/pages/Overview.tsx
import React from "react";
import NumOfGrowthFacils from "../components/NumOfGrowthFacils.tsx";
import GenderChart from "../components/GenderChart.tsx";
import OrganizationList from "../components/OrganisationList.tsx";
import AgeChart from "../components/AgeChart.tsx"; //Age Chart
import LocationList from "../components/LocationList.tsx";
import GrowthChart from "../components/GrowthJourney.tsx";
import ComChart from "../components/ComPrac.tsx";
import "./Overview.css";
import FreqChart from "../components/FreqChart.tsx";
import CircleNameChart from "../components/CircleName.tsx";
import { useAppContext } from "../components/AppContext.tsx";

const growthName = "Wellbeing Growth Circles";

const Overview: React.FC = () => {
	const { selectedNamesList } = useAppContext();
	return (
		<div className="overview-container">
			<div className="grid-container">
				<div className="rowCountBox">
					<div className="title">Total no. of Growth Facilitators: </div>
					<NumOfGrowthFacils selectedNamesList={selectedNamesList} />
				</div>
				<div className="rowCountBox">
					<div className="title">Demographic: Age </div>
					<AgeChart selectedNamesList={selectedNamesList}/>
				</div>
				<div className="rowCountBox">
					<div className="title">Demographic: Gender </div>
					<GenderChart selectedNamesList={selectedNamesList}/>
				</div>
			</div>
			<div className="horizontal-divider"></div>
			<div className="grid-container">
				<div className="rowCountBox">
					<div className="title">Facilitators Count by Organisation </div>
					<OrganizationList selectedNamesList={selectedNamesList}/>
				</div>
				<div className="rowCountBox">
					<div className="title">Facilitators Count by Location </div>
					<LocationList selectedNamesList={selectedNamesList}/>
				</div>
				<div className="rowCountBox">
					<div className="title">Growth Facilitators Growth Journey</div>
					<GrowthChart selectedNamesList={selectedNamesList} />
				</div>
			</div>
			<div className="horizontal-divider"></div>
			<div className="grid-container">
				<div className="rowCountBox">
					<div className="title">
						No. of Growth Facilitators that attended Community of Practice
					</div>
					<ComChart selectedNamesList={selectedNamesList}/>
				</div>
				<div className="rowCountBox">
					<div className="title">
						How Frequent Growth Facilitators attend Community of Practice
					</div>
					<FreqChart selectedNamesList={selectedNamesList} />
				</div>
				<div className="rowCountBox">
					<div className="title">
						No. of Growth Facilitators that supports {growthName}
					</div>
					<CircleNameChart selectedNamesList={selectedNamesList}/>
				</div>
			</div>
		</div>
	);
};

export default Overview;
