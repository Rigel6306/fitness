// import AsyncStorage from "@react-native-async-storage/async-storage";
// import BackgroundGeolocation, {
//   Config,
// } from "react-native-background-geolocation";

// import { db } from "./firebase";
// import { setDoc,doc } from "firebase/firestore";
// // Storage keys constants
// const ENTRY_TIME_KEY = "@geofence_entered_at";

// export const initGeofenceTracking = async (
//   userId: string,
//   geofence: { lat: number; lng: number; radius: number }
// ) => {
//   // 1. Remove existing listeners first to prevent duplicates
//   BackgroundGeolocation.removeListeners();

//   const config: Partial<Config> = {
//     desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
//     distanceFilter: 50,
//     stopOnTerminate: false,
//     startOnBoot: true,
//     debug: false,
//     logLevel: BackgroundGeolocation.LogLevel.Verbose,
//   };

//   // 2. Wait for plugin to be ready before adding geofences
//   const state = await BackgroundGeolocation.ready(config);
  
//   if (!state.enabled) {
//     await BackgroundGeolocation.start();
//   }

//   // 3. Clear old geofences and add the new one
//   await BackgroundGeolocation.removeGeofences();
//   await BackgroundGeolocation.addGeofence({
//     identifier: "gymFence",
//     latitude: geofence.lat,
//     longitude: geofence.lng,
//     radius: geofence.radius,
//     notifyOnEntry: true,
//     notifyOnExit: true,
//   });

//   // 4. Listen for geofence events
//   BackgroundGeolocation.onGeofence(async (event) => {
//     console.log(`[Geofence Event] ${event.action} for ${event.identifier}`);

//     if (event.action === "ENTER") {
//       const now = new Date().toISOString();
//       await AsyncStorage.setItem(ENTRY_TIME_KEY, now);
//       console.log("Entered geofence saved at", now);
//     }

//     if (event.action === "EXIT") {
//       // Fetch entry time from AsyncStorage to survive background kills
//       const storedEntryTime = await AsyncStorage.getItem(ENTRY_TIME_KEY);
      
//       if (!storedEntryTime) {
//         console.warn("Exit detected, but no matching entry time found in storage.");
//         return;
//       }

//       const enteredAt = new Date(storedEntryTime);
//       const exitTime = new Date();
//       const duration = (exitTime.getTime() - enteredAt.getTime()) / 1000; // seconds

//       // Clear the entry time now that we've processed the exit
//       await AsyncStorage.removeItem(ENTRY_TIME_KEY);

//       const dateStr = exitTime.toISOString().split("T")[0];
//       const key = `geofenceTime_${dateStr}`;

//       // Save/Update total duration locally
//       const prev = await AsyncStorage.getItem(key);
//       const prevTotal = prev ? JSON.parse(prev).total : 0;
//       const total = prevTotal + duration;
      
//       await AsyncStorage.setItem(key, JSON.stringify({ date: dateStr, total }));
//       console.log(`Geofence time updated: ${total} seconds`);

//       // Sync daily total to Firestore
//       try {
//         const dayDocRef = doc(db, "users", userId, "geofenceData", dateStr);
//         await setDoc(dayDocRef, { date: dateStr, totalSeconds: total }, { merge: true });
//         console.log("Successfully synced to Firestore.");
//       } catch (error) {
//         console.error("Firestore sync failed:", error);
//         // NOTE: In production, you'd want a retry mechanism for offline failures here
//       }
//     }
//   });
// };