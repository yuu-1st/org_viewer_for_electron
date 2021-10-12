# org_viewer_for_electron

# About

my_helpをGUIで操作するアプリケーション

# Features

## edit

- 編集したいorgファイルの編集ボタンを選択すると、GUI版のEmacsが起動し、編集できます。

## show

- 表示したいorgファイルの表示ボタンを選択すると、開きます。

# Settings

このアプリケーションを使用する場合、以下の前提アプリケーションが必要になります。
事前にインストールしてください。

## use mac

### GUI版のEmacsのインストール

- https://emacsformacosx.com にアクセスし、GUI版のEmacsをインストールします。

- インストール後、Applicationディレクトリにアプリを移動させます。

### .my_helpのインストール

- 注：Ruby(gem)がインストールされている必要があります。

- `% gem install my_help` を実行します。

### Pandocのインストール

- 注：homebrewがインストールされている必要があります。

- `% brew install pandoc` を実行します。

## use windows

- 現在、windows版には対応していません。

# Install

## github

- 右上「Releases」より、最新版のdmgファイルもしくはexeファイルをダウンロードします。

- インストール後、Applicationディレクトリにアプリを移動させます。

- MacOSの場合、初回起動時に「開発元を検証できないため開けません。」というポップが表示されるため、一度キャンセルを押し、
「システム環境設定」→「セキュリティとプライバシー」→「一般」→「ダウンロードしたアプリケーションの実行許可」から、
「使用がブロックされました」の右にある「このまま開く」を押し、実行許可を出す必要があります。

# Versions

## v0.2.0

- add features
  - Added for open org-mode in Application.

- add for settings
  - Pandoc is needed.

- known issue
  - HTML tag "a" does not work.
  - Even if there is an error, the error is not displayed.

## v0.1.0

- first pre_release
