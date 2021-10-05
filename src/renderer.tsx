import React from 'react';
import ReactDOM from 'react-dom';
import { DirectoryShowDiv } from "./renderer/directoryShow";

class RootDiv extends React.Component<{}, {}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <div>
        <DirectoryShowDiv />
      </div>
    )
  }
}

ReactDOM.render(<RootDiv />, document.getElementById('root'));
