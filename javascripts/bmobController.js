'user strict';

Bmob.initialize('2502557bee1e31ea45e57249bf843061', '736c73c4e575636f876b2cef0a2ee80e');

function isObjEmpty(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}

var bb = {
    trackTitle: function(data) {
        if (!isObjEmpty(data)) {
            var ArticleHis = Bmob.Object.extend('ArticleHis');
            var articleHis = new ArticleHis();
            articleHis.set('title', data.title);
            articleHis.set('url', data.url);
            articleHis.save(null);
        }
    },
    getContentList: function(cb) {
        var Content = Bmob.Object.extend('Content');
        var query = new Bmob.Query(Content);
        query.limit(10);
        query.descending("createdAt");
        query.find({
            success: function(results) {
                for (var i=0; i<results.length; i++) {
                    var obj = results[i];
                    cb(0, {
                        'title': obj.get('title'),
                        'content': obj.get('content'),
                        'type': obj.get('type'),
                        'date': obj.createdAt
                    });
                }
            },
            error: function(error) {
                cb(1, '查询失败：' + error.code + ' ' + error.message);
            }
        });
    },
    songCollect: function(data) {
        if (!isObjEmpty(data)) {
            var Music = Bmob.Object.extend('Music');
            var music = new Music();
            music.set('songid', data.songid);
            music.set('songname', data.songname);
            music.set('singername', data.singername);
            music.set('url', data.url);
            music.save(null);

            var query = new Bmob.Query(Music);
            query.equalTo('songid', '1');
            query.limit(1);
            query.first({
                success: function(obj) {
                    obj.set('songname', data.songname);
                    obj.set('singername', data.singername);
                    obj.set('url', data.url);
                    obj.save();
                }
            });
        }
    },
    getSong: function(direction, cb) {
        var Music = Bmob.Object.extend('Music');
        var query = new Bmob.Query(Music);
        query.equalTo('songid', '1');
        query.limit(1);
        query.first({
            success: function(obj) {
                cb(0, {
                    songname: obj.get('songname'),
                    singername: obj.get('singername'),
                    url: obj.get('url')
                });
            },
            error: function(error) {
                cb(1, '获取歌曲失败，' + error.message);
            }
        });
    },
};
