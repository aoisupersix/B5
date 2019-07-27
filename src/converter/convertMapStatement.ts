import * as Enumerable from 'linq'

import * as mapDef from '../definition/iMapDefinition'
import { IMapStatement } from '../definition/iMapStatement'
import { convertArguments } from './convertArgument';
import { IArgumentPattern } from '../definition/iArgumentPattern';
import { IArgument } from '../definition/iArgument';
import { isMapVersion1, isMapVersion2 } from '../common/mapVersionDetecter';

/**
 * マップ構文定義から必要な情報を付加したIMapStatementを返します。
 * @param mapDefinition マップ構文定義(yaml)
 */
export const convertMapStatemnet = (mapDefinition: mapDef.IMapDefinition): IMapStatement => {
  const statement: IMapStatement = <any>mapDefinition

  // 種別判定
  statement.syntax1 = mapDef.isSyntax1(mapDefinition)
  statement.syntax2 = mapDef.isSyntax2(mapDefinition)
  statement.syntax3 = mapDef.isSyntax3(mapDefinition)
  statement.nofunc = !mapDef.hasFunc(mapDefinition)
  statement.noarg = !mapDef.hasArg(mapDefinition)

  // 小文字
  statement.elem_lower = mapDefinition.elem.toLowerCase()
  if (mapDef.hasSubElem(mapDefinition)) {
    statement.sub_elem_lower = mapDefinition.sub_elem!.toLowerCase()
  }
  if (mapDef.hasFunc(mapDefinition)) {
    statement.func_lower = mapDefinition.func!.toLowerCase()
  }

  // 引数変換
  const args = convertArguments(mapDefinition.args)
  statement.args = args

  // 引数パターン生成
  statement.argPattern = createArgPatterns(mapDefinition, args)

  return statement
}

/**
 * 引数に与えられたマップ構文のバージョン、argPatternsごとのArgumentPatternを生成します。
 * @param mapDefinition マップ構文定義
 * @param targetArguments 構文がとり得る引数
 */
const createArgPatterns = (mapDefinition: mapDef.IMapDefinition, targetArguments: IArgument[]): IArgumentPattern[] => {
  // 引数なし
  if (mapDefinition.argPatterns === undefined) {
    return []
  }

  const patterns = Enumerable.from(mapDefinition.versions).selectMany((version) => {
    if (mapDefinition.argPatterns.length === 0) {
      return [createArgPattern('', version, targetArguments)]
    }

    return mapDefinition.argPatterns.map(argPattern => createArgPattern(argPattern, version, targetArguments))
  })

  return patterns.toArray()
}

/**
 * ArgumentPatternを生成します。
 * @param patternString 引数名のカンマ区切り
 * @param version 使用するマップファイルバージョン
 * @param targetArguments 構文がとり得る引数
 */
const createArgPattern = (patternString: string, version: string, targetArguments: IArgument[]): IArgumentPattern => {
  const args = patternString
      .trim()
      .split(',')
      .filter(argName => argName !== '')
      .map((argName) => {
        const targets = targetArguments.filter(arg => arg.name.toLowerCase() === argName.toLowerCase())
        //#region 例外処理
        // TODO: Errorクラスの作成
        if (targets.length < 1) {
          console.error(`No matching argument was found. Argument name: ${argName}`)
        }
        if (targets.length > 1) {
          const matchingArgNames = targets.reduce((prev, current) => `${prev}, ${current.name}`, '')
          console.error(
            `Argument name: ${argName} can not be uniquely identified. Maching arguments: ${matchingArgNames}`)
        }
        //#endregion 例外処理
        const arg = Object.assign({}, targets[0])
        arg.last = false
        return arg
      })

  if (args.length > 0) {
    Enumerable.from(args).lastOrDefault(undefined).last = true
  }

  return {
    args: args,
    version: version,
    useV1Parser: isMapVersion1(version),
    useV2Parser: isMapVersion2(version),
  }
}
