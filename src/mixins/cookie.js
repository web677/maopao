import wepy from 'wepy'

export default class Cookie extends wepy.mixin {
    static expiresKey = 'STORAGE_KEYS'

    static getExpires(){
        try{
            return wx.getStorageSync(this.expiresKey) || {}
        }catch (e) {
            return {}
        }
    }

    static remove(key){
        wx.removeStorage({
            key: key,
            success: res => {
                this.storeExpires(key, 0)
            }
        })
    }

    static storeExpires(key, expires){
        let _this = this
        let _temp = {}
        _temp[key] = expires
        let _keysAndExpires = Object.assign(this.getExpires(), _temp)

        if (expires === 0){
            delete _keysAndExpires[key]
        }

        return new Promise((resolve, reject) => {
            wx.setStorage({
                key: _this.expiresKey,
                data: _keysAndExpires,
                success: data => resolve(data),
                fail: error => reject(error)
            })
        })
    }

    static set(key, value, expires){
        let _this = this
        return new Promise((resolve, reject) => {
            wx.setStorage({
                key: key,
                data: value,
                success: data => {
                    _this.storeExpires(key, Date.now() + expires * 24 * 60 * 60 * 1000)
                        .then( data => resolve(data) )
                        .catch( error => reject(error) )
                },
                fail: error => reject(error)
            })
        })
    }

    static get(key){
        try {
            return wx.getStorageSync(key) || ''
        }catch (e) {
            return ''
        }
    }

    static clear(key){
        if(!key){
            wx.clearStorage()
            return
        }

        this.remove(key)
    }

    static clean(){
        let _expires = this.getExpires()
        let _this = this
        if (_expires != {}){
            Object.keys(_expires).forEach(key => {
                if (_expires[key] - Date.now() <= 0){
                    _this.remove(key)
                }
            })
        }
    }
}