import React from "react";
import axios from "axios";

import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

import moment from "moment";
import "./time.css";
import "./Events.css";
import InputMoment from "input-moment";
import Events from "./CreatedEvent";

export default class Event extends React.Component {
  constructor() {
    super();

    this.state = {
      Name: "",
      m: moment(),
      imgScr: '',
      sportIDs: "",
      sportName: "",
      Address: "",
      start: false,
      end: false,
      DateInfo: null,
      startTime: null,
      endTime: null,
      Description: "",
      sport: null,
      lat: null,
      long: null,
      submit: false,
      event_id: null,
      players: "",
      sports: []
    };
  }

  handleChange = e => {
    const { Address } = this.state;
    this.setState({
      [e.target.name]: e.target.value
    });
    if (e.target.name === "Description" && Address) {
      // axios
      //   .get(
      //     `https://maps.googleapis.com/maps/api/geocode/json?address=${Address}&key=AIzaSyAulk5PFU6VTLLaBMnENrJGrKNlGjKnzhE`
      //   )
      //   .then(res => {
      //     console.log("EventForm:", res);
      //     console.log(
      //       "Lat:",
      //       res.data.results[0].geometry.location.lat,
      //       "Lng:",
      //       res.data.results[0].geometry.location.lng
      //     );
      //     this.setState({
      //       lat: res.data.results[0].geometry.location.lat,
      //       long: res.data.results[0].geometry.location.lng
      //     });
      //   })
      //   .catch(err => console.log(err));

    }
  };

  handleMoment = m => {
    this.setState({ m });
  };

  handleSelect = e => {
    this.setState({
      sport_id: e.target.id,
      sportName: e.target.value
    });
  };

  handleStartTime = () => {
    this.setState({
      startTime: this.state.m.format("llll"),
      start: false
    });
  };

  handleEndTime = () => {
    this.setState({
      endTime: this.state.m.format("llll"),
      end: false
    });
  };

  handleStart = e => {
    e.preventDefault();
    this.setState({
      start: !this.state.start
    });
  };

  handleEnd = () => {
    this.setState({
      end: !this.state.end
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      Name,
      Address,
      DateInfo,
      startTime,
      imgScr,
      endTime,
      Description,
      sport_id,
      sportName,
      lat,
      long
    } = this.state;

    geocodeByAddress(Address)
      .then(results => getLatLng(results[0]))
      .then(res => {
        axios
        .post("/event/add", {
          name: Name,
          lat: res.lat,
          long: res.lng,
          location: Address,
          start_ts: new Date(startTime).getTime(),
          end_ts: new Date(endTime).getTime(),
          description: Description,
          sport_id: sport_id,
          sport_name: sportName,
          event_pic: imgScr
        })
        .then(res => {
          this.setState({
            submit: true,
            players: res.data.event.players_usernames,
            event_id: res.data.event.id
          });
        })
        .catch(err => console.log("Error Adding Event:", err));
      })
      .catch(error => console.error('Error', error))
  
  };

 onChange = (Address) => {this.setState({ Address })}

  componentWillMount() {
    axios.get("/user/sports").then(res => {
      console.log(res.data);
      const names = res.data.sports.map(sport => sport.name);
      const id = res.data.sports.map(sport => sport.id);
      this.setState({
        sports: names,
        sportIDs: id
      });
    });
  }

  form = () => {
    const {
      Name,
      Address,
      imgScr,
      DateInfo,
      startTime,
      endTime,
      Description,
      sports,
      start,
      end
    } = this.state;

    const inputProps = {
      value: Address,
      onChange: this.onChange,
    }

    return (
      <div id="event-form">
        <h1 id="event-title">Create An Event</h1>

        <form onSubmit={this.handleSubmit}>
          {
            <input
              required 
              type="text"
              name="imgScr"
              value={imgScr}
              onChange={this.handleChange}
            />
          }

          <input
            required 
            type="text"
            name="Name"
            value={Name}
            placeholder="Event name"
            onInput={this.handleChange}
          />
          <div id='autocomplete-form'>
            <PlacesAutocomplete 
            required 
            type="text"
            name="Address"
            placeholder="Address"
            inputProps={inputProps} 
           />
          </div>

          {/* <input
            required 
            type="text"
            name="Address"
            value={Address}
            placeholder="Address"
            onInput={this.handleChange}
          /> */}

          <button onClick={this.handleStart}>Start Time</button>
          <div className="input">
            <input type="text" value={this.state.startTime} readOnly />
          </div>
          {start ? (
            <InputMoment
              name="startTime"
              moment={this.state.m}
              onChange={this.handleMoment}
              minStep={5}
              onSave={this.handleStartTime}
            />
          ) : (
            ""
          )}

          <button onClick={this.handleEnd}>End Time</button>

          <div className="input">
            <input type="text" value={this.state.endTime} readOnly />
          </div>

          {end ? (
            <InputMoment
              name="endTime"
              moment={this.state.m}
              onChange={this.handleMoment}
              minStep={5}
              onSave={this.handleEndTime}
            />
          ) : (
            ""
          )}

          <select required onChange={this.handleSelect}>
            {["", ...sports].map((sport, idx) => (
              <option
                key={idx}
                id={sport ? this.state.sportIDs[idx - 1] : ""}
                value={sport ? sport : ""}
              >
                {sport}
              </option>
            ))}
          </select>

          <input
            required 
            type="textarea"
            name="Description"
            value={Description}
            placeholder="Description"
            onInput={this.handleChange}
          />

          <input type="submit" value="Create event" />
        </form>
      </div>
    );
  };
  render() {
    const { submit, sports } = this.state;

    const {
      Name,
      Address,
      imgScr,
      DateInfo,
      startTime,
      endTime,
      Description,
      sport_id,
      sportIDs,
      players,
      event_id
    } = this.state;

    const sport = sports[sportIDs.indexOf(Number(sport_id))];

    const event = {
      sport: sport,
      Name: Name,
      date: DateInfo,
      img: imgScr,
      Address: Address,
      date: DateInfo,
      start: startTime,
      end: endTime,
      description: Description,
      players: players,
      event_id: event_id
    };

    return <div>{submit ? <Events event={event} /> : this.form()}</div>;
  }
}
