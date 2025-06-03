import {
  collection,
  doc,
  onSnapshot,
  query
} from "firebase/firestore";
import { db } from "../firebase"; // adjust path to your firebase config
import { useState, useEffect } from "react";


export default function useTasksWithCompletions(userId) {
  const [allTasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [allTasksLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const tasksRef = collection(db, "users", userId, "tasks");
    const q = query(tasksRef);

    const unsubscribeTasks = onSnapshot(q, (snapshot) => {
      const taskDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Track listeners for completions
      const unsubCompletions = [];

      taskDocs.forEach(task => {
        const today = new Date().toISOString().split("T")[0];
        const completionRef = doc(db, "users", userId, "tasks", task.id, "completions", today);

        const unsub = onSnapshot(completionRef, (compSnap) => {
          const completionData = compSnap.exists() ? compSnap.data() : { completed: false };

          setTasks(prev => {
            const others = prev.filter(t => t.id !== task.id);
            return [...others, { ...task, completion: completionData }];
          });
          setLoading(false)
        });

        unsubCompletions.push(unsub);
      });

      // filter out the completed tasks
      setCompletedTasks(allTasks.filter(task => task.completion && task.completion.completed));

      // Cleanup completions when tasks change
      return () => unsubCompletions.forEach(unsub => unsub());
    });


    // Cleanup listeners on unmount
    return () => unsubscribeTasks();
  }, [userId]);

  return {allTasks, completedTasks};
}
