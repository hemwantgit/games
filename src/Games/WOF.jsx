import React, { useState } from 'react';
import '../App.css';
import { Wheel } from 'react-custom-roulette';
import { Button, Icon, Header, Modal, Grid, Segment } from 'semantic-ui-react';
import RouletteWheel from '../static/RouletteWheel.mp3';
import { getWheelData } from '../utils/wofUtils';
import WofSettings from '../components/wofSettings';
import { REMOVE_OPTIONS } from '../utils/constants';

const rouletteWheel = new Audio(RouletteWheel);


let entries = ['Mirabel', 'Isabella', 'Luisa', 'Dolores',
  'Antonio', 'Camilio', 'Abula Alma', 'Pepa',
  'Julieta', 'Bruno', 'Felix', 'Agustin'];

let data = getWheelData(entries);


export default () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [showWinner, setShowWinner] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [currentData, setCurrentData] = useState(data.slice());
  let wofSettingsModelTemp = {
    optionsString: entries.join(','),
    removeOption: REMOVE_OPTIONS[0]
  };
  const [wofSettingsModel, setWofSettingsModel] = useState(wofSettingsModelTemp);

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
    setPrizeNumber(0);
    setCurrentData(currentData.slice());
  }

  const applySettings = () => {
    setWofSettingsModel(wofSettingsModelTemp);

    setShowSettings(false)
  }

  React.useEffect(() => {
    let options = wofSettingsModel.optionsString ? wofSettingsModel.optionsString.split(',') : [];
    options = options.filter(option => !!option);
    data = getWheelData(options);
    setCurrentData(data.slice());
    handleResetClick();
  }, [wofSettingsModel]);

  const handleAnnouncementClose = () => {
    if (wofSettingsModel.removeOption === REMOVE_OPTIONS[1]) {
      removeSelected()
    }
    else {
      setShowWinner(false)
    }
  }

  const announceWinner = () => {
    return (
      <Modal open={showWinner}>
        <Header icon='bullhorn' content='Selected' />
        <Modal.Content>
          <h2>
            {`${currentData[prizeNumber].option} `}
          </h2>
        </Modal.Content>
        <Modal.Actions>
          {wofSettingsModel.removeOption === REMOVE_OPTIONS[2] && <Button
            color='red'
            content="Remove"
            labelPosition='right'
            icon='remove'
            onClick={() => removeSelected()}
          />}
          <Button color='green' onClick={() => handleAnnouncementClose()}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  const getSettingsComponent = () => {
    return (
      <Modal
        key='WofSettingsModel'
        open={showSettings}
        trigger={<Button icon='setting' onClick={() => setShowSettings(true)}></Button>}
      >
        <Header icon='settings' content='Settings' />
        <Modal.Content>
          <WofSettings
            key='WofSettings'
            wofSettingsModel={wofSettingsModel}
            onSettingChange={(wofSettings) => {
              wofSettingsModelTemp = wofSettings;
            }}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            secondary
            content="Cancel"
            labelPosition='right'
            icon='cancel'
            onClick={() => setShowSettings(false)}
          />
          <Button color='green' icon='checkmark' labelPosition='right'
            content="Apply"
            onClick={() => applySettings(false)}>

          </Button>
        </Modal.Actions>
      </Modal>
    )
  }

  return (

    <Grid columns={1}>
      <Grid.Row>
        <div className='center'>
          {getSettingsComponent()}
          {announceWinner()}
          <div style={{ 'margin': 'auto', 'width':'66%' }}>
            <Wheel
              outerBorderColor={'#A6A6A7'}
              innerRadius={12}
              innerBorderColor={'#A64747'}
              innerBorderWidth={6}
              radiusLineWidth={0}
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
          </div>
          <div className='center'>
            <Button primary icon disabled={currentData.length < 2} onClick={handleSpinClick} labelPosition='left' style={{'margin-left':'20%'}}>
              <Icon name='play' />SPIN
            </Button>
            <Button secondary icon disabled={data.length === currentData.length} onClick={handleResetClick} labelPosition='left'>
              <Icon name='redo' />RESET
            </Button>
          </div>
        </div>
      </Grid.Row>
    </Grid>
  )
}