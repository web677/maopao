import wepy from 'wepy'

export default class Toast extends wepy.mixin {

    static open(content){
        wx.showToast({
            title: content,
            icon: 'none'
        })
    }
}

