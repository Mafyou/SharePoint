import * as React from 'react';
import * as $ from 'jquery';
import { default as pnp, ItemAddResult } from 'sp-pnp-js';
import './App.css';
import GenericTemplate from './Components/GenericTemplate';
import TableRows from './Components/TableRowsRender';
import TableRow from './Components/TableRowRender';

class App extends React.Component<any, any> {
  listName = 'Workshops';
  contentTypeName = 'Workshop';
  componentsBuilt: any[] = [];
  jSonWithValues: any = {};

  constructor(props: string) {
    super(props);
    
    this.InitPnP();
    this.InitState();
    this.BindValue();
    this.GenerateComponents();
  }

  InitPnP() {
    let config: any = {
      sp: {
        headers: {
          'Accept': 'application/json; odata=verbose'
        }
      }
    };
    pnp.setup(config);
  }

  InitState() {
    this.state = {itemsCollection: [], fields: []};
  }

  BindValue() {
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChildren = this.handleChildren.bind(this);
  }

  handleSubmit(event: any) {
    pnp.sp.web.lists.getByTitle(this.listName).items.add(this.jSonWithValues).then((iar: ItemAddResult)  => {
      this.AddInListValue(iar.data);
    });
    // event.preventDefault();
  }

  AddInListValue(entryRaw: any) {
    console.log(entryRaw);
    let entry: any[] = [];
    this.state.fields.map((field: any, key: number) => {
      if (field !== 'ContentType') {
        entry.push(<TableRow key={key} Text={entryRaw[field]} />);
      } else {
        entry.push(<TableRow key={key} Text={'Type non supporté'} />);
      }
    });
    this.state.itemsCollection.push(<tr>{entry}</tr>);
    this.setState({itemsCollection: this.state.itemsCollection});
  }

  GenerateComponents() {
    let that = this;
    pnp.sp.web.lists.getByTitle(this.listName).contentTypes.get().then((contentTypes: any[]) => {
      that.DrawComponents(that, contentTypes);
    }).catch((err: any) => {
      console.log(err);
    });
  }

  DrawComponents(that: any, contentTypes: any[]) {
    $.ajax({
      url: that.GetFieldsUrlByOurContentType(that, contentTypes),
      method: 'GET',
      headers: {'Accept': 'application/json; odata=verbose'}
    }).done(function(data: any) {
      var ReactDOM = require('react-dom');
      that.componentsBuilt = that.BuildComponents(data.d.results);
      let fields = that.GenerateFields(that, data.d.results);
      that.RenderList(fields);
      ReactDOM.render(that.componentsBuilt, document.getElementById('drawComponents'));
    });
  }

  GetFieldsUrlByOurContentType(that: any, contentTypes: any[]) {
    let customCT: any = contentTypes.find(x => x.Name === that.contentTypeName);
    return customCT.Fields.__deferred.uri;
  }

  BuildComponents(resultsRaw: any[]) {
    let result: any[] = [];
    resultsRaw.map((entry: any, index: number) => {
      result.push(
              <GenericTemplate
                  entryToBeGenerate={entry}
                  handleChildren={(e: any) => this.handleChildren(event, entry.InternalName)}
              />
                );
    });
    return result;
  }

  handleChildren(event: any, name: any) {
    this.jSonWithValues[name] = event.target.value;
  }

  GenerateFields(that: any, fieldsRaw: any[]) {
    let fields = that.BuildFields(fieldsRaw);
    that.RenderFields(fields);
    return fields;
  }

  BuildFields(fieldsRaw: any[]) {
    let fields: any[] = [];
    fieldsRaw.map((field: any) => fields.push(<th>{field.Title}</th>));
    fieldsRaw.map((field: any) => this.state.fields.push(field.InternalName));
    return fields;
  }

  RenderFields(fields: any[]) {
    var ReactDOM = require('react-dom');
    ReactDOM.render(<tr>{fields}</tr>, document.getElementById('thead'));
  }

  RenderList(fields: any[]) {
    pnp.sp.web.lists.getByTitle(this.listName).items.get().then((entriesRaw: any[]) => {
      entriesRaw.map((entryRaw: any, index: number) => {
        let entry: any = {};
        entry = this.state.fields.map((field: any, key: number) => {
          if (field !== 'ContentType') {
            return <TableRow key={key} Text={entryRaw[field]} />;
          }
          return <TableRow key={key} Text={'Type non supporté'} />;
        });
        this.state.itemsCollection.push(<tr>{entry}</tr>);
      });
      var ReactDOM = require('react-dom');
      ReactDOM.render(<TableRows Entries={entriesRaw} Fields={this.state.fields} />, document.getElementById('tbody'));
    });
  }

  render() {
    return (
      <div className="App container">
        <form onSubmit={this.handleSubmit}>
          <div className="form-row" id="drawComponents" />
          <br />
          <button className="btn btn-primary" type="submit">Enregister</button>
        </form>
        <div>
          <p>Entrées dans la liste "{this.listName}" avec le Content Type "{this.contentTypeName}"</p>
          <table className="table">
            <thead id="thead" />
            <tbody id="tbody">
              {this.state.itemsCollection}
            </tbody>
          </table>
          <div id="fields" />
        </div>
      </div>
    );
  }
}

export default App;