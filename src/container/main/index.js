import React, { useState } from 'react';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

import Alert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';

import GoogleMap from 'components/map';
import HistorySection from 'components/history-section';

import { putSearchedHistories } from 'middleware/actions/response';

import './style.scss';

const DEFAULT_LATITUDE = 49.2827291;
const DEFAULT_LONGITUDE = -123.1207375;

const MainContainer = () => {
  const dispatch = useDispatch();

  const { searchedResponses } = useSelector(state => ({ searchedResponses: state.ResponseReducer.searchedResponses }), shallowEqual);

  const [selectedAddress, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [location, setLocation] = useState({ lat: DEFAULT_LATITUDE, lng: DEFAULT_LONGITUDE });

  const handleChange = address => setAddress(address);

  const handleSelect = address => {
    setAddress(address);
    dispatch(putSearchedHistories(searchedResponses.concat(address)));
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => setLocation(latLng))
      .catch(error => {
        console.error(error);
        setErrorMessage('Invalid response :(');
      });
  };

  const handleTextClear = () => {
    setAddress('');
    setLocation({ lat: DEFAULT_LATITUDE, lng: DEFAULT_LONGITUDE });
  };

  const handleHistoryClear = () => dispatch(putSearchedHistories([]));

  console.log({ searchedResponses });

  return (
    <div className="main-container">
      <div className="container--section">
        {errorMessage && (
          <div className="mh4 mt4">
            <Alert severity="error">{errorMessage}</Alert>
          </div>
        )}

        <GoogleMap
          location={location}
          address={selectedAddress}
          errorMessage={errorMessage}
          onChange={handleChange}
          onSelect={handleSelect}
          onTextClear={handleTextClear}
        />

        <div className="section--bottom">
          <Divider />
          <HistorySection histories={searchedResponses} onHistoryClear={handleHistoryClear} />
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
