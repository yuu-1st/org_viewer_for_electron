import React from 'react';
import ReactDOM from 'react-dom';
import { DirectoryShowDiv } from './renderer/directoryShow';
import { HtmlShowDiv } from './renderer/htmlShow';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';
import './renderer.css';
import { OverMenuBar } from './renderer/overMenuBar';
import { HTMLCreateTableOfContents } from './renderer/object/HTMLCreateTableOfContents';

interface RootDivState {
  htmlShowData: string;
  htmlShowTableOfContents: string;
  showDiv: 'Directory' | 'Html';
}

class RootDiv extends React.Component<{}, RootDivState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      htmlShowData: '',
      htmlShowTableOfContents: '',
      showDiv: 'Directory',
    };
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
      htmlShowData: dom.body.innerHTML,
      htmlShowTableOfContents: domToC.innerHTML,
      showDiv: 'Html',
    });
  };

  changeDivToDirectory = () => {
    this.setState({
      htmlShowData: '',
      showDiv: 'Directory',
    });
  };

  showLicenseList = (text: string) => {
    this.changeDivToHtml(text, '');
  };

  render() {
    const { htmlShowData, showDiv, htmlShowTableOfContents } = this.state;
    const hiddenStyle: React.CSSProperties = {
      display: 'none',
    };
    return (
      <div className="app-container">
        <OverMenuBar type={showDiv} changeDivToDirectory={this.changeDivToDirectory} />
        <div className="main">
          <ReactNotification /> {/*  通知用 */}
          <div id="SwitchDiv">
            <div id="directory" style={showDiv !== 'Directory' ? hiddenStyle : {}}>
              <DirectoryShowDiv changeDivToHtml={this.changeDivToHtml} />
            </div>
            <div id="directory" style={showDiv !== 'Html' ? hiddenStyle : {}}>
              <HtmlShowDiv html={htmlShowData} tableOfContents={htmlShowTableOfContents} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<RootDiv />, document.getElementById('root'));

/**
 * HTML要素のリンク関係を編集します。
 * @param str
 * @param dirPath
 * @returns
 */
async function HtmlLinkToAbsolutePath(dom: Document, dirPath: string): Promise<Document> {
  const awaitList = [];

  const hasHref = Array.from(dom.querySelectorAll('[href]'));
  awaitList.push(
    ...hasHref.map(async (a: any) => {
      // HTMLElementだと何してもa.hrefがエラー出たのでany
      if ('href' in a) {
        // a.href = await window.api.pathChangeFromRelativeToAbsolute(a.getAttribute('href'),dirPath); // ←後にこちらにする。
        a.href = 'javascript:void(0)';
      }
    })
  );

  const hasSrc = Array.from(dom.querySelectorAll<HTMLElement>('[src]'));
  awaitList.push(
    ...hasSrc.map(async (a: any) => {
      // HTMLElementだと何してもa.hrefがエラー出たのでany
      if ('src' in a) {
        a.src = await window.api.pathChangeFromRelativeToAbsolute(a.getAttribute('src'), dirPath);
      }
    })
  );

  await Promise.all(awaitList);

  return dom; // stringに戻す
}
