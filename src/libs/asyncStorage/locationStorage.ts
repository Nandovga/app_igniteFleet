import AsyncStorage from "@react-native-async-storage/async-storage";
const STORAGE_KEY = "@ignitefleet:location";

type LocationProps = {
    latitude: number
    longitude: number
    timestamp: number
}

export async function getStorageLocation() {
    const storage = await AsyncStorage.getItem(STORAGE_KEY);
    return storage ? JSON.parse(storage) : [];
}

export async function saveStorageLocation(newLocation: LocationProps) {
    const storage = await getStorageLocation();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storage.push(newLocation)))
}

export async function removeStorageLocation() {
    await AsyncStorage.removeItem(STORAGE_KEY)
}
