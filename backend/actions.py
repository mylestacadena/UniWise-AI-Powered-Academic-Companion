from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet

class ActionSubmitDisciplinaryProcedure(Action):
    def name(self) -> Text:
        return "action_submit_disciplinary_procedure"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        incident_type = tracker.get_slot("incident_type")
        learning_mode = tracker.get_slot("learning_mode").lower()
        appeal_decision = tracker.get_slot("appeal_decision").lower()

        # Learning mode message
        if "online" in learning_mode or "modular" in learning_mode:
            learning_msg = ("Since this is online/modular, fact-finding and committee meetings "
                            "will be conducted virtually, following health and safety protocols.")
        else:
            learning_msg = "Since this is face-to-face, the standard procedure will apply with in-person meetings."

        # Appeal message
        if "yes" in appeal_decision:
            appeal_msg = ("The decision will be forwarded to the Schools Division Superintendent (SDS) for review.")
        else:
            appeal_msg = "The School Head’s decision is affirmed and will be monitored by the CPC for implementation."

        # Dispatch all messages
        dispatcher.utter_message(text="Let's go through the disciplinary procedure.")
        dispatcher.utter_message(text=f"Incident type noted: {incident_type}.")
        dispatcher.utter_message(text=learning_msg)
        dispatcher.utter_message(text=appeal_msg)
        dispatcher.utter_message(text="That completes the disciplinary procedure flow for your case. ✅")

        # Return slots if needed
        return [
            SlotSet("incident_type", incident_type),
            SlotSet("learning_mode", learning_mode),
            SlotSet("appeal_decision", appeal_decision)
        ]
