import React from "react";
import FacilitatorFeedback from "../components/FacilitatorFeedback.tsx";
import FacilitatorAbility from "../components/FacilitatorAbility.tsx";

import { useAppContext } from "../components/AppContext.tsx";

const ForFacil: React.FC = () => {
	const {selectedNamesList } = useAppContext();
	return (
		<div className="overview-containe">
			<div className="rowCountBox"> 
				<div className="title">Facilitator was able to: </div>
					<FacilitatorAbility selectedNamesList={selectedNamesList} />
			</div>
			<div className="rowCountBox"> 
				<div className="title" style= {{paddingBottom: "1em"}}>Qualitative Feedback </div>
					<FacilitatorFeedback selectedNamesList={selectedNamesList} />
			</div>
		</div>
	)
}

export default ForFacil;
