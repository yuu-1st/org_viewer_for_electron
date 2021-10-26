import React from 'react';
import { DirectoryData } from './../@types/connectionDataType';
import { Button, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import { BookOpen, Edit, FilePlus, Folder } from 'react-feather';
import { DeletePopup, ShowPopup, ShowTemporaryPopup } from './popup';

interface DirectoryShowListElementProps {
  /** 表示するデータ情報 */
  dirLists: DirectoryData[] | null;
  handleClickDirectory: (dirName: string) => void;
  changeDivToHtml: (html: string, dirName: string) => void;
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
      const popId = ShowTemporaryPopup('実行中…', 'emacsを起動しています。', 'default');
      const result = await window.api.fileOpenToEmacs(value);
      DeletePopup(popId); // 非表示にする。
      if (result.result === 'error') {
        ShowPopup('Emacsを起動できませんでした。', result.data ?? ' ', 'danger');
      }
    }
  };

  /**
   * 選択されたorgファイルをHTMLに変換して表示します。
   * @param dirName
   * @param extension
   */
  openView = async (dirName: string, extension: string | null) => {
    if (extension === 'org') {
      const popId = ShowTemporaryPopup('実行中…', 'orgファイルを開いています。', 'default');
      const result = await window.api.fileChangeFromOrgToHTML(dirName);
      DeletePopup(popId); // 非表示にする。
      if (result.result === 'success') {
        this.props.changeDivToHtml(result.data, dirName);
      } else {
        ShowPopup('orgファイルを開けませんでした。', result.data, 'danger');
      }
    } else if (extension === '/dir') {
      this.props.handleClickDirectory(dirName);
    }
  };

  render() {
    const { dirLists, handleClickDirectory, changeDivToHtml } = this.props;
    const paddingLeft: React.CSSProperties = {
      marginLeft: 15,
      marginRight: 15,
    };
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
              {
                /** orgファイルであれば編集ボタンを表示する */
                dirList.extension === 'org' && (
                  <Edit
                    style={paddingLeft}
                    onClick={(e) => this.openFile(dirList.rootPath, dirList.extension)}
                  />
                )
              }
              {
                /** orgファイルかディレクトリであれば開くボタンを表示する */
                (dirList.extension === 'org' && (
                  <BookOpen
                    style={paddingLeft}
                    onClick={(e) => this.openView(dirList.rootPath, dirList.extension)}
                  />
                )) ||
                  (needTree && (
                    <Folder
                      style={paddingLeft}
                      onClick={(e) => this.openView(dirList.rootPath, dirList.extension)}
                    />
                  ))
              }
              {dirList.name}
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

//**************************************************************************************************************
//**************************************************************************************************************

interface FileOperationIconProps {
  directory: string;

  updateDirectoryShowObject: (
    newDirName: string | null,
    newLevel: number | null,
    newIsAll: number | null
  ) => void;
}

interface FileOperationIconStates {
  /** どのModal windowが開いているか。全て閉じている場合はnull */
  isModalOpen: null | 'NewFile';
  newFileName: string;
  newModalError: string;
}

/**
 * ファイル操作関係のアイコンを設置するコンポーネント
 */
class FileOperationIcon extends React.Component<FileOperationIconProps, FileOperationIconStates> {
  /**
   * コンストラクタ。
   * @param props
   */
  constructor(props: FileOperationIconProps) {
    super(props);
    this.state = {
      isModalOpen: null,
      newFileName: '',
      newModalError: '',
    };
  }

  /**
   * NewFileのModalを表示します
   */
  openNewFileModal = () => {
    this.setState({ isModalOpen: 'NewFile', newFileName: '', newModalError: '' });
  };

  /**
   * 全てのModal windowを閉じます
   */
  closeModal = () => {
    console.log('close');
    this.setState({ isModalOpen: null });
  };

  /**
   * NewFileのModalで、入力されたファイル名を取得/セットします。
   * @param newFileName
   */
  handleNewFileModalInputOnChange = (newFileName: string) => {
    this.setState({ newFileName });
  };

  /**
   * NewFileのModalで、作成ボタンを押された時に、エラーもしくは成功を表示します。
   */
  handleNewFileModalOnCreateDown = async () => {
    console.log('create');
    const { directory, updateDirectoryShowObject } = this.props;
    const { newFileName } = this.state;
    let error = '';
    if (newFileName.length === 0) {
      error = 'ファイル名は1文字以上必要です';
    } else {
      const result = await window.api.FileOperating_CreateNewFile(newFileName, directory);
      if (result.result === 'success') {
        ShowPopup('ファイル作成に成功しました。', newFileName, 'success');
        updateDirectoryShowObject(null, null, null);
      } else {
        if (result.data === 'already exist.') {
          error = '該当のファイル名は既に存在しています。';
        } else if (result.data === 'Contains characters that cannot be used.') {
          error = 'ファイルに使用できない文字が含まれています。';
        } else {
          error = result.data;
        }
      }
    }
    if (error.length === 0) {
      this.closeModal();
    }
    this.setState({ newModalError: error });
  };

  render() {
    const { isModalOpen, newFileName, newModalError } = this.state;
    return (
      <>
        <div id="iconLists" className="d-flex flex-row my-3">
          <div id="newFile" className="d-flex flex-row m-1" onClick={this.openNewFileModal}>
            <FilePlus />
            New File
          </div>
            <Modal show={(isModalOpen === 'NewFile')} onHide={this.closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>新規ファイル作成</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="text-danger">{newModalError}</div>
                <div className="m-1 flex-grow-1 d-flex flex-row">
                  <input
                    className="flex-grow-1"
                    type="text"
                    value={newFileName}
                    onChange={(e) => this.handleNewFileModalInputOnChange(e.target.value)}
                  />
                  <div className="m-1">.org</div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.closeModal}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.handleNewFileModalOnCreateDown}>
                  作成
                </Button>
              </Modal.Footer>
            </Modal>
        </div>
      </>
    );
  }
}

//**************************************************************************************************************
//**************************************************************************************************************


interface DirectoryShowDivProps {
  /** 表示するデータ情報 */
  dirLists: DirectoryData[] | null;
  /** 表示をhtmlに変更する関数 */
  changeDivToHtml: (html: string, dirName: string) => void;
  /** リストに表示したディレクトリをクリックされた時に、表示するディレクトリ名およびリストを更新します。 */
  handleClickDirectory: (dirName: string) => void;
  /** 現在表示しているディレクトリ */
  directory: string;
  /** ディレクトリ表示を更新するクラスです */
  updateDirectoryShowObject: (
    newDirName: string | null,
    newLevel: number | null,
    newIsAll: number | null
  ) => void;
}

/**
 * ベースとなる要素を扱うクラス
 */
export class DirectoryShowDiv extends React.Component<DirectoryShowDivProps, {}> {
  /**
   * コンストラクタ。メインプロセスからデフォルトデータを取得します。
   * @param props
   */
  constructor(props: DirectoryShowDivProps) {
    super(props);
  }

  render() {
    const {
      dirLists,
      handleClickDirectory,
      changeDivToHtml,
      directory,
      updateDirectoryShowObject,
    } = this.props;
    return (
      <div>
        <FileOperationIcon
          directory={directory}
          updateDirectoryShowObject={updateDirectoryShowObject}
        />
        <DirectoryShowListElement
          dirLists={dirLists}
          handleClickDirectory={handleClickDirectory}
          changeDivToHtml={changeDivToHtml}
        />
      </div>
    );
  }
}
