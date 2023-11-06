import {useRef} from "react";
import {IconBox} from "../IconBox";
import {useTheme} from "styled-components";
import {Car, FlagCheckered} from "phosphor-react-native";
import MapView, {
    MapViewProps,
    PROVIDER_GOOGLE,
    LatLng,
    Marker,
    Polyline
} from "react-native-maps";

type Props = MapViewProps & {
    coordinates: LatLng[]
}

/**
 * Exibe o map na aplicação
 * @param coordinates
 * @param rest
 * @constructor
 */
export function Map({coordinates, ...rest}: Props) {
    const lastCoordinates = coordinates[coordinates.length - 1];
    const mapRef = useRef<MapView>(null)
    const {COLORS} = useTheme()

    async function onMapLoaded() {
        if (coordinates.length > 1) {
            mapRef.current?.fitToSuppliedMarkers(['departure', 'arrival'], {
                edgePadding: {top: 50, right: 50, bottom: 50, left: 50}
            })
        }
    }

    return (
        <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{width: '100%', height: 200}}
            region={{
                latitude: lastCoordinates.latitude,
                longitude: lastCoordinates.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
            }}
            onMapLoaded={onMapLoaded}
            {...rest}>
            <Marker identifier="departure" coordinate={coordinates[0]}>
                <IconBox size="SMALL" icon={Car}/>
            </Marker>
            {
                coordinates.length > 1
                && <>
                    <Marker identifier="arrival" coordinate={lastCoordinates}>
                        <IconBox size="SMALL" icon={FlagCheckered}/>
                    </Marker>
                    <Polyline coordinates={[...coordinates]}
                              strokeColor={COLORS.GRAY_700}
                              strokeWidth={7}/>
                </>
            }
        </MapView>
    )
}
