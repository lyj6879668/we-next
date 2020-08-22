/**
 * @description code 菜单 panel tab 配置
 * @author lkw
 */

import editor from '../../editor/index'
import { PanelConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $, { DomElement } from '../../utils/dom-core'
import isActive from './is-active'

export default function (editor: editor, text: string, languageType: string): PanelConf {
    // panel 中需要用到的id
    const codeId = getRandom('code')
    const inputIFrameId = getRandom('input-iframe')
    const languageId = getRandom('select')
    const inputCodeId = getRandom('input-code')
    const inputTextId = getRandom('input-text')
    const btnOkId = getRandom('btn-ok')

    /**
     * 插入链接
     * @param text 文字
     * @param code 链接
     */
    function insertCode(text: string): void {
        // 选区处于链接中，则选中整个菜单，再执行 insertHTML
        if (isActive(editor)) {
            selectCodeElem()

            //删除代码 document.command命令
            // editor.cmd.do('delete')
            // editor.cmd.do('delete')
        }

        // editor.cmd.do('insertHTML', `<a href="${code}" target="_blank">${text}</a>`)

        editor.cmd.do('insertHTML', text)

        let p = document.createElement('p')
        p.appendChild(document.createElement('br'))

        // @ts-ignore
        editor.$textContainerElem.elems[0].querySelector('.w-e-text').appendChild(p)

        editor.selection.createRangeByElem($(p))

        // editor.cmd.do('insertHTML', '<p><br></p>')
    }

    /**
     * 选中整个链接元素
     */
    function selectCodeElem(): void {
        if (!isActive(editor)) return

        let $selectedCode: DomElement

        const $code = editor.selection.getSelectionStartElem()
        const $codeElem = $code?.getNodeTop(editor)
        if (!$codeElem) return

        editor.selection.createRangeByElem($codeElem)
        editor.selection.restoreSelection()

        $selectedCode = $codeElem // 赋值给函数内全局变量
    }

    // @ts-ignore
    const conf = {
        width: 400,
        height: 0,

        // panel 中可包含多个 tab
        tabs: [
            {
                // tab 的标题
                title: '插入代码',
                // 模板
                tpl: `<div>
                        <select name="" id="${languageId}">
                            ${editor.config.languageType.map(language => {
                                return (
                                    '<option ' +
                                    (languageType == language ? 'selected' : '') +
                                    ' value ="' +
                                    language +
                                    '">' +
                                    language +
                                    '</option>'
                                )
                            })}
                        </select>
                        <br><br>
                        <textarea contenteditable='true' id="${inputIFrameId}" type="text" class="block" placeholder="" style="height: 200px">${text.replace(
                    /&quot;/g,
                    '"'
                )}</textarea>
                        <div class="w-e-button-container">
                            <button id="${btnOkId}" class="right">${
                    isActive(editor) ? '修改' : '插入'
                }</button>
                        </div>
                    </div>`,
                // 事件绑定
                events: [
                    // 插入链接
                    {
                        selector: '#' + btnOkId,
                        type: 'click',
                        fn: () => {
                            let formatCode, codeDom
                            // 执行插入视频
                            // const $code = $('#' + inputIFrameId)
                            const $code = document.getElementById(inputIFrameId)
                            const $select = $('#' + languageId)

                            let languageType = $select.val()
                            // @ts-ignore
                            let code = $code.value

                            // 高亮渲染
                            if (editor.highlight) {
                                formatCode = editor.highlight.highlightAuto(code).value
                            } else {
                                formatCode = code
                            }

                            // 代码为空，则不插入
                            if (!code) return

                            //增加标签
                            if (isActive(editor)) {
                                const $code = editor.selection.getSelectionStartElem()
                                const $codeElem = $code?.getNodeTop(editor)

                                codeDom = formatCode

                                // @ts-ignore
                                $codeElem.attr('id', codeId)
                                // @ts-ignore
                                $codeElem.attr('text', code.replace(/"/g, '&quot;'))
                                // @ts-ignore
                                $codeElem.attr('type', languageType)

                                // @ts-ignore
                                insertCode(codeDom)

                                editor.cmd.do('insertHTML', '<p><br></p>')
                            } else {
                                //增加pre标签
                                codeDom = `<pre id="${codeId}" text="${code.replace(
                                    /"/g,
                                    '&quot;'
                                )}" type="${languageType}"><code>${formatCode}</code></pre>`

                                // @ts-ignore
                                insertCode(codeDom)
                            }

                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true
                        },
                    },
                ],
            }, // tab end
        ], // tabs end
    }

    return conf
}