import { ApiResultData } from '../@types/connectionDataType';
import fs from 'fs';
import { exec } from 'child_process';
import { ExecPathEscape } from './ExecPathEscape';
import { app } from 'electron';
import path from 'path';

/**
 * orgファイルをpandocを経由してHTML形式に変更します。
 * @param event
 * @param dirPath 変更するorgファイルの絶対パス
 * @returns dataはstring型
 */
export const FileChangeFromOrgToHTML = async (
  event: Electron.IpcMainInvokeEvent,
  dirPath: string
): Promise<ApiResultData> => {
  let result: ApiResultData;
  result = await new Promise((resolve, reject) => {
    if (fs.existsSync(dirPath) && dirPath.split('.').slice(-1)[0] === 'org') {
      // pandocに使うフィルターが存在するか確認
      if (!HasPandocLuaFilter()) {
        setPandocLuaFilter();
      }
      exec(
        `/usr/local/bin/pandoc --lua-filter "${ExecPathEscape(
          getPandocLuaFilterPath()
        )}" -f org -t html "${ExecPathEscape(dirPath)}"`,
        (err, stdout, stderr) => {
          if (err) {
            resolve({ result: 'error', data: stderr });
          } else {
            resolve({ result: 'success', data: stdout });
          }
        }
      );
    } else {
      reject('エラー：ファイルがありません。');
    }
  });
  return result;
};

/**
 * pandoc用のフィルターの保存先を取得します。
 * @returns
 */
function getPandocLuaFilterPath(): string {
  return path.join(app.getPath('userData'), '/pandoc_filter_standard_code.lua');
}

/**
 * pandoc用のフィルターが存在するか確認します。
 * @returns
 */
function HasPandocLuaFilter(): boolean {
  return fs.existsSync(getPandocLuaFilterPath());
}

/**
 * pandoc用のフィルターをgetPandocLuaFilterPathで指定したファイルに保存します。
 */
function setPandocLuaFilter(): void {
  fs.writeFile(getPandocLuaFilterPath(), PandocLuaFilter(), (err) => {
    if (err) throw err;
    console.log('wrote.');
  });
}

/**
 * original by https://github.com/averms/pandoc-filters/blob/master/src/standard-code.lua
 * pandocで変換したHTML内に存在するcodeブロックを、Prism.jsが対応できるようなフォーマットに変更するフィルター
 * を作成するフィルターファイルの中身です。
 * @returns
 */
function PandocLuaFilter(): string {
  return `
-- original by https://github.com/averms/pandoc-filters

--[[
  Copyright © 2018-2020 Aman Verma

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

The Software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the Software or the use or other dealings in the Software.
]]
--- standard-code: ouput code blocks with class="language-*" attributes
-- © 2020 Aman Verma. Distributed under the MIT license.

local languages = {meta = true,markup = true,css = true,clike = true,javascript = true,abap = true,abnf = true,actionscript = true,ada = true,agda = true,al = true,antlr4 = true,apacheconf = true,apl = true,applescript = true,aql = true,arduino = true,arff = true,asciidoc = true,aspnet = true,asm6502 = true,autohotkey = true,autoit = true,bash = true,basic = true,batch = true,bbcode = true,bison = true,bnf = true,brainfuck = true,brightscript = true,bro = true,bsl = true,c = true,csharp = true,cpp = true,cil = true,clojure = true,cmake = true,coffeescript = true,concurnas = true,csp = true,crystal = true,['css-extras'] = true,cypher = true,d = true,dart = true,dax = true,dhall = true,diff = true,django = true,['dns-zone-file'] = true,docker = true,ebnf = true,editorconfig = true,eiffel = true,ejs = true,elixir = true,elm = true,etlua = true,erb = true,erlang = true,['excel-formula'] = true,fsharp = true,factor = true,['firestore-security-rules'] = true,flow = true,fortran = true,ftl = true,gml = true,gcode = true,gdscript = true,gedcom = true,gherkin = true,git = true,glsl = true,go = true,graphql = true,groovy = true,haml = true,html = true,handlebars = true,haskell = true,haxe = true,hcl = true,hlsl = true,http = true,hpkp = true,hsts = true,ichigojam = true,icon = true,ignore = true,inform7 = true,ini = true,io = true,j = true,java = true,javadoc = true,javadoclike = true,javastacktrace = true,jolie = true,jq = true,jsdoc = true,['js-extras'] = true,json = true,json5 = true,jsonp = true,jsstacktrace = true,['js-templates'] = true,julia = true,keyman = true,kotlin = true,latex = true,latte = true,less = true,lilypond = true,liquid = true,lisp = true,livescript = true,llvm = true,lolcode = true,lua = true,makefile = true,markdown = true,['markup-templating'] = true,matlab = true,mel = true,mizar = true,mongodb = true,monkey = true,moonscript = true,n1ql = true,n4js = true,['nand2tetris-hdl'] = true,naniscript = true,nasm = true,neon = true,nginx = true,nim = true,nix = true,nsis = true,objectivec = true,ocaml = true,opencl = true,oz = true,parigp = true,parser = true,pascal = true,pascaligo = true,pcaxis = true,peoplecode = true,perl = true,php = true,phpdoc = true,['php-extras'] = true,plsql = true,powerquery = true,powershell = true,processing = true,prolog = true,properties = true,protobuf = true,pug = true,puppet = true,pure = true,purebasic = true,purescript = true,python = true,q = true,qml = true,qore = true,r = true,racket = true,jsx = true,tsx = true,reason = true,regex = true,renpy = true,rest = true,rip = true,roboconf = true,robotframework = true,ruby = true,rust = true,sas = true,sass = true,scss = true,scala = true,scheme = true,['shell-session'] = true,smali = true,smalltalk = true,smarty = true,solidity = true,['solution-file'] = true,soy = true,sparql = true,['splunk-spl'] = true,sqf = true,sql = true,stan = true,iecst = true,stylus = true,swift = true,['t4-templating'] = true,['t4-cs'] = true,['t4-vb'] = true,tap = true,tcl = true,tt2 = true,textile = true,toml = true,turtle = true,twig = true,typescript = true,typoscript = true,unrealscript = true,vala = true,vbnet = true,velocity = true,verilog = true,vhdl = true,vim = true,['visual-basic'] = true,warpscript = true,wasm = true,wiki = true,xeora = true,['xml-doc'] = true,xojo = true,xquery = true,yaml = true,yang = true,zig = true}


local function escape(s)
  -- Escape according to HTML 5 rules
  return s:gsub(
    [=[[<>&"']]=],
    function(x)
      if x == '<' then
        return '&lt;'
      elseif x == '>' then
        return '&gt;'
      elseif x == '&' then
        return '&amp;'
      elseif x == '"' then
        return '&quot;'
      elseif x == "'" then
        return '&#39;'
      else
        return x
      end
    end
  )
end

local function getCodeClass(classes)
  -- Check if the first element of classes (pandoc.CodeBlock.classes) matches a
  -- programming language name. If it does, it gets removed from classes and a valid
  -- HTML class attribute string (with space at beginning) is returned.

  if languages[classes[1]] then
    return ' class="language-' .. table.remove(classes, 1) .. '"'
  else
    return ''
  end
end

local function makeIdentifier(ident)
  -- Returns a valid HTML id attribute (with space at beginning) OR empty string.

  if #ident ~= 0 then
    return ' id="'.. ident .. '"'
  else
    return ''
  end
end

local function makeClasses(classes)
  -- Returns a valid HTML class attribute with classes separated by spaces (with a space
  -- at the beginning) OR empty string.

  if #classes ~= 0 then
    return ' class="' .. table.concat(classes, ' ') .. '"'
  else
    return ''
  end
end

return {
  {
    CodeBlock = function(elem)
      if FORMAT ~= 'html' then
        return nil
      end

      id = makeIdentifier(elem.identifier)
      classLang = getCodeClass(elem.classes)
      classReg = makeClasses(elem.classes)

      local preCode = string.format(
        '<pre%s%s><code%s>%s</code></pre>', id, classReg, classLang, escape(elem.text)
      )
      return pandoc.RawBlock('html', preCode, 'RawBlock')
    end,

  }
}
  `;
}
