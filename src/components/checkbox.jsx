import { useState } from "react";
import fire_services from "../fire_services";
import useCompRef from "../hooks/useCompRef";

function CheckboxComponent({uid, task}) {
  const [isChecked, setIsChecked] = useState(false);
  const taskId = task? task.id : null;
  if (!uid || !taskId) return null; // Ensure uid and taskId are valid before proceeding
  console.log(" 1. CheckboxComponent rendered with uid:", uid, "and taskId:", taskId);
  // Use the custom hook to get the completion reference
  // and ensure it is a single object or null
  // This will be used to determine the checkbox state
  // and to toggle the completion status
  // If compRef is null, it means no completion data is available
  // for the given uid and taskId, so we can set isChecked to false
  // If compRef is not null, we can use its completed property
  // to set the checkbox state
  const {loading, compRef} = useCompRef(uid, taskId);
  console.log("2 ",compRef)
  const toggleCheck = (checked) => {
    if(checked){
        setIsChecked(false);
    }
    else{
        setIsChecked(true);
    }
  }

  const toggleCompletion = async (uid, taskId)=>{
  if (!uid || !taskId) return;
  compRef? setIsChecked(compRef.completed) : setIsChecked(false);
    await fire_services.completeTask(uid, taskId)
  }

  return (
    <div>
      <input
        type="checkbox"
        checked={compRef? compRef.completed : isChecked}
        onChange={() => setIsChecked(!isChecked)}
        onClick={() =>  toggleCompletion(uid, taskId)}
      />
    </div>
  );
}

export default CheckboxComponent;
