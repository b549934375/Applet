
var postsData = require('../../data/post_data.js')

Page({
    data:{

    },
    onLoad:function(){
        this.setData({
            postList:postsData.postList
        });
    }
});
