
var postsData = require('../../../data/post_data.js');
var app = getApp();
Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (options) {
        var postId = options.id;
        this.setData({
            postId: postId
        });
        var thisData = postsData.postList[postId];
        this.setData({
            dataDetail: thisData
        });
        // this.data.dataDetail = thisData;
        var postsCollected = wx.getStorageSync('posts_collected');
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            this.setData({
                collected: postCollected
            });
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            console.log(postsCollected);
            wx.setStorageSync('posts_collected', postsCollected)
        };
        if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId
            === postId) {
            this.setData({
                isPlayingMusic: true
            })
        }
        this.setMusicMonitor();
    },
    setMusicMonitor: function (event) {
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            });
            app.globalData.g_isPlayingMusic = true;
            app.globalData.g_currentMusicPostId = that.data.postId;
        })
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            });
            app.globalData.g_isPlayingMusic = false;
            app.globalData.g_currentMusicPostId = null;
        });
        wx.onBackgroundAudioStop(function () {
            that.setData({
                isPlayingMusic: false
            })
            app.globalData.g_isPlayingMusic = false;
            // app.globalData.g_currentMusicPostId = null;
        });
    },
    onColletionTap: function (event) {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.postId];
        postCollected = !postCollected;
        postsCollected[this.data.postId] = postCollected;
        wx.setStorageSync('posts_collected', postsCollected);
        this.setData({
            collected: postCollected
        });
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消收藏",
            duration: 1000,
            icon: "success"
        });
    },
    onShareTap: function (event) {
        var actionList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享到QQ空间",
            "分享到微博"
        ];
        wx.showActionSheet({
            itemList: actionList,
            itemColor: "#405f80",
            success: function (res) {
                // res.cancel 用户是不是点击了取消按钮
                // res.tapIndex 数组元素的序号，从0开始
                wx.showModal({
                    title: "用户 " + actionList[res.tapIndex],
                    content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
                })
                console.log(res.cancel);
            }
        })
    },
    onMusicTap: function (event) {
        var isPlayingMusic = this.data.isPlayingMusic;
        var currentPostId = this.data.postId;
        var postData = postsData.postList[currentPostId];
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            });
        } else {
            var _this = this;
            wx.playBackgroundAudio({
                dataUrl: postData.music.url,
                title: postData.music.title,
                coverImgUrl: postData.music.coverImg,
                success: function (res) {
                    _this.setData({
                        isPlayingMusic: true
                    });
                }
            })
        };

    }
})