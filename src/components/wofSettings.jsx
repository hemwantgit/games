import React, { useState, useEffect } from 'react';
import { Form, TextArea, Radio } from 'semantic-ui-react';
import { REMOVE_OPTIONS } from '../utils/constants';

export default function WofSettings({onSettingChange, wofSettingsModel = {optionsString:'', removeOption:'NO_REMOVE'}}) {
    const [optionsString, setOptionsString] = useState(wofSettingsModel.optionsString);
    const [removeOption, setRemoveOption] = useState(wofSettingsModel.removeOption);

    useEffect(() => {
        onSettingChange && onSettingChange({
            optionsString: optionsString,
            removeOption
        });
      }, [removeOption, optionsString]);

    const optionsTextArea = () => {
        return (<Form>
            <Form.Field>
                <b>Enter Options:</b>
            </Form.Field>
            <TextArea placeholder='Comma separated options list. e.g options1, options2' value={optionsString}
                onChange={(e, { value }) => setOptionsString(value)}
                style={{ minHeight: 50 }} />
        </Form>
        )
    }

    const selectedRemovalSetting = () => {
        return (
            <Form style={{'marginTop':'30px'}}>
                <Form.Field>
                    <b>Choose action after each spin:</b>
                </Form.Field>
                <Form.Field>
                    <Radio
                        label='Do not remove selected option after spin'
                        name='removeOption'
                        value={REMOVE_OPTIONS[0]}
                        checked={removeOption === REMOVE_OPTIONS[0]}
                        onChange={() => setRemoveOption(REMOVE_OPTIONS[0])}
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        label='Remove selected option after spin'
                        name='removeOption'
                        value={REMOVE_OPTIONS[1]}
                        checked={removeOption === REMOVE_OPTIONS[1]}
                        onChange={() => setRemoveOption(REMOVE_OPTIONS[1])}
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        label='Decide removing selected option after spin'
                        name='removeOption'
                        value={REMOVE_OPTIONS[2]}
                        checked={removeOption === REMOVE_OPTIONS[2]}
                        onChange={() => setRemoveOption(REMOVE_OPTIONS[2])}
                    />
                </Form.Field>
            </Form>
        )
    }

    return (
        <div>
            {optionsTextArea()}
            {selectedRemovalSetting()}
        </div>
    )
}