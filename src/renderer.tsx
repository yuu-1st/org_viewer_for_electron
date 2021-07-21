import React from 'react';
import ReactDOM from 'react-dom';
import { DirectoryData } from './@types/connectionDataType';

interface DirectoryShowListElementProps {
  dirLists: DirectoryData[] | null;
}

class DirectoryShowListElement extends React.Component<DirectoryShowListElementProps, {}> {
  constructor(props: DirectoryShowListElementProps) {
    console.log(props);
    super(props);
  }

  render() {
    const { dirLists } = this.props;
    if (dirLists === null) return null;
    return (
      <ul>
        {dirLists.map((dirList, i) => {
          let needTree = false;
          const colorStyle = {
            color: 'black',
          };
          if (dirList.isDirectory) {
            colorStyle.color = 'green';
            needTree = true;
          } else if (dirList.extension === 'org') {
            colorStyle.color = 'red';
          }
          return (
            <li key={dirList.name} style={colorStyle}>
              {dirList.name}
              {needTree && <DirectoryShowListElement dirLists={dirList.subDirectory} />}
            </li>
          );
        })}
      </ul>
    );
  }
}

interface DirectoryShowSelectFormProps {
  dirName: string;
  level: number;
  handleDirNameChange: (dirName: string) => void;
  handleLevelChange: (level: number) => void;
  handleFormSubmit: () => void;
}

class DirectoryShowSelectForm extends React.Component<DirectoryShowSelectFormProps, {}> {
  constructor(props: DirectoryShowSelectFormProps) {
    super(props);
  }

  handleDirectoryOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.handleDirNameChange(event.target.value);
  };

  handleLevelOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.handleLevelChange(Number(event.target.value));
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    this.props.handleFormSubmit();
  };

  render() {
    const { dirName, level } = this.props;
    const inputStyle = {
      width: '300px',
    };
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Directory:
          <input
            type="text"
            style={inputStyle}
            value={dirName}
            onChange={(e) => this.handleDirectoryOnChange(e)}
          />
        </label>
        <br />
        <label>
          Directory Level:
          <input type="number" value={level} onChange={(e) => this.handleLevelOnChange(e)} />
        </label>
        <br />
        <input type="submit" value="Search" />
        <br />
      </form>
    );
  }
}

interface DirectoryShowDivState {
  dirName: string;
  level: number;
  dirLists: DirectoryData[] | null;
}

class DirectoryShowDiv extends React.Component<{}, DirectoryShowDivState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      dirName: '',
      level: 1,
      dirLists: null,
    };
  }

  handleDirNameChange = (dirName: string) => {
    this.setState({ dirName });
  };

  handleLevelChange = (level: number) => {
    this.setState({ level });
  };

  handleFormSubmit = async () => {
    const { dirName, level } = this.state;
    const dirLists: DirectoryData[] | null = await window.api.getDirectoryList(dirName, level);
    this.setState({ dirLists });
  };

  render() {
    const { dirName, level, dirLists } = this.state;
    return (
      <div>
        <DirectoryShowSelectForm
          dirName={dirName}
          level={level}
          handleDirNameChange={this.handleDirNameChange}
          handleLevelChange={this.handleLevelChange}
          handleFormSubmit={this.handleFormSubmit}
        />
        <DirectoryShowListElement dirLists={dirLists} />
      </div>
    );
  }
}

ReactDOM.render(<DirectoryShowDiv />, document.getElementById('root'));
