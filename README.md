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

※インストールする前にsettingsを事前に完了する必要があります。

## github

- 右上「Releases」より、最新版のdmgファイルもしくはexeファイルをダウンロードします。

- インストール後、Applicationディレクトリにアプリを移動させます。

- MacOSの場合、初回起動時に「開発元を検証できないため開けません。」というポップが表示されるため、一度キャンセルを押し、以下のどちらかの手順で実行許可を出す必要があります。
  - 「システム環境設定」→「セキュリティとプライバシー」→「一般」→「ダウンロードしたアプリケーションの実行許可」から、
「“org_viewer_for_electron.app”は開発元を確認できないため、使用がブロックされました」の右にある「このまま開く」を押し、「開く」を選択。
  - Finderから起動する際に右クリック→「開く」→「“org_viewer_for_electron.app”の開発元を検証できません。開いてもよろしいですか?」から「開く」を選択。


# Versions

## v0.5.0

- changes
  - When displaying HTML, the code blocks are colored. Currently only css, diff, http, js, jsx, markup, python, ruby, sql, ts, tsx, are supported.
  - The English notation has been partially revised.

- known issue
  - HTML tag "a" does not work.
  - If you scroll and close a document, scrolling will continue when you open another document.

## v0.4.0

- add features
  - Added an item to display all files. This is because I have hidden all but the main files.
  - Added a list that allows you move up to higher level directory.
  - Added the ability to create new files.

- changes
  - Moved the edit and view buttons forward.
  - Change layout

- others
  - Package changed from x86_64 to Universal. and fix #1

## v0.3.0

- add features
  - Added display an error when the directory does not exist.
  - Added a table of contents on the right side when displaying HTML.
  - Added the license list.
  - Added update notifications.

- fix features
  - Fixed an issue where no error was displayed.
  - Fixed an issue where directories and filenames could not be displayed properly if they had symbols.

- known issue
  - HTML tag "a" does not work.
  - If you scroll and close a document, scrolling will continue when you open another document.

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
