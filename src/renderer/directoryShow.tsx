import React from 'react';
import { DirectoryData } from './../@types/connectionDataType';
import { Button, ListGroup, ListGroupItem, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BookOpen, Edit, Edit2, FilePlus, Folder, Tool, Trash2 } from 'react-feather';
import { DeletePopup, ShowPopup, ShowTemporaryPopup } from './popup';

interface DirectoryShowListElementProps {
  /** 表示するデータ情報 */
  dirLists: DirectoryData[] | null;
  handleClickDirectory: (dirName: string) => void;
  changeDivToHtml: (html: string, dirName: string) => void;

  isEditButtonDown: boolean;

  openDeleteFileModal: (showFileName: string, deleteFullPath: string) => void;
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
    const {
      dirLists,
      handleClickDirectory,
      changeDivToHtml,
      isEditButtonDown,
      openDeleteFileModal,
    } = this.props;

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
              {((): JSX.Element | undefined => {
                /* 手前にボタンを設置する場合 */
                if (isEditButtonDown) {
                  if (dirList.extension === 'org') {
                    /* orgファイルであれば編集ボタンと開くボタンを表示する */
                    return (
                      <>
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 500, hide: 0 }}
                          overlay={<Tooltip>Delete File</Tooltip>}
                        >
                          <Trash2
                            className="mx-3"
                            onClick={(e) => openDeleteFileModal(dirList.name, dirList.rootPath)}
                          />
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 500, hide: 0 }}
                          overlay={<Tooltip>Edit Filename</Tooltip>}
                        >
                          <Edit2
                            className="mx-3"
                            onClick={(e) =>
                              ShowPopup('この機能は実装されていません。', ' ', 'danger')
                            } // とりあえず。
                          />
                        </OverlayTrigger>
                      </>
                    );
                  }
                } else {
                  if (dirList.extension === 'org') {
                    /* orgファイルであれば編集ボタンと開くボタンを表示する */
                    return (
                      <>
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 500, hide: 0 }}
                          overlay={<Tooltip>open editor</Tooltip>}
                        >
                          <Edit
                            className="mx-3"
                            onClick={(e) => this.openFile(dirList.rootPath, dirList.extension)}
                          />
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          delay={{ show: 500, hide: 0 }}
                          overlay={<Tooltip>show</Tooltip>}
                        >
                          <BookOpen
                            className="mx-3"
                            onClick={(e) => this.openView(dirList.rootPath, dirList.extension)}
                          />
                        </OverlayTrigger>
                      </>
                    );
                  } else if (needTree) {
                    /* ディレクトリであれば開くボタンを表示する */
                    return (
                      <>
                        <Folder
                          className="mx-3"
                          onClick={(e) => this.openView(dirList.rootPath, dirList.extension)}
                        />
                      </>
                    );
                  }
                }
              })()}
              {dirList.name}
              {
                /* ディレクトリであれば再帰的に表示する */
                needTree && (
                  <DirectoryShowListElement
                    dirLists={dirList.subDirectory}
                    handleClickDirectory={handleClickDirectory}
                    changeDivToHtml={changeDivToHtml}
                    isEditButtonDown={isEditButtonDown}
                    openDeleteFileModal={openDeleteFileModal}
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

  isEditButtonDown: boolean;

  changeIsEditButtonDown: () => void;

  openNewFileModal: () => void;
}

/**
 * ファイル操作関係のアイコンを設置するコンポーネント
 */
class FileOperationIcon extends React.Component<FileOperationIconProps, {}> {
  /**
   * コンストラクタ。
   * @param props
   */
  constructor(props: FileOperationIconProps) {
    super(props);
  }

  render() {
    const { changeIsEditButtonDown, isEditButtonDown, openNewFileModal } = this.props;
    // エディトボタンが押されているかどうかで条件分岐。する意味は果たしてあったのか
    if (isEditButtonDown) {
      return (
        <>
          <div id="iconLists" className="d-flex flex-row my-3">
            <div id="editFile" className="d-flex flex-row m-1" onClick={changeIsEditButtonDown}>
              <Tool className="me-1" />
              Edit End
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div id="iconLists" className="d-flex flex-row my-3">
            <div id="newFile" className="d-flex flex-row m-1" onClick={openNewFileModal}>
              <FilePlus className="me-1" />
              New File
            </div>
            <div id="editFile" className="d-flex flex-row m-1" onClick={changeIsEditButtonDown}>
              <Tool className="me-1" />
              Edit File
            </div>
          </div>
        </>
      );
    }
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

interface DirectoryShowDivState {
  /** 編集ボタンが押されているか */
  isEditButtonDown: boolean;
  /** どのModal windowが開いているか。全て閉じている場合はnull */
  isModalOpen: null | 'NewFile' | 'EditFileName' | 'DeleteFile';
  ModalFileName: string;
  ModalFullPath: string;
  ModalError: string;
  ModalExplainText: string;
}

/**
 * ベースとなる要素を扱うクラス
 */
export class DirectoryShowDiv extends React.Component<
  DirectoryShowDivProps,
  DirectoryShowDivState
> {
  /**
   * コンストラクタ。メインプロセスからデフォルトデータを取得します。
   * @param props
   */
  constructor(props: DirectoryShowDivProps) {
    super(props);
    this.state = {
      isEditButtonDown: false,
      isModalOpen: null,
      ModalFileName: '',
      ModalFullPath: '',
      ModalError: '',
      ModalExplainText: '',
    };
  }

  /**
   * state "isEditButtonDown" を反転させます。
   */
  changeIsEditButtonDown = () => {
    const { isEditButtonDown } = this.state;
    this.setState({ isEditButtonDown: !isEditButtonDown });
  };

  /**
   * NewFileのModalを表示します
   */
  openNewFileModal = () => {
    this.setState({
      isModalOpen: 'NewFile',
      ModalFileName: '',
      ModalFullPath: '',
      ModalError: '',
      ModalExplainText: '',
    });
  };

  /**
   * DeleteFileのModalを表示します
   */
  openDeleteFileModal = (showFileName: string, deleteFullPath: string) => {
    this.setState({
      isModalOpen: 'DeleteFile',
      ModalFileName: showFileName,
      ModalFullPath: deleteFullPath,
      ModalError: '',
    });
  };

  /**
   * 全てのModal windowを閉じます
   */
  closeModal = () => {
    this.setState({ isModalOpen: null });
  };

  /**
   * Modalで、入力されたファイル名を取得/セットします。
   * @param newFileName
   */
  handleModalInputOnChange = (ModalFileName: string) => {
    this.setState({ ModalFileName });
  };

  /**
   * Modalで、入力されたファイル名を取得/セットします。
   * @param ModalExplainText
   */
  handleModalInputExplainOnChange = (ModalExplainText: string) => {
    this.setState({ ModalExplainText });
  };

  /**
   * NewFileのModalで、作成ボタンを押された時に、エラーもしくは成功を表示します。
   */
  handleNewFileModalOnCreateDown = async () => {
    console.log('create');
    const { directory, updateDirectoryShowObject } = this.props;
    const { ModalFileName, ModalExplainText } = this.state;
    let error = '';
    if (ModalFileName.length === 0) {
      error = 'ファイル名は1文字以上必要です';
    } else {
      const result = await window.api.FileOperating_CreateNewFile(
        ModalFileName,
        directory,
        ModalExplainText
      );
      if (result.result === 'success') {
        ShowPopup('ファイル作成に成功しました。', ModalFileName, 'success');
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
    this.setState({ ModalError: error });
  };

  handleDeleteButtonDown = async () => {
    const { updateDirectoryShowObject } = this.props;
    const { ModalFullPath } = this.state;
    let error = '';
    const result = await window.api.FileOperating_DeleteFile(ModalFullPath);
    if (result.result === 'success') {
      ShowPopup('ファイルを削除しました。', ModalFullPath, 'success');
      updateDirectoryShowObject(null, null, null);
    } else {
      error = result.data;
    }
    if (error.length === 0) {
      this.closeModal();
    }
    this.setState({ ModalError: error });
  };

  render() {
    const {
      dirLists,
      handleClickDirectory,
      changeDivToHtml,
      directory,
      updateDirectoryShowObject,
    } = this.props;
    const { isEditButtonDown, isModalOpen, ModalFileName, ModalError, ModalExplainText } =
      this.state;

    return (
      <div>
        <FileOperationIcon
          directory={directory}
          updateDirectoryShowObject={updateDirectoryShowObject}
          isEditButtonDown={isEditButtonDown}
          changeIsEditButtonDown={this.changeIsEditButtonDown}
          openNewFileModal={this.openNewFileModal}
        />
        <DirectoryShowListElement
          dirLists={dirLists}
          handleClickDirectory={handleClickDirectory}
          changeDivToHtml={changeDivToHtml}
          isEditButtonDown={isEditButtonDown}
          openDeleteFileModal={this.openDeleteFileModal}
        />
        {/* 削除ファイルモーダルウィンドウ */}
        <Modal show={isModalOpen === 'DeleteFile'} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>ファイル削除</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-danger">{ModalError}</div>
            <div className="m-1 flex-grow-1 d-flex flex-row">
              「{ModalFileName}」を削除しますか？
              <br />
              ※一度削除すると元に戻すことは出来ません。
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.closeModal}>
              Cancel
            </Button>
            <Button variant="primary" onClick={this.handleDeleteButtonDown}>
              削除
            </Button>
          </Modal.Footer>
        </Modal>
        {/* 削除ファイルモーダルウィンドウここまで */}
        {/* 新規ファイルモーダルウィンドウ */}
        <Modal show={isModalOpen === 'NewFile'} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>新規ファイル作成</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-danger">{ModalError}</div>
            <div className="m-1 flex-grow-1 d-flex flex-row">
              <input
                className="flex-grow-1"
                type="text"
                value={ModalFileName}
                onChange={(e) => this.handleModalInputOnChange(e.target.value)}
              />
              <div className="m-1">.org</div>
            </div>
            <div className="">ファイル説明</div>
            <div className="m-1 flex-grow-1 d-flex flex-row">
              <input
                className="flex-grow-1"
                type="text"
                value={ModalExplainText}
                onChange={(e) => this.handleModalInputExplainOnChange(e.target.value)}
              />
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
        {/* 新規ファイルモーダルウィンドウここまで */}
      </div>
    );
  }
}
