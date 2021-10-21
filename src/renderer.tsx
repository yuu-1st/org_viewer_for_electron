import React from 'react';
import ReactDOM from 'react-dom';
import { DirectoryShowDiv } from './renderer/directoryShow';
import { HtmlShowDiv } from './renderer/htmlShow';
import ReactNotification from 'react-notifications-component';
import { OverMenuBar } from './renderer/overMenuBar';
import { HTMLCreateTableOfContents } from './renderer/object/HTMLCreateTableOfContents';
import { HtmlLinkToAbsolutePath } from './renderer/object/HtmlLinkToAbsolutePath';

import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';
import './renderer.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface RootDivState {
  /** 現在表示している場所 */
  showDiv: 'Directory' | 'Html';

  /** htmlShow のデータ */
  htmlShowObject: {
    /** htmlShow のbody部分 */
    Body: string;
    /** htmlShow の目次部分 */
    TableOfContents: string;
  }
}

class RootDiv extends React.Component<{}, RootDivState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      htmlShowObject: {
        Body: '',
        TableOfContents: '',
      },
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
      htmlShowObject: {
        Body: dom.body.innerHTML,
        TableOfContents: domToC.innerHTML,
      },
      showDiv: 'Html',
    });
  };

  changeDivToDirectory = () => {
    this.setState({
      htmlShowObject : {
        Body : "",
        TableOfContents : "",
      },
      showDiv: 'Directory',
    });
  };

  showLicenseList = (text: string) => {
    this.changeDivToHtml(text, '');
  };

  render() {
    const { showDiv, htmlShowObject } = this.state;
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
              <HtmlShowDiv html={htmlShowObject.Body} tableOfContents={htmlShowObject.TableOfContents} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<RootDiv />, document.getElementById('root'));
