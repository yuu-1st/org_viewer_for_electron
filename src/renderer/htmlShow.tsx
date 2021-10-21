import React from 'react';

interface HtmlShowDivProps {
  html: string;
  tableOfContents: string;
}

export class HtmlShowDiv extends React.Component<HtmlShowDivProps, {}> {
  constructor(props: HtmlShowDivProps) {
    super(props);
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
