import "./App.css";
import {
  CardContent,
  MenuItem,
  FormControl,
  Select,
  Card,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  });

  // USE-EFFECT : Runs a peice of code...
  // based on a given condition..

  useEffect(() => {
    // the code inside will run once ..
    // when the ocmponent load sand not again
    // async -> send a request, wait for it , do something with it

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // UNITED STATE, UNITED KINGDOM
            value: country.countryInfo.iso2, // UK,USA,FR
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData(countries);
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);

        // All of the data data...
        // from the country response
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.lng]);
      });

    //
    //
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER </h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide  ">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title="CoronaVirus cases"
            cases={countryInfo.todayCases}
            total={countryInfo.Cases}
          />
          <InfoBox
            title="Recovered "
            cases={countryInfo.todayRecovered}
            total={countryInfo.totalRecovered}
          />
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.totalDeaths}
          />
        </div>
        <Map center={mapCenter} zoom={mapZoom} countries={mapCountries} />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new Cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
