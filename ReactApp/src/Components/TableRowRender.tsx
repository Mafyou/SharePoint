import * as React from 'react';

export default class TableRowRender extends React.Component<any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <td key={this.props.key}>
                {this.props.Text}
            </td>
        );
    }
}