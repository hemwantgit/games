import React,{ useState } from 'react';
import '../App.css';
import { Wheel } from 'react-custom-roulette';
import { Button, Icon,Header, Modal } from 'semantic-ui-react';
import RouletteWheel from '../static/RouletteWheel.mp3';

const rouletteWheel = new Audio(RouletteWheel);

const data = [
    { option: 'Mirabel', style: { backgroundColor: '#C5F3F0', textColor: 'black' }},
    { option: 'Isabella',style: { backgroundColor: '#17ECE8', textColor: 'black' } },
    { option: 'Luisa',style: { backgroundColor: '#AFC8F9', textColor: 'black' } },
    { option: 'Dolores',style: { backgroundColor: '#2F31EC', textColor: 'black' } },
    { option: 'Antonio',style: { backgroundColor: '#AA8BF4', textColor: 'black' } },
    { option: 'Camilio',style: { backgroundColor: '#5E1DFB', textColor: 'black' } },
    { option: 'Abula Alma', style: { backgroundColor: '#CB76FB', textColor: 'black' } },
    { option: 'Pepa', style: { backgroundColor: '#A217F1', textColor: 'black' } },
    { option: 'Julieta', style: { backgroundColor: '#F88DFD', textColor: 'black' } },
    { option: 'Bruno', style: { backgroundColor: '#E60AF0', textColor: 'black' } },
    { option: 'Felix', style: { backgroundColor: '#FA84D0', textColor: 'black' } },
    { option: 'Agustin', style: { backgroundColor: '#F40EA4', textColor: 'black' } },
  ]

  
  export default () => {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [showWinner, setShowWinner] = useState(false);
    const [currentData, setCurrentData] = useState(data.slice());
  
    const handleSpinClick = () => {
      const newPrizeNumber = Math.floor(Math.random() * currentData.length)
      setPrizeNumber(newPrizeNumber)
      setMustSpin(true);
      rouletteWheel.play();
    }

    const handleResetClick = () => {
        setCurrentData(data.slice());
    }

    const removeSelected = () => {
        setShowWinner(false);
        currentData.splice(prizeNumber, 1);
        setCurrentData(currentData.slice());
      }

    const annouceWinner = () => {
        return (
            <Modal open={showWinner}>
                <Header icon='bullhorn' content='Selected' />
                <Modal.Content>
                    <h2>
                        { `${currentData[prizeNumber].option} `}
                    </h2>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color='red'
                        content="Remove"
                        labelPosition='right'
                        icon='remove'
                        onClick={() =>  removeSelected()}
                    />
                    <Button color='green' onClick={() => setShowWinner(false)}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }

    return (
      
      <div>
        {annouceWinner()}
        <Wheel
         outerBorderColor={'#04FAFC'}
         innerRadius={12}
         innerBorderColor={'#7504FC'}
         innerBorderWidth={6}
         radiusLineColor={'#046FFC'}
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={currentData}
  
          onStopSpinning={(a) => {
            // alert(`Selected : ${data[prizeNumber].option}`)
            setShowWinner(true);
            setMustSpin(false);
            rouletteWheel.pause();
          }}
        />
        <Button primary icon disabled={currentData.length < 2} onClick={handleSpinClick} labelPosition='left'>
          <Icon name='play' />SPIN
        </Button>
        <Button secondary icon disabled={data.length === currentData.length} onClick={handleResetClick} labelPosition='left'>
            <Icon name='redo' />RESET
        </Button>
      </div>
    )
  }