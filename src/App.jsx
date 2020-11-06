import React from 'react';
import { Menu, Input, Dropdown} from 'semantic-ui-react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './App.css';
import Game1 from './Games/Game1';
import Money from './Games/Money';

const routeMapping = {
  "/home": {
    name: "home",
    displayName: "home",
  },
  "/game1": {
    name: "game1",
    displayName: "Funny Game 1",
  },
  "/money": {
    name: "money",
    displayName: "Money Game",
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
        <Dropdown.Header>Young</Dropdown.Header>
        <Dropdown.Item>Game3</Dropdown.Item>
        <Dropdown.Item>Game3 4</Dropdown.Item>
      </Dropdown.Menu>
      </Dropdown>
              <Menu.Item position='right'>
                <Input icon='search' placeholder='Search...' />
              </Menu.Item>
            </Menu.Menu>
          </Menu>

          <div style={{ paddingTop: '12px' }}>

            <Route path="/home" exact component={home} />
            {/* <Route path="/messages/:id" exact render={(props) => <CustomDashboard isDataProcessEnabled={true} {...props} />} /> */}
            <Route path="/game1" component={Game1} />
            <Route path="/money" component={Money} />
          </div>
        </div>
      </Router>
    )
  }


}

const home = () => {
  return <div> 'Home page'</div>
}


export default App;
