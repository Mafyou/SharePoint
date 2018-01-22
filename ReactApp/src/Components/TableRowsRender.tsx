import * as React from 'react';
import TableEntry from './TableRowRender';

export default class TableRowsRender extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    ConditionalRendering() {
        return this.props.Entries.map((entry: any, i: number) =>
                (
                <tr key={i}>
                    {this.props.Fields.map((field: any, j: number) => {
                        if (field !== 'ContentType') {
                            return <TableEntry key={j} Text={entry[field]} />;
                        } 
                        return <TableEntry key={j} Text="Type non supporté" />;
                    })}
                </tr>)
        );
    }

    render() {
        return this.ConditionalRendering();
    }
}