import React from 'react';
import { ArrowLeftCircle } from 'react-feather';

interface HtmlShowDivProps {
  html: string;
  changeDivToDirectory: () => void;
}

export class HtmlShowDiv extends React.Component<HtmlShowDivProps, {}> {
  constructor(props: HtmlShowDivProps) {
    super(props);
  }
  render() {
    const { html, changeDivToDirectory } = this.props;
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
          <ArrowLeftCircle style={{ height: 50, width: 50 }} onClick={changeDivToDirectory} />
        </div>
        <div>
          <div id="buttonBlank" style={{ height: 50 }}></div>
          <div id="html" dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
      </div>
    );
  }
}
