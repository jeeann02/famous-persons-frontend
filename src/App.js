import React, { Component } from 'react';
import axios from 'axios';

/**Semantic UI*/
import { Grid, Segment, Menu, Item, Button, Form } from 'semantic-ui-react'
import { DateInput } from 'semantic-ui-calendar-react';


/**CSS*/
import './App.css';
import './css/style.css';
import 'semantic-ui-css/semantic.css'

const dateFormat = require('dateformat');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /**Array*/
      famousPersons: [],

      /**Boolean*/
      loading: false,
      update: false,

      /**String*/
      id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      age: "",
      occupation: "",
      citizenship: "",
      birthDate: "",
      bio: "",
      createdDatetime: ""
    }
  }

  /**Get functions*/
  getAllFamousPersons() {
    const self = this;
    axios.get('http://localhost:8080/getAllFamousPersons').then(res => {
      console.log(res.data)
      self.setState({ famousPersons: res.data });
    }).catch(err => console.log(err));

  }

  /**Post Function*/
  addFamousPerson = () => {
    const self = this;

    axios.post('http://localhost:8080/addPerson', {
      firstName: self.state.firstName,
      middleName: self.state.middleName === "" ? "null" : self.state.middleName,
      lastName: self.state.lastName,
      fullName: `${self.state.firstName} ${self.state.middleName} ${self.state.lastName}`,
      gender: self.state.gender,
      occupation: self.state.occupation,
      citizenship: self.state.citizenship,
      bio: self.state.bio,
      age: Number(self.state.age),
      birthDate: dateFormat(new Date(self.state.birthDate), "UTC:yyyy-mm-dd'T'HH:MM:ss"),
      createdDatetime: dateFormat(new Date(), "UTC:yyyy-mm-dd'T'HH:MM:ss"),
      modifiedDatetime: dateFormat(new Date(), "UTC:yyyy-mm-dd'T'HH:MM:ss"),
      archived: false
    }).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.log(error);
    });
  }

  editFamousPerson = () => {
    const self = this;

    axios.put('http://localhost:8080/editPerson/' + self.state.id, {
      firstName: self.state.firstName,
      middleName: self.state.middleName === "" ? "null" : self.state.middleName,
      lastName: self.state.lastName,
      fullName: `${self.state.firstName} ${self.state.middleName} ${self.state.lastName}`,
      gender: self.state.gender,
      occupation: self.state.occupation,
      citizenship: self.state.citizenship,
      bio: self.state.bio,
      age: Number(self.state.age),
      birthDate: dateFormat(new Date(self.state.birthDate), "UTC:yyyy-mm-dd'T'HH:MM:ss"),
      createdDatetime: dateFormat(new Date(self.state.createdDatetime), "UTC:yyyy-mm-dd'T'HH:MM:ss"),
      modifiedDatetime: dateFormat(new Date(), "UTC:yyyy-mm-dd'T'HH:MM:ss"),
      archived: false
    }).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.log(error);
    });
  }

  /**Handle Event Function*/
  handleGetPersonDetails = (element) => {
    console.log(element);
    this.setState({
      update: true,
      id: element.id,
      firstName: element.firstName,
      middleName: element.middleName === "null" ? "" : element.middleName,
      lastName: element.lastName,
      gender: element.gender,
      age: element.age,
      occupation: element.occupation,
      citizenship: element.citizenship,
      birthDate: dateFormat(element.birthDate, "mmm dd, yyyy"),
      bio: element.bio,
      createdDatetime: element.createdDatetime
    });
  }

  handleDateChange = (event, { name, value }) => {
    console.log(value)
    this.setState({ birthDate: value });
  }


  UNSAFE_componentWillMount() {
    const self = this;
    self.getAllFamousPersons();
  }

  render() {
    const { famousPersons, firstName, middleName, lastName, gender, age, birthDate, occupation, citizenship, bio } = this.state;
    const data = {
      genderOptions: [{ key: "Female", value: "Female", text: "Female" }, { key: "Male", value: "Male", text: "Male" }]
    }
    return (
      <Grid container className="h-100 pad-vertical-10">
        <Grid.Row columns={2}>
          <Grid.Column width={6}>
            <Menu attached="top">
              <Menu.Item header> Famous Persons</Menu.Item>
            </Menu>
            <Segment attached className="h-95 o-auto">
              <Item.Group divided>
                {
                  famousPersons.map((row, index) =>
                    <Item key={index}>
                      <Item.Content>
                        <Item.Header as="a"><span onClick={() => this.handleGetPersonDetails(row)}>{row.fullName}</span></Item.Header>
                        <Item.Meta>{dateFormat(row.birthDate, "mmm dd, yyyy")}</Item.Meta>
                        <Item.Description className="text-ellipsis">{row.bio}</Item.Description>
                      </Item.Content>
                    </Item>
                  )
                }
              </Item.Group>
            </Segment>
          </Grid.Column>
          <Grid.Column width={10} className="h-100 center-display">
            <Segment attached >
              <Form>
                <Form.Group widths="equal">
                  <Form.Input
                    label="First Name"
                    placeholder="First Name"
                    required
                    value={firstName}
                    onChange={(event, data) => this.setState({ firstName: data.value })}
                  />
                  <Form.Input
                    label="Middle Name"
                    placeholder="Middle Name"
                    value={middleName}
                    onChange={(event, data) => this.setState({ middleName: data.value })}
                  />
                  <Form.Input
                    label="Last Name"
                    placeholder="Last Name"
                    required
                    value={lastName}
                    onChange={(event, data) => this.setState({ lastName: data.value })}
                  />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input
                    label="Age"
                    placeholder="Age"
                    type="Number"
                    required
                    value={age}
                    onChange={(event, data) => this.setState({ age: data.value })}
                  />
                  <Form.Dropdown
                    label="Gender"
                    placeholder="Gender"
                    search selection options={data.genderOptions}
                    required
                    value={gender}
                    onChange={(event, data) => this.setState({ gender: data.value })}
                  />
                  <DateInput
                    name="date"
                    label="Birthdate"
                    placeholder="Birthdate"
                    value={birthDate}
                    closable
                    autoComplete='off'
                    iconPosition="left"
                    onChange={this.handleDateChange}
                    dateFormat='MMM DD, YYYY'
                  />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input
                    label="Citizenship"
                    placeholder="Citizenship"
                    required
                    value={citizenship}
                    onChange={(event, data) => this.setState({ citizenship: data.value })}
                  />
                  <Form.Input
                    label="Occupation"
                    placeholder="Occupation"
                    required
                    value={occupation}
                    onChange={(event, data) => this.setState({ occupation: data.value })}
                  />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.TextArea
                    label="Bio"
                    placeholder="Bio"
                    required
                    value={bio}
                    rows={3}
                    onChange={(event, data) => this.setState({ bio: data.value })}
                  />
                </Form.Group>
              </Form>
            </Segment>
            <Menu attached="bottom">
              <Menu.Menu position="right">
                <Menu.Item>
                  {
                    !this.state.update ?
                      <Button onClick={this.addFamousPerson}>Add</Button>
                      :
                      <Button onClick={this.editFamousPerson}>Save</Button>
                  }
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default App;
