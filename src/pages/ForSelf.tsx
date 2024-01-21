import React from "react";
import ORSselfChart from "../components/ORSself";
import ORSselfPartChart from "../components/ORSselfPart.tsx";
import { useAppContext } from "../components/AppContext.tsx";
import SatisChart from "../components/SatisfactionSelf.tsx";
import EngagementChart from "../components/Engagement.tsx";
import SkillChart from "../components/SkillChart.tsx";
import BenefitChart from "../components/BenefitChart.tsx";
import ThroughThisChart from "../components/ThroughGC.tsx";
import TopFiveChart from "../components/TopFive.tsx";

function ForSelf() {
	const { selectedNamesList } = useAppContext();

	return (
	<div className="overview-container">
		<div className="grid-container">
			<div className="rowCountBox">
				<div className="title">ORS: Pre and Post for Facil</div>
				<ORSselfChart selectedNamesList={selectedNamesList}/>
			</div>
			<div className="rowCountBox">
				<div className="title">ORS: Pre and Post for Participants</div>
				<ORSselfPartChart selectedNamesList={selectedNamesList}/>
			</div>
			<div className="rowCountBox">
				<div className="title">Top 5 Topics Discussed in Defined Period</div>
				<TopFiveChart selectedNamesList={selectedNamesList}/>
			</div>
			<div className="rowCountBox">
				<div className="title">Step 5 Reflection: Satisfaction of Growth Circle</div>
				<SatisChart selectedNamesList={selectedNamesList}/>
			</div>
			<div className="rowCountBox">
				<div className="title">Engagement During the Session</div>
				<EngagementChart selectedNamesList={selectedNamesList}/>
			</div>
			<div className="rowCountBox">
				<div className="title">Through this GrowthCircle:</div>
				<ThroughThisChart selectedNamesList={selectedNamesList}/>
			</div>
			<div className="rowCountBox">
				<div className="title">Whether Participant Benefitted from the Session</div>
				<BenefitChart selectedNamesList={selectedNamesList}/>
			</div>
			<div className="rowCountBox">
				<div className="title">Whether Learned/ Practiced Skill is Applicable to Daily Life</div>
				<SkillChart selectedNamesList={selectedNamesList}/>
			</div>
			
			
			
		</div>
	</div>
	)
}

export default ForSelf;
