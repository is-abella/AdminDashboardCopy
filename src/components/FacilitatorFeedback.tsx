import React, { useEffect, useState } from "react";
import fetchDataFromFirebase from "./fireData.ts";
import { Person } from "./types";
import FeedbackTable from "./FeedbackTable.tsx";

const FacilitatorFeedback: React.FC<{ selectedNamesList: string[] }> = ({ selectedNamesList }) => {
  const [feedback, setFeedback] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: Person[] | null = await fetchDataFromFirebase();

        if (data !== null) {
          const facilitatorData = data.filter(
            (person) =>
              person["Session Role"] === "Facilitator" &&
              selectedNamesList.includes(person.Name)
          );

          const feedbackData = facilitatorData
            .map(
              (person) =>
                person[
                  "For Facil - Kindly share with us why you gave the above ratings"
                ] || ""
            )
            .filter((entry) => entry.trim() !== "NA"); // Filter out "NA" responses

          setFeedback(feedbackData);
        } else {
          setFeedback([]);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching data:", error.message);
        } else {
          console.error("Unexpected error:", error);
        }
      }
    };

    fetchData();
  }, [selectedNamesList]);

  return (
    <div className="feedback-container">
      <FeedbackTable feedbackData={feedback} />
    </div>
  );
};

export default FacilitatorFeedback;
