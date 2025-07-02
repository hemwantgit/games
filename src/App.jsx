import React from 'react';
import { Menu, Input, Dropdown } from 'semantic-ui-react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import './App.css';
import Home from './Games/home';
import Game1 from './Games/Game1';
import Money from './Games/Money';
import WOF from './Games/WOF';
import WordGame from './Games/WordGame';

const routeMapping = {
  "/home": {
    name: "home",
    displayName: "Home",
  },
   "/wordGame": {
    name: "wordgame",
    displayName: "Word Memorizer",
  },
  "/game1": {
    name: "game1",
    displayName: "Funny Game 1",
  },
  "/money": {
    name: "money",
    displayName: "Money Game",
  },
  "/wof": {
    name: "wof",
    displayName: "Wheel Of Fortune",
  },
}

class App extends React.Component {
  constructor(props) {
    super(props);

    let path = window.location.pathname;
    let activeItem = path;//routeMapping.hasOwnProperty(path) && routeMapping[path].name;
    this.state = {
      activeItem
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  changeTheme = (theme)=>{
    console.log("change theme called");
    document.body.classList.toggle("dark-theme");
  }

  render() {
    const { activeItem } = this.state;
    return (
      <Router>

        <div style={{ padding: "30px", font: "20px" }}>
          <Menu pointing color={'blue'}>
            <Menu.Menu >
              {
                Object.keys(routeMapping).map((key) => (
                  <Menu.Item name={routeMapping[key].name} as={Link} key={key} to={key} onClick={this.handleItemClick} active={activeItem === routeMapping[key].name}>
                    {routeMapping[key].displayName}

                  </Menu.Item>))
              }
              <Dropdown text='More' pointing className='link item'>
                <Dropdown.Menu>
                  <Dropdown.Header>Simple</Dropdown.Header>
                  {/* <Dropdown.Item>
          <Dropdown text='Kids'>
            <Dropdown.Menu>
              <Dropdown.Header>Mens</Dropdown.Header>
              <Dropdown.Item>Shirts</Dropdown.Item>
              <Dropdown.Item>Pants</Dropdown.Item>
              <Dropdown.Item>Jeans</Dropdown.Item>
              <Dropdown.Item>Shoes</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Header>Womens</Dropdown.Header>
              <Dropdown.Item>Dresses</Dropdown.Item>
              <Dropdown.Item>Shoes</Dropdown.Item>
              <Dropdown.Item>Bags</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Dropdown.Item> */}
                  <Dropdown.Item>Game 1</Dropdown.Item>
                  <Dropdown.Item>Game 2</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Header>Theme</Dropdown.Header>
                  <Dropdown.Item onClick={()=>this.changeTheme('light')}>Light</Dropdown.Item>
                  <Dropdown.Item onClick={()=>this.changeTheme('dark')}>Dark</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Menu.Item position='right'>
                <Input icon='search' placeholder='Search...' />
              </Menu.Item>
            </Menu.Menu>
          </Menu>

          <div style={{ paddingTop: '12px' }}>
            <Routes>
              <Route path="/" exact element={<Home/>} />
              <Route path="/home" exact element={<Home/>} />
              <Route path="/wordgame" element={<WordGame/>} />
              {/* <Route path="/messages/:id" exact render={(props) => <CustomDashboard isDataProcessEnabled={true} {...props} />} /> */}
              <Route path="/game1" element={<Game1/>} />
              <Route path="/money" element={<Money/>} />
              <Route path="/wof" Component={WOF} />
            </Routes>
          </div>
        </div>
      </Router>
    )
  }


}


export default App;
