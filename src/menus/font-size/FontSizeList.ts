/**
 * @description 字号 class
 * @author lkw
 */
import $ from '../../utils/dom-core'
import { DropListItem } from '../menu-constructors/DropList'
import { DicType } from '../../config/index'

/**
 * FontSizeList 字号配置列表
 */
class FontSizeList {
    private itemList: DropListItem[]

    constructor(list: DicType) {
        this.itemList = []
        for (let key in list) {
            this.itemList.push({
                $elem: $(`<p style="font-size:${key}">${key}</p>`),
                value: list[key],
            })
        }
    }

    public getItemList(): DropListItem[] {
        return this.itemList
    }
}

export default FontSizeList
