import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  doc, 
  getDoc,
  onSnapshot,
} from "firebase/firestore";

const useCompRef = (userId, taskId) => {
  const [compRef, setCompRef] = useState(null);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  /*useEffect(() => {
    async function fetchCompRef() {
        console.log(" 1 cr. CheckboxComponent rendered with uid:", userId, "and taskId:", taskId);
    if (!userId || !taskId) return;

    const compQuery = doc(db, "users", userId, "tasks", taskId, "completions", today);

    
      const completion = await getDoc(compQuery);
      if (completion.exists()) {
        setCompRef({ id: completion.id, ...completion.data() });
        setLoading(false);
        console.log("2 cr. Completion reference fetched:", { id: completion.id, ...completion.data() }, taskId);
      } else {
        setCompRef({
            completed: false,
          });
          setLoading(false);
        console.log("2 cr. No completion data found for today, setting to default:", compRef);
      }
    }
    fetchCompRef();

  }, [userId, taskId]);*/
  useEffect(() => {
    if (!userId || !taskId || !today) return;
  
    console.log("1 cr. CheckboxComponent rendered with uid:", userId, "and taskId:", taskId);
  
    const compDocRef = doc(db, "users", userId, "tasks", taskId, "completions", today);
  
    const unsubscribe = onSnapshot(compDocRef, (completion) => {
      if (completion.exists()) {
        const data = { id: completion.id, ...completion.data() };
        setCompRef(data);
        setLoading(false);
        console.log("2 cr. Real-time completion data:", data, taskId);
      } else {
        const defaultData = { completed: false };
        setCompRef(defaultData);
        setLoading(false);
        console.log("2 cr. No real-time completion found, setting default:", defaultData);
      }
    });
  
    // Cleanup when component unmounts or userId/taskId changes
    return () => unsubscribe();
  
  }, [userId, taskId, today]);
  /*/Ensure compRef is a single object or null
  if (!compRef) {
    return { compRef: {
            completed: false,
          } };
  }*/
 loading? console.log("2 cr. useCompRef loading...") : console.log("3 cr. useCompRef returning compRef:", compRef);
 return { loading, compRef};;
 
}

export default useCompRef;