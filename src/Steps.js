import React from 'react';
import {Step} from 'semantic-ui-react';

class Steps extends React.Component
{

    render(){
        let activeIndex = this.props.activeIndex;
        return (
  <Step.Group ordered>
      <Step completed={activeIndex>0} active ={activeIndex === 0}>
        <Step.Content>
          <Step.Title>Start</Step.Title>
          {/* <Step.Description>Choose your shipping options</Step.Description> */}
        </Step.Content>
      </Step>
  
      <Step completed={activeIndex>1} active ={activeIndex === 1}>
        <Step.Content>
          <Step.Title>Open</Step.Title>
          <Step.Description>Open or Close</Step.Description>
        </Step.Content>
      </Step>
  
      <Step completed={activeIndex>2} active ={activeIndex === 2}>
        <Step.Content>
          <Step.Title>Number and Color</Step.Title>
        </Step.Content>
      </Step>
      <Step completed={activeIndex>3} active ={activeIndex === 3}>
        <Step.Content>
          <Step.Title>Boy Or Girl</Step.Title>
        </Step.Content>
      </Step>
      <Step completed={activeIndex>4} active ={activeIndex === 4}>
        <Step.Content>
          <Step.Title>Emotions</Step.Title>
          <Step.Description>Happy or sad</Step.Description>
        </Step.Content>
      </Step>

      <Step completed={activeIndex>5} active ={activeIndex === 5}>
        <Step.Content>
          <Step.Title>Answer</Step.Title>
        </Step.Content>
      </Step>
    </Step.Group>
        );
    }
}
  
  export default Steps