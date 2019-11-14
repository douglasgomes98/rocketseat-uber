import React, {Component, Fragment} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import Search from '../Search';
import Directions from '../Directions';
import markerImage from '../../assets/marker.png';
import Details from '../Details';
import backImage from '../../assets/back.png';

import {
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall,
  Back,
} from './styles';

export default class Map extends Component {
  state = {
    region: null,
    destination: null,
    duration: null,
    location: null,
  };

  componentDidMount = () => {
    Geocoder.init('AIzaSyDnEmU8vDT9DlcWaKygD_JAu_6sT8Tqojk');
    Geolocation.getCurrentPosition(
      async ({coords: {latitude, longitude}}) => {
        const response = await Geocoder.from({latitude, longitude});
        const address = response.results[0].formatted_address;
        const location = address.split(',');

        this.setState({
          region: {
            latitude,
            longitude,
            latitudeDelta: 0.0143,
            longitudeDelta: 0.0134,
          },
          location: location[0],
        });
      },
      () => {},
      {
        timeout: 5000,
        enableHighAccuracy: true,
        maximumAge: 1000,
      },
    );
  };

  handleLocalationSelect = (data, {geometry}) => {
    const {
      location: {lat: latitude, lng: longitude},
    } = geometry;

    const title = data.structured_formatting.main_text.split(' ');

    this.setState({
      destination: {
        latitude,
        longitude,
        title: `${title[0] + ' ' + title[1]}`,
      },
    });
  };

  handleBack = () => {
    this.setState({destination: null});
  };

  render() {
    const {region, destination, duration, location} = this.state;
    return (
      <View style={styles.container}>
        <MapView
          style={styles.container}
          region={region}
          showsUserLocation
          loadingEnabled
          ref={el => (this.mapView = el)}>
          {destination && (
            <Fragment>
              <Directions
                origin={region}
                destination={destination}
                onReady={resulst => {
                  this.setState({duration: Math.floor(resulst.duration)});
                  this.mapView.fitToCoordinates(resulst.coordinates, {
                    edgePadding: {
                      bottom: 850,
                      left: 50,
                      right: 50,
                      top: 16,
                    },
                  });
                }}
              />
              <Marker
                coordinate={destination}
                anchor={{x: 0, y: 0}}
                image={markerImage}>
                <LocationBox>
                  <LocationText>{destination.title}</LocationText>
                </LocationBox>
              </Marker>

              <Marker coordinate={region} anchor={{x: 0, y: 0}}>
                <LocationBox>
                  <LocationTimeBox>
                    <LocationTimeText>{duration}</LocationTimeText>
                    <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                  </LocationTimeBox>
                  <LocationText>{location}</LocationText>
                </LocationBox>
              </Marker>
            </Fragment>
          )}
        </MapView>
        {destination ? (
          <Fragment>
            <Back onPress={this.handleBack}>
              <Image source={backImage} />
            </Back>
            <Details />
          </Fragment>
        ) : (
          <Search onLocationSelected={this.handleLocalationSelect} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
