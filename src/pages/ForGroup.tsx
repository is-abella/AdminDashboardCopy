import React from "react";
import FeedbackComponent from "../components/FeedbackComponent.tsx";
import SupportChart from "../components/SupportChart.tsx";
import EffortsCareChart from "../components/EffortsCareChart.tsx";
import "./Overview.css";

import { useAppContext } from "../components/AppContext.tsx";

const ForGroup: React.FC = () => {
    const { selectedNamesList } = useAppContext();
	return (
    <div className="overview-containe">
        <div className="grid-container">
				<div className="rowCountBox">
					<div className="title">Whether Group Members Are Supportive of One Another</div>
					<SupportChart selectedNamesList={selectedNamesList}/>
				</div>
				<div className="rowCountBox">
					<div className="title">Efforts, Care & Support and Role </div>
					<EffortsCareChart selectedNamesList={selectedNamesList}/>
				</div>
		</div>
        <div className="rowCountBox"> 
				<div className="title" style= {{paddingBottom: "1em"}}>Qualitative Feedback </div>
					<FeedbackComponent selectedNamesList={selectedNamesList}/>
			</div>
    </div>
    )
}

export default ForGroup;
