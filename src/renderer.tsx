import React from 'react';
import ReactDOM from 'react-dom';
import { DirectoryData } from './@types/connectionDataType';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ListGroup, ListGroupItem, Form } from 'react-bootstrap';

interface DirectoryShowListElementProps {
  /** 表示するデータ情報 */
  dirLists: DirectoryData[] | null;
}

/**
 * 画面下部に表示するディレクトリ/ファイルの表示を扱うクラス
 */
class DirectoryShowListElement extends React.Component<DirectoryShowListElementProps, {}> {
  constructor(props: DirectoryShowListElementProps) {
    super(props);
  }

  /**
   * ファイルがクリックされた時に、
   * ・orgファイルであればそれをemacsで表示するコードを呼び出します。
   * @param value 表示するパス
   * @param extension 拡張子
   */
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
              {needTree && <DirectoryShowListElement dirLists={dirList.subDirectory} /> /* ディレクトリであれば再帰的に表示する */}
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

/**
 * 画面上部に表示する入力フォームを表示を扱うクラス
 */
class DirectoryShowSelectForm extends React.Component<DirectoryShowSelectFormProps, {}> {
  constructor(props: DirectoryShowSelectFormProps) {
    super(props);
  }

  /**
   * ディレクトリ名が更新された時に、ベースクラスの更新関数を呼び出します。
   * @param value
   */
  handleDirectoryOnChange = (value: string) => {
    this.props.handleDirNameChange(value);
  };

  /**
   * ディレクトリ階層数が更新された時に、ベースクラスの更新関数を呼び出します。
   * @param value
   */
  handleLevelOnChange = (value: string) => {
    this.props.handleLevelChange(Number(value));
  };

  /**
   * フォームの更新を反映します。
   * @param event
   */
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
  /** ディレクトリ名 */
  dirName: string;
  /** ディレクトリ階層数 */
  level: number;
  /** 表示するデータ情報 */
  dirLists: DirectoryData[] | null;
}

/**
 * ベースとなる要素を扱うクラス
 */
class DirectoryShowDiv extends React.Component<{}, DirectoryShowDivState> {
  /**
   * コンストラクタ。メインプロセスからデフォルトデータを取得します。
   * @param props
   */
  constructor(props: {}) {
    super(props);
    this.setDefaultData();
    this.state = {
      dirName: '',
      level: 1,
      dirLists: null,
    };
  }

  /**
   * メインプロセスからデフォルトデータを取得し、stateに追加する。
   */
  setDefaultData = async () => {
    const data = await window.api.getDefaultData();
    this.setState({ dirName : data.HomeDir });
    this.handleFormSubmit();
  };

  /**
   * フォームに表示する「ディレクトリ名」をステートにセットします
   * @param dirName 表示するディレクトリ名
   */
  handleDirNameChange = (dirName: string) => {
    this.setState({ dirName });
  };

  /**
   * フォームに表示する「ディレクトリ階層数」をステートにセットします。
   * @param level 表示するディレクトリ階層数
   */
  handleLevelChange = (level: number) => {
    this.setState({ level });
  };

  /**
   * ステートにセットされた値から、表示するディレクトリおよび階層数を更新し、描画します。
   */
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
