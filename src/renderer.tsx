import React from 'react';
import ReactDOM from 'react-dom';
import { DirectoryData } from './@types/connectionDataType';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Button,
  ListGroup,
  ListGroupItem,
  Form,
} from 'react-bootstrap';

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
            <ListGroupItem key={dirList.name} style={colorStyle}>
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

  handleDirectoryOnChange = (value : string) => {
      this.props.handleDirNameChange(value);
  };

  handleLevelOnChange = (value : string) => {
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
        <Form.Group className="mb-3" controlId="directoryName">
          <Form.Label>
            Directory:
          </Form.Label>
          <Form.Control
            type="text"
            value={dirName}
            onChange={(e) => this.handleDirectoryOnChange(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="directoryLevel">
          <Form.Label>
          Directory Level:
          </Form.Label>
          <Form.Control type="number" value={level} onChange={(e) => this.handleLevelOnChange(e.target.value)} />
        </Form.Group>
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
