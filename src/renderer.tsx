import React from 'react';
import ReactDOM from 'react-dom';
import { DirectoryData } from './@types/connectionDataType';

// interface IState {
//   value: string;
//   dirLists: DirectoryData[];
// }

// class DirectoryForm extends React.Component<{}, IState> {
//   constructor(props: {}) {
//     super(props);
//     this.state = { value: '', dirLists: [] };

//     this.handleChange = this.handleChange.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//   }

//   handleChange(event: React.ChangeEvent<HTMLInputElement>) {
//     this.setState({ value: event.target.value });
//   }

//   handleSubmit(event: React.FormEvent) {
//     event.preventDefault();
//     const { value } = this.state;
//     window.api.getDirectoryList(value, (dirList) => {
//       if (dirList) {
//         this.setState({ dirLists: dirList });
//       } else {
//         alert(`A name was not found:`);
//       }
//     });
//   }

//   render() {
//     const { value, dirLists } = this.state;
//     const domId = 'directory';
//     return (
//       <form onSubmit={this.handleSubmit}>
//         <label htmlFor={domId}>
//           Directory:
//           <input id={domId} type="text" value={value} onChange={this.handleChange} />
//         </label>
//         <input type="submit" value="Search" />
//         <br />
//         <ul>
//           {dirLists.map((dirName, i) => {
//             const colorStyle = {
//               color: 'black',
//             };
//             if (dirName.isDirectory) {
//               colorStyle.color = 'green';
//             } else if (dirName.extension === 'org') {
//               colorStyle.color = 'red';
//             }
//             return (
//               <li key={dirName.name} style={colorStyle}>
//                 {dirName.name}
//               </li>
//             );
//           })}
//         </ul>
//       </form>
//     );
//   }
// }

interface DirectoryShowListElementState {
  dirLists: DirectoryData[] | null;
}


class DirectoryShowListElement extends React.Component<DirectoryShowDivState, DirectoryShowListElementState> {

  constructor(props : DirectoryShowDivState){
    console.log(props);
    super(props);
    this.state = {
      dirLists : null
    };
  }

  async componentDidUpdate(prevProps : DirectoryShowDivState , prevState : DirectoryShowListElementState){
    const {dirName, level} = this.props;
    if(dirName != prevProps.dirName || level != prevProps.level){
      console.log(`called by ${dirName}`);
      if(level <= 0) return null;
      const dirLists : DirectoryData[] | null = await window.api.getDirectoryList(dirName);
      this.setState({dirLists});
    }
  }


  render(){
    const {dirName, level} = this.props;
    const {dirLists} = this.state;
    if(dirLists === null) return null;
    return(
      <ul>
      {dirLists.map((dirList, i) => {
        let needTree = false;
        const colorStyle = {
          color: 'black',
        };
        if (dirList.isDirectory) {
          colorStyle.color = 'green';
          needTree = true;
        } else if (dirList.extension === 'org') {
          colorStyle.color = 'red';
        }
        return(
        <li key={dirList.name} style={colorStyle}>
          {dirList.name}
          {needTree && <DirectoryShowListElement dirName={dirName + "/" + dirList.name} level={level - 1} />}
        </li>
        )
      })}
    </ul>
    )
  }
}

interface DirectoryShowSelectFormProps {
  dirName: string;
  level: number;
  handleDirNameChange: (dirName: string) => void;
  handleLevelChange: (level: number) => void;
}

class DirectoryShowSelectForm extends React.Component<DirectoryShowSelectFormProps, {}> {
  constructor(props: DirectoryShowSelectFormProps) {
    super(props);
  }

  handleDirectoryOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.handleDirNameChange(event.target.value);
  }

  handleLevelOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.handleLevelChange(Number(event.target.value));
  }

  handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  }

  render() {
    const {dirName,level} = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Directory:
          <input type="text" value={dirName} onChange={(e) => this.handleDirectoryOnChange(e)} />
        </label><br />
        <label>
          Directory Level:
          <input type="number" value={level} onChange={(e) => this.handleLevelOnChange(e)} />
        </label><br />
        <input type="submit" value="Search" /><br />
        </form>
    );
  }
}

interface DirectoryShowDivState {
  dirName: string;
  level: number;
}

class DirectoryShowDiv extends React.Component<{}, DirectoryShowDivState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      dirName: '',
      level: 1,
    };
  }

  handleDirNameChange = (dirName: string) => {
    this.setState({ dirName });
  }

  handleLevelChange = (level: number) => {
    this.setState({ level });
  }

  render() {
    const { dirName, level } = this.state;
    return (
      <div>
        <DirectoryShowSelectForm
          dirName={dirName}
          level={level}
          handleDirNameChange={this.handleDirNameChange}
          handleLevelChange={this.handleLevelChange}
        />
        <DirectoryShowListElement
          dirName={dirName}
          level={level}
        />
      </div>
    );
  }
}

ReactDOM.render(<DirectoryShowDiv />, document.getElementById('root'));
