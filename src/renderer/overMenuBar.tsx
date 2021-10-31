import React from 'react';
import { ArrowLeft } from 'react-feather';

interface OverMenuBarProps {
  type: 'Directory' | 'Html';
  changeDivToDirectory: () => void;
  handleOnlyDirNameChange: (dirName: string) => void;
  updateDirectoryShowObject: (
    newDirName: string | null,
    newLevel: number | null,
    newIsAll: number | null
  ) => void;
  /** ディレクトリ名 */
  dirName: string;
  /** ディレクトリ階層数 */
  level: number;
  /** ディレクトリ表示量 */
  isAll: number;
  /** 現在表示されているファイル名 */
  nowShowingFileName: string;
}

interface OverMenuBarState {
  /** inputエリアで変換途中かどうか */
  isInputComposition: boolean;
}

export class OverMenuBar extends React.Component<OverMenuBarProps, OverMenuBarState> {
  constructor(props: OverMenuBarProps) {
    super(props);
    this.state = {
      isInputComposition: false,
    };
  }

  /**
   * ディレクトリ名入力のカーソルが離れた時に実行し、表示するディレクトリを更新します。
   * @param dirName
   */
  handleDirectoryNameBlur = (dirName: string) => {
    const { updateDirectoryShowObject } = this.props;
    updateDirectoryShowObject(dirName, null, null);
  };

  /**
   * フォームに表示する「ディレクトリ名」をステートにセットし、表示を更新します。
   * @param dirName 表示するディレクトリ名
   */
  handleDirectoryNameChange = (dirName: string) => {
    const { handleOnlyDirNameChange } = this.props;
    handleOnlyDirNameChange(dirName);
  };

  /**
   * フォームに表示する「ディレクトリ階層数」をステートにセットし、表示を更新します。
   * @param level 表示するディレクトリ階層数
   */
  handleLevelChange = (level: string) => {
    const { updateDirectoryShowObject } = this.props;
    updateDirectoryShowObject(null, Number(level), null);
  };

  /**
   * フォームに表示する「全てのディレクトリを表示するか」をステートにセットし、表示を更新します。
   * @param isAll 全てのディレクトリを表示するか
   */
  handleIsAllChange = (isAll: string) => {
    const { updateDirectoryShowObject } = this.props;
    updateDirectoryShowObject(null, null, Number(isAll));
  };

  /**
   * submitを無効にするだけの関数です。
   * @param e
   */
  handleNoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  /**
   * エンターキーを押した時にカーソルが離れるようにします
   * @param e
   */
  handleInputBlurOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { isInputComposition } = this.state;
    if (!isInputComposition && e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  /**
   * 日本語入力の変換の開始を検知します。
   */
  handleCompositionStart = () => {
    this.setState({ isInputComposition: true });
  };

  /**
   * 日本語入力の変換の終了を検知します。
   */
  handleCompositionEnd = () => {
    this.setState({ isInputComposition: false });
  };

  render() {
    const { type, changeDivToDirectory, dirName, level, isAll, nowShowingFileName } = this.props;
    const styleMenuBarHeight: React.CSSProperties = {
      height: '40px',
    };
    return (
      <div className="">
        <div
          className="container-fluid bg-dark text-light d-flex fixed-top flex-row align-items-center"
          style={styleMenuBarHeight}
        >
          {type === 'Html' && (
            <>
              <ArrowLeft style={{ height: '25px' }} onClick={changeDivToDirectory} />
              <div className="m-1 flex-grow-1 text-end overflow-scroll">{nowShowingFileName}</div>
            </>
          )}
          {type === 'Directory' && (
            <>
              <div className="m-1 flex-grow-1">
                <input
                  className="bg-secondary text-light w-100"
                  type="text"
                  value={dirName}
                  onBlur={(e) => this.handleDirectoryNameBlur(e.target.value)}
                  onChange={(e) => this.handleDirectoryNameChange(e.target.value)}
                  onKeyDown={this.handleInputBlurOnEnter}
                  onCompositionStart={this.handleCompositionStart}
                  onCompositionEnd={this.handleCompositionEnd}
                />
              </div>
              <span className="text-light d-flex align-items-center">dir level : </span>
              <input
                className="m-1 bg-secondary text-light"
                style={{ width: '100px' }}
                type="number"
                value={level}
                onChange={(e) => this.handleLevelChange(e.target.value)}
              />
              <div className="m-1 d-flex align-items-center">
                <select
                  className="form-select form-select-sm"
                  id="inputGroupSelect01"
                  onChange={(e) => this.handleIsAllChange(e.target.value)}
                  defaultValue={isAll.toString()}
                >
                  <option value="1">Org files only</option>
                  <option value="2">With other files</option>
                  <option value="3">With dot files</option>
                </select>
              </div>
            </>
          )}
        </div>
        <div id="MenuBarBlank" style={styleMenuBarHeight}></div>
      </div>
    );
  }
}
