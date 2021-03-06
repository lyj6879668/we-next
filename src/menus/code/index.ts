/**
 * @description 代码 菜单
 * @author lkw
 */

import PanelMenu from '../menu-constructors/PanelMenu'
import Editor from '../../editor/index'
import $ from '../../utils/dom-core'
import createPanelConf from './create-panel-conf'
import isActive from './is-active'
import Panel from '../menu-constructors/Panel'
import { MenuActive } from '../menu-constructors/Menu'
import bindEvent from './bind-event/index'

export function formatCodeHtml(editor: Editor, html: string) {
    let codeArr = editor.$textElem.elems[0].querySelectorAll('pre')
    for (let i = 0; i < codeArr.length; i++) {
        html = html.replace(
            codeArr[i].outerHTML,
            // @ts-ignore
            `<pre><code>${codeArr[i].getAttribute('text').replace(/&quot;/g, '"')}</code></pre>`
        )
    }

    return html
}

class Code extends PanelMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $('<div class="w-e-menu"><i class="w-e-icon-terminal"></i></div>')
        super($elem, editor)

        // 绑定事件，如点击链接时，可以查看链接
        bindEvent(editor)
    }

    /**
     * 插入行内代码
     * @param text
     * @return null
     */
    private insertLineCode(text: string) {
        let editor = this.editor
        // 行内代码处理
        let $code = $(`<code>${text}</code>`)
        editor.cmd.do('insertElem', $code)
        editor.selection.createRangeByElem($code, false)
        editor.selection.restoreSelection()
    }

    /**
     * 菜单点击事件
     */
    public clickHandler(): void {
        const editor = this.editor
        let $codeElem
        const selectionText = editor.selection.getSelectionText()

        if (this.isActive) {
            // 菜单被激活，说明选区在链接里
            const $code = editor.selection.getSelectionStartElem()
            const $preElem = $code?.getNodeTop(editor)
            const $codeElem = $code?.parentUntil('code')

            // @ts-ignore
            if (!($preElem.getNodeName() == 'PRE')) {
                if (editor.selection.isSelectionEmpty()) {
                    return
                }

                // 行内代码处理
                this.insertLineCode(selectionText)

                return
            }
            // 弹出 panel
            // @ts-ignore

            this.createPanel($preElem.attr('text'), $preElem.attr('type'))
        } else {
            // 菜单未被激活，说明选区不在链接里
            if (editor.selection.isSelectionEmpty()) {
                // 选区是空的，未选中内容
                this.createPanel('', '')
            } else {
                // 行内代码处理 选中了非代码内容
                this.insertLineCode(selectionText)
            }
        }
    }

    /**
     * 创建 panel
     * @param text 代码文本
     * @param languageType 代码类型
     */
    public createPanel(text: string, languageType: string): void {
        const conf = createPanelConf(this.editor, text, languageType)
        const panel = new Panel(this, conf)
        panel.create()

        this.setPanel(panel)
    }

    /**
     * 尝试修改菜单 active 状态
     */
    public tryChangeActive() {
        const editor = this.editor
        if (isActive(editor)) {
            this.active()
        } else {
            this.unActive()
        }
    }
}

export default Code
