/**
 * HTMLから見出しを生成します。
 * original by : https://www.marorika.com/entry/create-toc
 * @param dom 対象となるDocument。注意：該当するhタグにidが振らていない場合は自動的に振られます。
 */
export function HTMLCreateTableOfContents(dom: Document): HTMLDivElement {
  const result = document.createElement('div'); // 作成する目次のコンテナ要素
  // .h1、h2、h3要素を全て取得する
  const matches = dom.querySelectorAll('h1, h2, h3');

  // 取得した見出しタグ要素の数だけ以下の操作を繰り返す
  matches.forEach(function (value, i) {
    // 見出しタグ要素のidを取得し空の場合は内容をidにする
    let id = value.id;
    if (id === '') {
      id = String(Math.random());
      value.id = id;
    }

    // 要素がh1タグの場合
    if (value.tagName === 'H1') {
      let ul = document.createElement('ul');
      let li = document.createElement('li');
      let a = document.createElement('a');

      // 追加する<ul><li><a>タイトル</a></li></ul>を準備する
      a.textContent = value.textContent ?? '';
      a.href = '#' + value.id;
      li.appendChild(a);
      ul.appendChild(li);

      // コンテナ要素である<div>の中に要素を追加する
      result.appendChild(ul);
    }

    // 要素がh2タグの場合
    if (value.tagName === 'H2') {
      let ul = document.createElement('ul');
      let li = document.createElement('li');
      let a = document.createElement('a');

      // コンテナ要素である<div>の中から最後の<li>を取得する。
      let lastUl = result.lastElementChild;
      let lastLi: Element | null;
      if (!lastUl) {
        let ul2 = document.createElement('ul');
        let li2 = document.createElement('li');
        ul2.appendChild(li2);
        result.appendChild(ul2);
        lastUl = ul;
      }
      lastLi = lastUl.lastElementChild;

      // 追加する<ul><li><a>タイトル</a></li></ul>を準備する
      a.textContent = value.textContent ?? '';
      a.href = '#' + value.id;
      li.appendChild(a);
      ul.appendChild(li);

      // 最後の<li>の中に要素を追加する
      lastLi?.appendChild(ul);
    }

    // 要素がh3タグの場合
    if (value.tagName === 'H3') {
      let ul = document.createElement('ul');
      let li = document.createElement('li');
      let a = document.createElement('a');

      // コンテナ要素である<div>の中から最後の<li>を取得する。
      let lastUl = result.lastElementChild;
      let lastLi: Element | null;
      if (!lastUl) {
        let ul2 = document.createElement('ul');
        let li2 = document.createElement('li');
        ul2.appendChild(li2);
        result.appendChild(ul2);
        lastUl = ul2;
      }
      lastLi = lastUl.lastElementChild;
      let last2Ul = lastLi?.lastElementChild;
      if (!last2Ul) {
        let ul3 = document.createElement('ul');
        let li3 = document.createElement('li');
        ul3.appendChild(li3);
        lastLi?.appendChild(ul3);
        last2Ul = ul3;
      }
      let last2Li = last2Ul?.lastElementChild;

      // 追加する<ul><li><a>タイトル</a></li></ul>を準備する
      a.textContent = value.textContent ?? '';
      a.href = '#' + value.id;
      li.appendChild(a);
      ul.appendChild(li);

      // 最後の<li>の中に要素を追加する
      last2Li?.appendChild(ul);
    }
  });

  return result;
}
