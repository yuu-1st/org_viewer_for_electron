import React from 'react';
import ReactDOM from 'react-dom';
import { DirectoryData } from './@types/connectionDataType';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ListGroup, ListGroupItem, Form } from 'react-bootstrap';

interface DirectoryShowListElementProps {
  dirLists: DirectoryData[] | null;
}

class DirectoryShowListElement extends React.Component<DirectoryShowListElementProps, {}> {
  constructor(props: DirectoryShowListElementProps) {
    super(props);
  }

  openFile = async (value: string, extension: string|null) => {
    if(extension === 'org'){
      const result = await window.api.fileOpenToEmacs(value);
      if(result !== 'ok'){
        alert(result);
      }
    }
  };

  render() {
    const { dirLists } = this.props;
    if (dirLists === null) return null;
    return (
      <ListGroup>
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
            <ListGroupItem key={dirList.name} style={colorStyle} onClick={(e) => this.openFile(dirList.rootPath, dirList.extension)}>
              {dirList.name}
              {needTree && <DirectoryShowListElement dirLists={dirList.subDirectory} />}
            </ListGroupItem>
          );
        })}
      </ListGroup>
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

  handleDirectoryOnChange = (value: string) => {
    this.props.handleDirNameChange(value);
  };

  handleLevelOnChange = (value: string) => {
    this.props.handleLevelChange(Number(value));
  };

  handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    this.props.handleFormSubmit();
  };

  render() {
    const { dirName, level } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Floating className="mb-3">
          <Form.Control
            id="directoryName"
            type="text"
            value={dirName}
            onChange={(e) => this.handleDirectoryOnChange(e.target.value)}
          />
          <Form.Label htmlFor="directoryName">Directory:</Form.Label>
        </Form.Floating>
        <Form.Floating className="mb-3">
          <Form.Control
            type="number"
            value={level}
            id="directoryLevel"
            onChange={(e) => this.handleLevelOnChange(e.target.value)}
          />
          <Form.Label htmlFor="directoryLevel">Directory Level:</Form.Label>
        </Form.Floating>
        <Button type="submit">Search</Button>
        <br />
      </Form>
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
    this.setDefaultData();
    this.state = {
      dirName: '',
      level: 1,
      dirLists: null,
    };
  }

  setDefaultData = async () => {
    const data = await window.api.getDefaultData();
    this.setState({ dirName : data.HomeDir });
    this.handleFormSubmit();
  };

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
