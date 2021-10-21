import React from 'react';
import ReactDOM from 'react-dom';
import { DirectoryShowDiv } from './renderer/directoryShow';
import { HtmlShowDiv } from './renderer/htmlShow';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';
import './renderer.css';
import { OverMenuBar } from './renderer/overMenuBar';

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

/**
 * HTMLから見出しを生成します。
 * original by : https://www.marorika.com/entry/create-toc
 * @param dom 対象となるDocument。注意：該当するhタグにidが振らていない場合は自動的に振られます。
 */
function HTMLCreateTableOfContents(dom: Document): HTMLDivElement {
  const result = document.createElement('div'); // 作成する目次のコンテナ要素
  // .h1、h2、h3要素を全て取得する
  const matches = dom.querySelectorAll('h1, h2, h3');

  // 取得した見出しタグ要素の数だけ以下の操作を繰り返す
  matches.forEach(function (value, i) {
    // 見出しタグ要素のidを取得し空の場合は内容をidにする
    let id = value.id;
    if (id === '') {
      id = String(Math.random());
      value.id = id;
    }

    // 要素がh1タグの場合
    if (value.tagName === 'H1') {
      let ul = document.createElement('ul');
      let li = document.createElement('li');
      let a = document.createElement('a');

      // 追加する<ul><li><a>タイトル</a></li></ul>を準備する
      a.innerHTML = value.textContent ?? '';
      a.href = '#' + value.id;
      li.appendChild(a);
      ul.appendChild(li);

      // コンテナ要素である<div>の中に要素を追加する
      result.appendChild(ul);
    }

    // 要素がh2タグの場合
    if (value.tagName === 'H2') {
      let ul = document.createElement('ul');
      let li = document.createElement('li');
      let a = document.createElement('a');

      // コンテナ要素である<div>の中から最後の<li>を取得する。
      let lastUl = result.lastElementChild;
      let lastLi: Element | null;
      if (!lastUl) {
        let ul2 = document.createElement('ul');
        let li2 = document.createElement('li');
        ul2.appendChild(li2);
        result.appendChild(ul2);
        lastUl = ul;
      }
      lastLi = lastUl.lastElementChild;

      // 追加する<ul><li><a>タイトル</a></li></ul>を準備する
      a.innerHTML = value.textContent ?? '';
      a.href = '#' + value.id;
      li.appendChild(a);
      ul.appendChild(li);

      // 最後の<li>の中に要素を追加する
      lastLi?.appendChild(ul);
    }

    // 要素がh3タグの場合
    if (value.tagName === 'H3') {
      let ul = document.createElement('ul');
      let li = document.createElement('li');
      let a = document.createElement('a');

      // コンテナ要素である<div>の中から最後の<li>を取得する。
      let lastUl = result.lastElementChild;
      let lastLi: Element | null;
      if (!lastUl) {
        let ul2 = document.createElement('ul');
        let li2 = document.createElement('li');
        ul2.appendChild(li2);
        result.appendChild(ul2);
        lastUl = ul2;
      }
      lastLi = lastUl.lastElementChild;
      let last2Ul = lastLi?.lastElementChild;
      if (!last2Ul) {
        let ul3 = document.createElement('ul');
        let li3 = document.createElement('li');
        ul3.appendChild(li3);
        lastLi?.appendChild(ul3);
        last2Ul = ul3;
      }
      let last2Li = last2Ul?.lastElementChild;

      // 追加する<ul><li><a>タイトル</a></li></ul>を準備する
      a.innerHTML = value.textContent ?? '';
      a.href = '#' + value.id;
      li.appendChild(a);
      ul.appendChild(li);

      // 最後の<li>の中に要素を追加する
      last2Li?.appendChild(ul);
    }
  });

  return result;
}
