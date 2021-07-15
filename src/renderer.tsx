// eslint-disable-next-line no-use-before-define
import React from 'react';
import ReactDOM from 'react-dom';
import { DirectoryData } from './@types/connectionDataType';

interface IState {
  value: string;
  dirLists : DirectoryData[];
}

class DirectoryForm extends React.Component<{}, IState> {
  constructor(props: {}) {
    super(props);
    this.state = { value: '', dirLists:[] };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const { value } = this.state;
    window.api.getDirectoryList(value,(dirList) => {
      if(dirList){
        this.setState({dirLists: dirList});
      }else{
        alert(`A name was not found:`);
      }
    });
  }

  render() {
    const { value, dirLists } = this.state;
    const domId = 'directory';
    return (
      <form onSubmit={this.handleSubmit}>
        <label htmlFor={domId}>
          Directory:
          <input id={domId} type="text" value={value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Search" /><br />
        <ul>{dirLists.map( (dirName, i) => {
          const colorStyle = {
            color: "black"
          };
          if(dirName.isDirectory){
            colorStyle.color = "green"
          }else if(dirName.extension==="org"){
            colorStyle.color = "red"
          }
          return <li key={dirName.name} style={colorStyle}>{dirName.name}</li>
        })}</ul>
      </form>
    );
  }
}

ReactDOM.render(<DirectoryForm />, document.getElementById('root'));
