import React from 'react';
import { DirectoryData } from './../@types/connectionDataType';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import { BookOpen, Edit, Folder } from 'react-feather';
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

interface DirectoryShowDivProps {
  /** 表示するデータ情報 */
  dirLists: DirectoryData[] | null;
  /** 表示をhtmlに変更する関数 */
  changeDivToHtml: (html: string, dirName: string) => void;
  /** リストに表示したディレクトリをクリックされた時に、表示するディレクトリ名およびリストを更新します。 */
  handleClickDirectory: (dirName: string) => void;
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
    const { dirLists, handleClickDirectory, changeDivToHtml } = this.props;
    return (
      <div>
        <DirectoryShowListElement
          dirLists={dirLists}
          handleClickDirectory={handleClickDirectory}
          changeDivToHtml={changeDivToHtml}
        />
      </div>
    );
  }
}
