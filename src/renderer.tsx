import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';
import './renderer.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/plugins/toolbar/prism-toolbar.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { DirectoryShowDiv } from './renderer/directoryShow';
import { HtmlShowDiv } from './renderer/htmlShow';
import ReactNotification from 'react-notifications-component';
import { OverMenuBar } from './renderer/overMenuBar';
import { HTMLCreateTableOfContents } from './renderer/object/HTMLCreateTableOfContents';
import { HtmlLinkToAbsolutePath } from './renderer/object/HtmlLinkToAbsolutePath';
import { DefaultData, DirectoryData } from './@types/connectionDataType';
import { ShowPopup } from './renderer/popup';

interface RootDivState {
  /** 現在表示している場所 */
  showDiv: 'Directory' | 'Html';

  /** htmlShow のデータ */
  htmlShowObject: {
    /** htmlShow のbody部分 */
    Body: string;
    /** htmlShow の目次部分 */
    TableOfContents: string;
    /** 現在表示されているファイル名 */
    nowShowingFileName: string;
  };

  /** directoryShow のデータ */
  directoryShowObject: {
    /** ディレクトリ名 */
    dirName: string;
    /** ディレクトリ階層数 */
    level: number;
    /** ディレクトリ表示量 */
    isAll: number;
    /** 表示するデータ情報 */
    dirLists: DirectoryData[] | null;
  };
}

class RootDiv extends React.Component<{}, RootDivState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      showDiv: 'Directory',
      htmlShowObject: {
        Body: '',
        TableOfContents: '',
        nowShowingFileName: '',
      },
      directoryShowObject: {
        dirName: '',
        level: 1,
        isAll: 1,
        dirLists: null,
      },
    };
    this.setDefaultData();
    window.api.ipcRendererOnShowLicenseList(this.showLicenseList);
  }

  /**
   * html要素を受け取り、画面表示をhtmlに変更します。
   * @param html
   */
  changeDivToHtml = async (html: string, dirName: string) => {
    const parser = new DOMParser();
    let dom = parser.parseFromString(html, 'text/html');
    dom = await HtmlLinkToAbsolutePath(dom, dirName);
    const domToC = HTMLCreateTableOfContents(dom);

    this.setState({
      htmlShowObject: {
        Body: dom.body.innerHTML,
        TableOfContents: domToC.innerHTML,
        nowShowingFileName: dirName,
      },
      showDiv: 'Html',
    });
  };

  /**
   * ディレクトリ表示に切り替えます。
   */
  changeDivToDirectory = () => {
    this.setState({
      htmlShowObject: {
        Body: '',
        TableOfContents: '',
        nowShowingFileName: '',
      },
      showDiv: 'Directory',
    });
  };

  /**
   * ライセンスリストを表示します
   * @param text
   */
  showLicenseList = (text: string) => {
    this.changeDivToHtml(text, '');
  };

  /**
   * メインプロセスからデフォルトデータを取得し、stateに追加する。
   */
  setDefaultData = async () => {
    const data: DefaultData = await window.api.getDefaultData();
    this.updateDirectoryShowObject(data.HomeDir, null, null);
    if (data.isUpdate && data.isUpdate.result === 'success') {
      ShowPopup('アップデート情報', data.isUpdate.data ?? '', 'info', true);
    }
  };

  /**
   * フォームに表示する「ディレクトリ名」をステートにセットします
   * @param dirName 表示するディレクトリ名
   */
  handleOnlyDirNameChange = (dirName: string) => {
    const { directoryShowObject } = this.state;
    directoryShowObject.dirName = dirName;
    this.setState({ directoryShowObject });
  };

  /**
   * DirectoryShowObjectの中身を更新し、ディレクトリを更新します。
   * @param newDirName 更新したディレクトリ名
   * @param newLevel 更新したディレクトリ階層数
   * @param newIsAll 更新したis all
   */
  updateDirectoryShowObject = async (
    newDirName: string | null,
    newLevel: number | null,
    newIsAll: number | null
  ) => {
    let { directoryShowObject } = this.state;
    if (newDirName) {
      directoryShowObject.dirName = newDirName;
    }
    if (newLevel) {
      directoryShowObject.level = newLevel;
    }
    if (newIsAll) {
      directoryShowObject.isAll = newIsAll;
    }
    const dirLists: DirectoryData[] | null = await window.api.getDirectoryList(
      directoryShowObject.dirName,
      directoryShowObject.level,
      directoryShowObject.isAll
    );
    if (dirLists === null) {
      ShowPopup('表示するディレクトリが存在しませんでした。', ' ', 'danger');
    }
    directoryShowObject.dirLists = dirLists;
    this.setState({ directoryShowObject });
  };

  /**
   * リストに表示したディレクトリをクリックされた時に、表示するディレクトリ名およびリストを更新します。
   * @param dirName 表示先のディレクトリ名
   */
  handleClickDirectory = (dirName: string) => {
    this.updateDirectoryShowObject(dirName, null, null);
  };

  render() {
    const { showDiv, htmlShowObject, directoryShowObject } = this.state;
    const hiddenStyle: React.CSSProperties = {
      display: 'none',
    };
    return (
      <div className="app-container">
        <OverMenuBar
          type={showDiv}
          changeDivToDirectory={this.changeDivToDirectory}
          handleOnlyDirNameChange={this.handleOnlyDirNameChange}
          updateDirectoryShowObject={this.updateDirectoryShowObject}
          dirName={directoryShowObject.dirName}
          level={directoryShowObject.level}
          isAll={directoryShowObject.isAll}
          nowShowingFileName={htmlShowObject.nowShowingFileName}
        />
        <div className="main">
          <ReactNotification /> {/*  通知用 */}
          <div id="SwitchDiv">
            <div id="directory" style={showDiv !== 'Directory' ? hiddenStyle : {}}>
              <DirectoryShowDiv
                dirLists={directoryShowObject.dirLists}
                handleClickDirectory={this.handleClickDirectory}
                changeDivToHtml={this.changeDivToHtml}
                directory={directoryShowObject.dirName}
                updateDirectoryShowObject={this.updateDirectoryShowObject}
              />
            </div>
            <div id="directory" style={showDiv !== 'Html' ? hiddenStyle : {}}>
              <HtmlShowDiv
                html={htmlShowObject.Body}
                tableOfContents={htmlShowObject.TableOfContents}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<RootDiv />, document.getElementById('root'));
