/**
 * HTML要素のリンク関係を編集します。
 * @param str
 * @param dirPath
 * @returns
 */
export async function HtmlLinkToAbsolutePath(dom: Document, dirPath: string): Promise<Document> {
  const awaitList = [];

  const hasHref = Array.from(dom.querySelectorAll('[href]'));
  awaitList.push(
    ...hasHref.map(async (a: any) => {
      // HTMLElementだと何してもa.hrefがエラー出たのでany
      if ('href' in a) {
        // a.href = await window.api.pathChangeFromRelativeToAbsolute(a.getAttribute('href'),dirPath); // ←後にこちらにする。
        a.href = 'javascript:void(0)';
      }
    })
  );

  const hasSrc = Array.from(dom.querySelectorAll<HTMLElement>('[src]'));
  awaitList.push(
    ...hasSrc.map(async (a: any) => {
      // HTMLElementだと何してもa.hrefがエラー出たのでany
      if ('src' in a) {
        a.src = await window.api.pathChangeFromRelativeToAbsolute(a.getAttribute('src'), dirPath);
      }
    })
  );

  await Promise.all(awaitList);

  return dom; // stringに戻す
}
