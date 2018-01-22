import * as React from 'react';

export default class SelectRender extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
        <div className="col">
            <label>{this.props.name}: </label>
            <select className="form-control" onChange={this.props.handleChildren}>
                {
                    this.props.optionsValues.map(function(optionValue: any, index: number) {
                        return <option key={index}>{optionValue}</option>;
                    })
                }
            </select>
        </div>
        );
    }
}