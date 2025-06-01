import { db } from "./firebase";
import { collection, doc, addDoc, setDoc, getDoc, updateDoc, deleteDoc, getDocs, query, where, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

class Services {
  /** CREATE: Add a new task under a specific user (Auto-generated ID) */
  async addTask(userId, taskName, category) {
    try {
      const tasksCollection = collection(db, "users", userId, "tasks");
      const docRef = await addDoc(tasksCollection, {
        name: taskName,
        category: category,
        streak: 0,
        lastCompleted: null,
      });
      console.log("Task added with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  /** CREATE: Add a task with a custom ID */
  async addTaskWithCustomId(userId, taskId, taskName) {
    try {
      const taskRef = doc(db, "users", userId, "tasks", taskId);
      await setDoc(taskRef, {
        name: taskName,
        category: category,
        streak: 0,
        lastCompleted: null,
      });
      console.log("Task added with custom ID:", taskId);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  /** READ: Get a single task by ID */
  async getTask(userId, taskId) {
    try {
      const taskRef = doc(db, "users", userId, "tasks", taskId);
      const taskSnap = await getDoc(taskRef);
      if (taskSnap.exists()) {
        return { id: taskSnap.id, ...taskSnap.data() };
      } else {
        console.log("No such task!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  }

  /** READ: Get all tasks for a user */
  async getAllTasks(userId) {
    try {
      const tasksCollection = collection(db, "users", userId, "tasks");
      const querySnapshot = await getDocs(tasksCollection);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }
  
  /** READ: Get all start tasks for a user */
  async getStartTasks(userId) {
    try {
      const tasksCollection = query(collection(db, "users", userId, "tasks"), where("category", "==", "start"), orderBy("streak", "desc"));
      const querySnapshot = await getDocs(tasksCollection);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }
  
  /** READ: Get all end tasks for a user */
  getEndTasks(userId, callback) {
    try {
      const tasksQuery = query(
        collection(db, "users", userId, "tasks"),
        where("category", "==", "Finish"),
        orderBy("streak", "desc")
      );
  
      const unsubscribe = onSnapshot(tasksQuery, (querySnapshot) => {
        const tasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(tasks); // Pass the tasks to the callback
      });
  
      return unsubscribe; // Return unsubscribe function to allow cleanup
    } catch (error) {
      console.error("Error fetching tasks in real-time:", error);
    }
  }
  

  /** UPDATE: Mark a task as completed for today */
  async completeTask(userId, taskId) {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    const completionRef = doc(db, "users", userId, "tasks", taskId, "completions", today);

    try {
      // Check if task was already completed today
      const completionSnap = await getDoc(completionRef);
      if (completionSnap.exists()) {
        console.log("Task already completed today.");
        return;
      }

      // Mark today's task as completed
      await setDoc(completionRef, {
        completed: true,
        timestamp: serverTimestamp(),
      });

      // Update task streak
      const taskSnap = await getDoc(taskRef);
      if (taskSnap.exists()) {
        const task = taskSnap.data();
        const lastCompleted = task.lastCompleted?.toDate() || null;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const isConsecutive = lastCompleted && lastCompleted.getTime() === yesterday.getTime();

        await updateDoc(taskRef, {
          streak: isConsecutive ? task.streak + 1 : 1,
          lastCompleted: serverTimestamp(),
        });

        console.log("Task completed and streak updated!");
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
  }

  /** READ: Get task completion history */
  async getCompletionHistory(userId, taskId) {
    const completionsRef = collection(db, "users", userId, "tasks", taskId, "completions");
    try {
      const querySnapshot = await getDocs(completionsRef);
      return querySnapshot.docs.map((doc) => ({
        date: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching completion history:", error);
    }
  }

  /** UPDATE: Reset task streak */
  async resetStreak(userId, taskId) {
    try {
      const taskRef = doc(db, "users", userId, "tasks", taskId);
      await updateDoc(taskRef, {
        streak: 0,
        lastCompleted: null,
      });
      console.log("Streak reset for task:", taskId);
    } catch (error) {
      console.error("Error resetting streak:", error);
    }
  }

  /** DELETE: Remove a task and its completion history */
  async deleteTask(userId, taskId) {
    try {
      const taskRef = doc(db, "users", userId, "tasks", taskId);
      await deleteDoc(taskRef);
      console.log("Task deleted:", taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
}

export default new Services();
