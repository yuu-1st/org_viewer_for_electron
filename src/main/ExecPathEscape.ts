
/**
 * execコマンド内に使用するパスをエスケープします。
 * @param dirPath 対象となる文字列
 * @returns
 */
export function ExecPathEscape(dirPath : string) : string {
  let result = dirPath.replace(/\\/g, "\\\\"); // \ -> \\
  result = result.replace(/"/g, "\\\""); // " -> \"
  result = result.replace(/!/g, "\"'\!'\""); // ! -> \!
  result = `"${result}"`; // path -> "path"
  console.log(result);
  return result;
}