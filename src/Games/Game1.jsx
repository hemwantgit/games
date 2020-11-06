import React from 'react';
import '../App.css';
import {Button, Header, Divider, Image,Segment, Grid, Icon} from 'semantic-ui-react';
import Steps from '../Steps';

class Game1 extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      activeIndex: 1,
      number:-1,
      color:'',
      gender:'',
      emo:''
    }

    this.happyAnswers = ['', 'Naughty', 'Bad', 'Cute', 'Helpful', 'Good', 'Nice', 'Very Good', 'Obedient', 'Simple', 'Funny']
    this.sadAnswers = ['', 'SelfFish', 'Intelligent', 'Colorful', 'Trustworthy', 'Feeble', 'Old', 'Mischievous', 'Entertainment', 'Creative', 'Witty']
    this.increment = this.increment.bind(this);
    this.exit = this.exit.bind(this);
    this.getNumber = this.getNumber.bind(this);
    this.setColor = this.setColor.bind(this);
    this.setGender = this.setGender.bind(this);
    this.setEmo = this.setEmo.bind(this);
    this.restart = this.restart.bind(this);
  }

  calculateAnswer() {
    let nature = this.state.emo === 'Happy' ? this.happyAnswers[this.state.number] : this.sadAnswers[this.state.number];
    return 'You are a ' + nature + ' ' + this.state.gender;
  }

  resultImage(){
    let nature = this.state.emo === 'Happy' ? this.happyAnswers[this.state.number] : this.sadAnswers[this.state.number];
    return './images/'+nature.toLowerCase()+"_"+this.state.gender.toLowerCase()+".jpeg";
  }

  increment(){
    let activeIndex = this.state.activeIndex;
    this.setState({activeIndex:activeIndex+1});
  }

  exit(){
    this.setState({activeIndex:0});
  }

  restart(){
    this.setState({activeIndex:1, number:-1, color:'', gender:'', emo:''});
  }

  getNumber(e){
    let n = parseInt(e.target.innerText);
    this.setState({number:n});
    if(this.state.color){
      this.increment();
    }
  }

  setColor(e){
    this.setState({color:e.target.innerText});
    if(this.state.number >=0){
      this.increment();
    }
  }

  setGender(gender) {
    this.setState({'gender': gender});
    this.increment();
  }

  setEmo(emo) {
    this.setState({'emo': emo});
    this.increment();
  }

  bye() {
    return (
      <div>
        <Header>
          <Header.Content> Bye Bye.</Header.Content>
        </Header>
        <Image src='./images/bye.jpeg' size='medium' circular/>
        <Button primary icon onClick={() => this.restart()} size="massive">
          <Icon name='play' />
          Play
                </Button>
      </div>
    );
  }
  
  numbers() {
    const items = []
    for (let index = 0; index < 11; index++) {
      items.push(<Button key={index + ''} onClick={(e) => this.getNumber(e)} size="big">{index}</Button>);
    }
    return (
      <Button.Group>{items}</Button.Group>
    );
  }

  colors() {
    let colors = ['red', 'pink', 'yellow', 'blue', 'green', 'violet', 'purple', 'black']
    const items = []
    colors.forEach((color)=>{
      items.push(<Button color={color} onClick={(e) => this.setColor(e)}  size="big">{color.toUpperCase()}</Button>);
    });
    
    return (
      <Button.Group>{items}</Button.Group>
    );
  }


  renderStep(){
    switch(this.state.activeIndex){
      case 1:
        return (
          <div>
          <p> Do you want to play this game?</p>
          <div>
            <Button positive onClick={this.increment} size="massive">Yes</Button>
            <Button negative onClick={this.exit}  size="massive">No</Button>
          </div>
          </div>
        );
        case 2:
        return (
          <div>
            <Header>
              <Header.Content> Open Or Close</Header.Content>
            </Header>
            <div>
              <Button positive onClick={this.increment}  size="massive">Open</Button>
              <Button negative onClick={this.exit}  size="massive">Close</Button>
            </div>
          </div>
        );
        case 3:
        return (
          <div>
            <Header>
              <Header.Content> Number</Header.Content>
            </Header>
            {this.numbers()}
            <Divider horizontal> Favorite Colors</Divider>
            {this.colors()}
          </div>
        );

        case 4:
        return (
          <div>
            <Header>
              <Header.Content> Boy Or Girl</Header.Content>
            </Header>
            <Segment placeholder>
              <Grid columns={2} relaxed='very' stackable>
                <Grid.Column>
                  <Image src='./images/boy.jpeg' size='medium' circular onClick={()=>this.setGender('Boy')} />
                </Grid.Column>

                <Grid.Column verticalAlign='middle'>
                  <Image src='./images/girl.jpeg' size='medium' circular onClick={()=>this.setGender('Girl')}/>
                </Grid.Column>
              </Grid>

              <Divider vertical>Or</Divider>
            </Segment>

          </div>
        );
        case 5:
        return (
          <div>
            <Header>
              <Header.Content> Emotions</Header.Content>
            </Header>
            <div>
            <Button.Group>
                <Button positive icon onClick={()=>this.setEmo('Happy')} size="massive">
                  <Icon name='smile' />
                  Happy
                </Button>
                <Button.Or text='Or' />
                <Button negative icon onClick={()=>this.setEmo('Sad')} size="massive">
                  <Icon name='frown' />
                  Sad
                </Button>
              </Button.Group>
            </div>
          </div>
        );
        case 6:
          let image = this.resultImage();
        return (
          <div>
          <Image src={image} size='medium' circular />
            <Header>
              <Header.Content>{this.calculateAnswer()}</Header.Content>
            </Header>
            <Button primary icon onClick={()=>this.restart()} size="massive">
                  <Icon name='play' />
                  Play Again
            </Button>
            
          </div>
        );
        default:{
          return this.bye();
        }
    }
  }

  render(){
    return(
      <div className="App">
     
      <Steps style={{'position':'absolute', 'top':'20px'}}  activeIndex = {this.state.activeIndex-1}></Steps>

      {this.renderStep()}
    </div>
    );
  }
}

export default Game1;
