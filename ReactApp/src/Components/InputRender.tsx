import * as React from 'react';

export default class InputRender extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
        <div className="col">
            <label>{this.props.name}: </label>
            <input className="form-control" onChange={this.props.handleChildren} placeholder={this.props.name} />
        </div>
        );
    }
}