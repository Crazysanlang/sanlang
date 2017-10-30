var app = getApp()
var util = require('../../utils/util.js')

Page({
    data: {
        corpName: '',
        depotItems: [],
        depotItemsData: [],
        alpha: '',
        windowHeight: 0
    },
    onLoad: function () {
        this.getDepotList()
        this.setData({ windowHeight: app.globalData.windowHeight })
    },
    getDepotList: function () {
        var that = this
        var params = { open_id: app.globalData.open_id, name: this.data.corpName };
        util.httpReq("/bases/getDepotList", params, "POST",
            function (result) {
                var data = result.data
                that.setData({ depotItems: data.entity, depotItemsData: data.entity })
            },
            function (result) {
                util.alert(app.globalData.failMsg);
            })
    },
    handlerAlphaTap(e) {
        let {ap} = e.target.dataset;
        this.setData({ alpha: ap });
    },
    handlerMove(e) {
        let {depotItems} = this.data;
        let moveY = e.touches[0].clientY;
        let rY = moveY - this.offsetTop;
        if (rY >= 0) {
            let index = Math.ceil((rY - this.apHeight) / this.apHeight);
            if (0 <= index < depotItems.length) {
                let nonwAp = depotItems[index];
                nonwAp && this.setData({ alpha: nonwAp.alphabet });
            }
        }
    },
    bindCorpName: function (e) {
        var corpName = e.detail.value;
        this.setData({ corpName: corpName })
        if (util.isEmpty(corpName))
            this.setData({ depotItems: this.data.depotItemsData });

        var depotItems = this.data.depotItemsData;
        if (depotItems == null)
            return;
        
        var depotItemsTemp = [];
        for(var i=0;i<depotItems.length;i++){
            var datas = depotItems[i].datas;
            if (datas == null || datas.length <= 0)
                continue;
            
            var alphabet = depotItems[i].alphabet;
            var datasTemp = [];
            for(var z=0;z<datas.length;z++){
                if (datas[z].corpName.indexOf(corpName) != -1)
                    datasTemp.push(datas[z]);
            }
            if (datasTemp != null && datasTemp.length > 0)
            {
                var temp = {};
                temp.alphabet = alphabet;
                temp.datas = datasTemp;
                depotItemsTemp.push(temp)
            }
        }
        this.setData({ depotItems: depotItemsTemp })
    },
    // 选择仓库
    selectDepot: function(e){
        app.globalData.baseDepotID = e.currentTarget.id;
        app.globalData.baseCorpName = e.currentTarget.dataset.name;
        wx.navigateBack()
    }

})
