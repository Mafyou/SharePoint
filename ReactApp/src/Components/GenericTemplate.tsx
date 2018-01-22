import * as React from 'react';
import InputRender from './InputRender';
import SelectRender from './SelectRender';

export default class GenericTemplate extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    ConditionalRendering() {
        if (this.props.entryToBeGenerate.TypeAsString === 'Text') {
            return (
                    <InputRender
                        name={this.props.entryToBeGenerate.Title}
                        handleChildren={this.props.handleChildren}
                    />
                    );
        } else if (this.props.entryToBeGenerate.TypeAsString === 'Choice') {
            return (
                    <SelectRender
                        name={this.props.entryToBeGenerate.Title}
                        handleChildren={this.props.handleChildren}
                        optionsValues={this.props.entryToBeGenerate.Choices.results}
                    />
                );
        }
        return '';
        /*return (
                    'Props non gérée: ' +
                    this.props.entryToBeGenerate.TypeAsString +
                    ' ' + this.props.entryToBeGenerate.InternalName
                );*/
    }

    render() {
        return (
        <div>
            {this.ConditionalRendering()}
        </div>
        );
    }
}