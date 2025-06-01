import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

const useTasks = (userId) => {
  const [startTasks, setStartTasks] = useState([]);
  const [endTasks, setEndTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const startQuery = query(
      collection(db, "users", userId, "tasks"),
      where("category", "==", "start"),
      orderBy("streak", "desc")
    );

    const endQuery = query(
      collection(db, "users", userId, "tasks"),
      where("category", "==", "Finish"),
      orderBy("streak", "desc")
    );

    const unsubscribeStart = onSnapshot(startQuery, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setStartTasks(tasks);
      setLoading(false);
    });

    const unsubscribeEnd = onSnapshot(endQuery, (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEndTasks(tasks);
      setLoading(false);
    });

    return () => {
      unsubscribeStart();
      unsubscribeEnd();
    };
  }, [userId]);

  return { startTasks, endTasks, loading };
};

export default useTasks;
