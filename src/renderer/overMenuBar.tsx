import React from 'react';
import { ArrowLeft, ArrowLeftCircle } from 'react-feather';

interface OverMenuBarProps {
  type: 'Directory' | 'Html';
  changeDivToDirectory: () => void;
}

export class OverMenuBar extends React.Component<OverMenuBarProps, {}> {
  constructor(props: OverMenuBarProps) {
    super(props);
  }
  render() {
    const { type, changeDivToDirectory } = this.props;
    return (
      <>
        <div className="container-fluid bg-dark text-light fixed-top" style={{ height: '30px' }}>
          {type === 'Html' && (
            <ArrowLeft style={{ height: '25px' }} onClick={changeDivToDirectory} />
          )}
          {type === 'Directory' && ' '}
        </div>
        <div style={{ height: '30px' }}></div>
      </>
    );
  }
}
