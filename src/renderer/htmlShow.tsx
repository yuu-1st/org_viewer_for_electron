import React from 'react';
import Prism from 'prismjs';

// prismの言語読み取り。markup、css、 clike、javascriptはデフォルトで読み込まれます。
require('prismjs/components/prism-css');
require('prismjs/components/prism-diff');
require('prismjs/components/prism-http');
require('prismjs/components/prism-jsx');
require('prismjs/components/prism-markup');
require('prismjs/components/prism-python');
require('prismjs/components/prism-ruby');
require('prismjs/components/prism-sql');
require('prismjs/components/prism-tsx');
require('prismjs/components/prism-typescript');

// prismのプラグイン読み取り
require('prismjs/plugins/toolbar/prism-toolbar');
require('prismjs/plugins/show-language/prism-show-language');

interface HtmlShowDivProps {
  html: string;
  tableOfContents: string;
}

export class HtmlShowDiv extends React.Component<HtmlShowDivProps, {}> {
  constructor(props: HtmlShowDivProps) {
    super(props);
  }

  componentDidUpdate() {
    // You can call the Prism.js API here
    // Use setTimeout to push onto callback queue so it runs after the DOM is updated
    setTimeout(() => Prism.highlightAll(), 0);
  }

  render() {
    const { html, tableOfContents } = this.props;
    return (
      <div>
        <div className="d-flex flex-row-reverse justify-content-start">
          <div
            id="htmlShow_tableOfContents"
            className="border border-primary m-1 p-1"
            dangerouslySetInnerHTML={{ __html: tableOfContents }}
          ></div>
          <div id="htmlShow_body" className="border border-info m-1 p-1 flex-grow-1">
            <div id="htmlShow_main" dangerouslySetInnerHTML={{ __html: html }}></div>
          </div>
        </div>
      </div>
    );
  }
}
