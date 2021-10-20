import React from 'react';
import { ArrowLeftCircle } from 'react-feather';

interface HtmlShowDivProps {
  html: string;
  tableOfContents: string;
  changeDivToDirectory: () => void;
}

export class HtmlShowDiv extends React.Component<HtmlShowDivProps, {}> {
  constructor(props: HtmlShowDivProps) {
    super(props);
  }
  render() {
    const { html, tableOfContents, changeDivToDirectory } = this.props;
    const backButtonCss: React.CSSProperties = {
      height: 50,
      width: 50,
      backgroundColor: 'white',
      position: 'fixed',
      top: 0,
    };
    return (
      <div>
        <div style={backButtonCss}>
          <ArrowLeftCircle
            className="border border-success"
            style={{ height: 50, width: 50 }}
            onClick={changeDivToDirectory}
          />
        </div>
        <div className="d-flex flex-row-reverse justify-content-start">
          <div
            id="htmlShow_tableOfContents"
            className="border border-primary m-1 p-1"
            dangerouslySetInnerHTML={{ __html: tableOfContents }}
          ></div>
          <div id="htmlShow_body" className="border border-info m-1 p-1 flex-grow-1">
            <div id="buttonBlank" style={{ height: 50 }}></div>
            <div id="htmlShow_main" dangerouslySetInnerHTML={{ __html: html }}></div>
          </div>
        </div>
      </div>
    );
  }
}
