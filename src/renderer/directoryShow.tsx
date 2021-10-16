import React from 'react';
import { DefaultData, DirectoryData } from './../@types/connectionDataType';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ListGroup, ListGroupItem, Form } from 'react-bootstrap';
import { BookOpen, Edit } from 'react-feather';
import { DeletePopup, ShowPopup, ShowTemporaryPopup } from './popup';

interface DirectoryShowListElementProps {
  /** 表示するデータ情報 */
  dirLists: DirectoryData[] | null;
  handleClickDirectory: (dirName: string) => void;
  changeDivToHtml : (html : string, dirName: string) => void;
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
  openFile = async (value: string, extension: string | null) => {
    if (extension === 'org') {
      const popId = ShowTemporaryPopup("実行中…","emacsを起動しています。", "default");
      const result = await window.api.fileOpenToEmacs(value);
      DeletePopup(popId); // 非表示にする。
      if (result.result === "error") {
        ShowPopup("Emacsを起動できませんでした。", (result.data ?? " "), "danger");
      }
    }
  };

  openView = async (dirName: string, extension: string | null) => {
    if (extension === 'org') {
      const popId = ShowTemporaryPopup("実行中…","orgファイルを開いています。", "default");
      const result = await window.api.fileChangeFromOrgToHTML(dirName);
      DeletePopup(popId); // 非表示にする。
      if(result.result === 'success'){
        this.props.changeDivToHtml(result.data, dirName);
      }else{
        ShowPopup("orgファイルを開けませんでした。",result.data, "danger");
      }
    } else if (extension === '/dir') {
      this.props.handleClickDirectory(dirName);
    }
  }

  render() {
    const { dirLists, handleClickDirectory, changeDivToHtml } = this.props;
    const paddingLeft : React.CSSProperties = {
      marginLeft: 30,
    }
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
            <ListGroupItem
              key={dirList.name}
              style={colorStyle}
            >
              {dirList.name}
              {
                /** orgファイルであれば編集ボタンを表示する */
                dirList.extension === 'org' && (<Edit style={paddingLeft}
                onClick={(e) => this.openFile(dirList.rootPath, dirList.extension)}
                />)
              }
              {
                /** orgファイルかディレクトリであれば開くボタンを表示する */
                (dirList.extension === 'org' || needTree) &&
                (<BookOpen style={paddingLeft}
                onClick={(e) => this.openView(dirList.rootPath, dirList.extension)}
                />)
              }
              {
                /* ディレクトリであれば再帰的に表示する */
                needTree && (
                  <DirectoryShowListElement
                    dirLists={dirList.subDirectory}
                    handleClickDirectory={handleClickDirectory}
                    changeDivToHtml={changeDivToHtml}
                  />
                )
              }
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

interface DirectoryShowDivProps {
  changeDivToHtml : (html : string, dirName: string) => void;
}

/**
 * ベースとなる要素を扱うクラス
 */
export class DirectoryShowDiv extends React.Component<DirectoryShowDivProps, DirectoryShowDivState> {
  /**
   * コンストラクタ。メインプロセスからデフォルトデータを取得します。
   * @param props
   */
  constructor(props: DirectoryShowDivProps) {
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
    const data : DefaultData = await window.api.getDefaultData();
    this.setState({ dirName: data.HomeDir });
    this.handleFormSubmit();
    if(data.isUpdate && data.isUpdate.result === "success"){
      ShowPopup('アップデート情報', data.isUpdate.data ?? "", 'info', true);
    }
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
   * @param dirNameLatest stateに頼らずに表示を更新する場合にのみ指定する。
   */
  handleFormSubmit = async (dirNameLatest: string | null = null) => {
    let { dirName, level } = this.state;
    if (dirNameLatest) {
      // setStateがリアルタイムで反映されないため、関数を再利用するために引数でリアルタイム値を取得する
      dirName = dirNameLatest;
    }
    const dirLists: DirectoryData[] | null = await window.api.getDirectoryList(dirName, level);
    if(dirLists === null){
      ShowPopup("表示するディレクトリが存在しませんでした。", " ", "danger");
    }
    this.setState({ dirLists });
  };

  /**
   * リストに表示したディレクトリをクリックされた時に、表示するディレクトリ名およびリストを更新します。
   * @param dirName 表示先のディレクトリ名
   */
  handleClickDirectory = (dirName: string) => {
    this.handleDirNameChange(dirName);
    this.handleFormSubmit(dirName);
  };

  render() {
    const { dirName, level, dirLists } = this.state;
    const { changeDivToHtml } = this.props;
    return (
      <div>
        <DirectoryShowSelectForm
          dirName={dirName}
          level={level}
          handleDirNameChange={this.handleDirNameChange}
          handleLevelChange={this.handleLevelChange}
          handleFormSubmit={this.handleFormSubmit}
        />
        <DirectoryShowListElement
          dirLists={dirLists}
          handleClickDirectory={this.handleClickDirectory}
          changeDivToHtml={changeDivToHtml}
        />
      </div>
    );
  }
}