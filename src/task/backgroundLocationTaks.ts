import * as TaskManager from 'expo-task-manager'
import {
    hasStartedLocationUpdatesAsync,
    LocationAccuracy,
    startLocationUpdatesAsync,
    stopLocationUpdatesAsync
} from "expo-location";
import {saveStorageLocation} from "../libs/asyncStorage/locationStorage";

export const BACKGROND_TASK_NAME = 'location-tracking';

TaskManager.defineTask(BACKGROND_TASK_NAME, async ({data, error}: any) => {
    try {
        if (error) throw error
        if (data) {
            const {coords, timestamp} = data.locations[0]
            const currentLocation = {
                latitude: coords.latitude,
                longitude: coords.longitude,
                timestamp: timestamp
            }
            await saveStorageLocation(currentLocation)
        }
    } catch (error) {
        console.log(error)
        await stopLocationTask()
    }
})

export async function startLocationTask() {
    try {
        const hasStarted = await hasStartedLocationUpdatesAsync(BACKGROND_TASK_NAME)
        if (hasStarted)
            await stopLocationTask()

        await startLocationUpdatesAsync(BACKGROND_TASK_NAME, {
            accuracy: LocationAccuracy.Highest,
            distanceInterval: 1,
            timeInterval: 1000
        })
    } catch (error) {
        console.log(error)
    }
}

export async function stopLocationTask() {
    try {
        const hasStarted = await hasStartedLocationUpdatesAsync(BACKGROND_TASK_NAME)
        if (hasStarted)
            await stopLocationUpdatesAsync(BACKGROND_TASK_NAME)
    } catch (error) {
        console.log(error)
    }
}
