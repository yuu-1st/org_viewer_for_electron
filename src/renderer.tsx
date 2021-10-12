import React from 'react';
import ReactDOM from 'react-dom';
import { DirectoryShowDiv } from './renderer/directoryShow';
import { HtmlShowDiv } from './renderer/htmlShow';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';

interface RootDivState {
  htmlShowData: string;
  showDiv: 'Directory' | 'Html';
}

class RootDiv extends React.Component<{}, RootDivState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      htmlShowData: '',
      showDiv: 'Directory',
    };
  }

  /**
   * html要素を受け取り、画面表示をhtmlに変更します。
   * @param html
   */
  changeDivToHtml = async (html: string, dirName: string) => {
    this.setState({
      htmlShowData: await HtmlLinkToAbsolutePath(html, dirName),
      showDiv: 'Html',
    });
  };

  changeDivToDirectory = () => {
    this.setState({
      htmlShowData: '',
      showDiv: 'Directory',
    });
  };

  render() {
    const { htmlShowData, showDiv } = this.state;
    const hiddenStyle: React.CSSProperties = {
      display: 'none',
    };
    return (
      <div className="app-container">
        <ReactNotification /> {/*  通知用 */ }
        <div id="SwitchDiv">
          <div id="directory" style={showDiv !== 'Directory' ? hiddenStyle : {}}>
            <DirectoryShowDiv changeDivToHtml={this.changeDivToHtml} />
          </div>
          <div id="directory" style={showDiv !== 'Html' ? hiddenStyle : {}}>
            <HtmlShowDiv html={htmlShowData} changeDivToDirectory={this.changeDivToDirectory} />
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
async function HtmlLinkToAbsolutePath(str: string, dirPath: string): Promise<string> {
  const parser = new DOMParser();
  const dom = parser.parseFromString(str, 'text/html');
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

  return dom.body.innerHTML; // stringに戻す
}
