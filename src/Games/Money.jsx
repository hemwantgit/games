import React from 'react';
import '../App.css';
import { Button, Grid, Label, Header, Divider, Image, Segment, Modal, Icon, List } from 'semantic-ui-react';

class Money extends React.Component {
  constructor(props) {
    super(props);
    this.pocketMoney = 100;
    this.maxDays = 120;
    this.foodItems =[
      {
        id:'toffee',
      }
    ]
    this.state = {
      inHand: 100.00,
      happiness: 0.00,
      currentDate: 1
    }

  }

  getGameOverview = () => (
    <Grid columns={1}>
      <Grid.Column>
        <Segment raised>
          <Label as='a' color='green' ribbon>
            Overview
          </Label>
          <Header as='h4' block>
            Objective of this game to teach kids about managing money.
            It will also help to understand necessary and un-necessary expenses
          </Header>


          <Label as='a' color='blue' ribbon>
            Rules
          </Label>
          <Header as='h4' block>
            Objective of this game to teach kids about managing money.
            It will also help to understand necessary and un-necessary expenses
          </Header>
        </Segment>
      </Grid.Column>


    </Grid>
  )

  getRules = () => {
    return (
      <div>
        <Segment attached>
          <List ordered>
            <List.Item >Pocket Money 100/- will be added at 1st of every month</List.Item>
            <List.Item >10 percent of in-hand money will be added on 15th of every month</List.Item>
            <List.Item >10 percent of in-hand money will be added to pocket money</List.Item>
            <List.Item >Buy available items, some are necessary marked red</List.Item>
            <List.Item >Each item will add happiness point</List.Item>
            <List.Item >Game will end if you don't have money to buy necessary item.</List.Item>
            <List.Item >Game can go till 4 months</List.Item>
            <List.Item >Point is total money in hand + Happiness point </List.Item>
          </List>
        </Segment>
      </div>
    );
  }

  getOverview = () => {
    return (<div>
      <Modal
        trigger={<Button color='linkedin'>
          <Icon name='file text' />
        Overview
        </Button>}
        header='Overview'
        content='Objective of this game to teach kids about managing money. 
            It will also help to understand necessary and un-necessary expenses'
        actions={[{ key: 'done', content: 'OK', positive: true }]}
      />
      <Modal
        trigger={<Button color='twitter'>
          <Icon name='setting' />
        Rules
        </Button>}
        header='Rules'
        content={this.getRules()}
        actions={[{ key: 'done', content: 'OK', positive: true }]}
      />
    </div>);
  }

  getScore = () => {
    return (
      <div>
        <Button as='div' labelPosition='right' >
          <Button color='red' style={{ width: "140px" }}>
            <Icon name='heart' />
            Happiness
          </Button>
          <Label as='a' basic color='red' pointing='left'  style={{ width: "100px" }}>
            {this.state.happiness}
          </Label>
        </Button>

        <Button as='div' labelPosition='right'>
          <Button basic color='blue'  style={{ width: "140px" }}>
            <Icon name='money rupee' />
            Money
          </Button>
          <Label as='a' basic color='blue' pointing='left'  style={{ width: "100px" }}>
          <Icon name='rupee' />
            {this.state.inHand}
          </Label>
        </Button>

        <Button as='div' labelPosition='right'>
        <Button color='green' style={{ width: "140px" }}>
            <Icon name='calculator' />
            Total Points
          </Button>
         
          <Label as='a' basic  color='green' pointing='left'  style={{ width: "100px" }}>
            {this.state.inHand + this.state.happiness}
          </Label>
        </Button>
      </div>
    );
  }

  nextDate = () => {
    
    let nextDate = this.state.currentDate + 1;
    let newInHand = this.state.inHand;
    if(nextDate === 15){
      debugger
      newInHand = this.calculateBonus();
    } else if(nextDate > 30){
      newInHand = this.calculatePocketMoney();
      nextDate = 1;
    }
    this.setState({ currentDate: nextDate, inHand: newInHand });
  }

  calculatePocketMoney =()=>{
    let num = this.state.inHand + 100 + this.state.inHand * 0.10;
    return  parseFloat((Math.round(num * 100) / 100).toFixed(2));
  }

  calculateBonus =()=>{
    let num = this.state.inHand * 1.10;
    return parseFloat((Math.round(num * 100) / 100).toFixed(2));
  }

  getCalendarDate = () => {
    return (
      <>
        <Label size='big' color='blue' pointing='below'>
          Current Date
      </Label>
        <div >
          <Button basic color='yellow' title="click to go to next date." icon labelPosition='right' 
            style={{width:"140px"}}
            onClick={() => { this.nextDate() }}>
            {this.state.currentDate}
            <Icon name='right arrow' />
          </Button>
        </div>
      </>
    );
  }

  getItemsList = () => {
    return (<div>item</div>);
  }

  render() {
    return (
      <div className="App">

        {this.getOverview()}
        <Divider horizontal>
          <Header as='h4'>
            <Icon name='game' />
        Game Arena
      </Header>
        </Divider>
        {
          <Grid celled columns={3}>
            <Grid.Column width={3}>
              {this.getScore()}
            </Grid.Column>
            <Grid.Column width={3}>
              {this.getCalendarDate()}
            </Grid.Column>
            <Grid.Column width={10}>
              {this.getItemsList()}
            </Grid.Column>
          </Grid>
        }
      </div>
    );
  }
}

export default Money;
