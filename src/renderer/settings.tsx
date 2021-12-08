import React from 'react';
import { SettingsDataList } from '../@types/connectionDataType';
import { DeletePopup, ShowPopup, ShowTemporaryPopup } from './popup';

interface SettingsState {
  settings: SettingsDataList;
}

export class HtmlSettings extends React.Component<{}, SettingsState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      settings: {
        emacsPath: '',
        pandocPath: '',
        author: '',
      },
    };
    this.loadSettings();
  }

  /**
   * 設定を読み込みます
   */
  loadSettings = async () => {
    const settings = await window.api.getSettings();
    console.log(settings);
    this.setState({
      settings: settings,
    });
  };

  handlePathToEmacsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { settings } = this.state;
    settings.emacsPath = e.target.value;
    this.setState({
      settings,
    });
  };

  handlePathToPandocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { settings } = this.state;
    settings.pandocPath = e.target.value;
    this.setState({
      settings,
    });
  };

  handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { settings } = this.state;
    settings.author = e.target.value;
    this.setState({
      settings,
    });
  };

  handleSubmit = async () => {
    const popupId = ShowTemporaryPopup('保存中...', ' ', 'info');
    const result = await window.api.setSettings(this.state.settings);
    DeletePopup(popupId);
    if (result.result === 'success') {
      ShowPopup('保存しました', ' ', 'info');
    } else {
      ShowPopup('保存に失敗しました', result.data, 'danger');
    }
  };

  render() {
    const { settings } = this.state;
    return (
      <div className="m-1">
        <h2>設定</h2>
        <div className="form-group">
          <div className="m-1">
            <label htmlFor="html-title">著者名(新規ファイル作成時に記述されます。)</label>
            <input
              type="text"
              className="form-control"
              id="author"
              value={settings.author}
              onChange={this.handleAuthorChange}
            />
          </div>
          <div className="m-1">
            <label htmlFor="html-title">Emacsのパス</label>
            <input
              type="text"
              className="form-control"
              id="path-to-emacs"
              value={settings.emacsPath}
              onChange={this.handlePathToEmacsChange}
            />
          </div>
          <div className="m-1">
            <label htmlFor="html-title">Pandocのパス</label>
            <input
              type="text"
              className="form-control"
              id="path-to-pandoc"
              value={settings.pandocPath}
              onChange={this.handlePathToPandocChange}
            />
          </div>
          <button type="button" className="btn btn-primary m-1" onClick={this.handleSubmit}>
            保存する
          </button>
          <button type="button" className="btn btn-primary m-1" onClick={this.loadSettings}>
            保存しない
          </button>
        </div>
      </div>
    );
  }
}
