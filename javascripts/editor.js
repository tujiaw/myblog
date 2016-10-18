'use strict';

Bmob.initialize('2502557bee1e31ea45e57249bf843061', '736c73c4e575636f876b2cef0a2ee80e');
showTab('blog');

$('.nav-tabs>li a').click(function() {
    showTab($(this).attr('name'));
});

function onRankChanged(self) {
    showMusic($(self).attr('topid'));
    $('.musicList h3').text($(self).text());
}

function onPublishBlog(self) {
    $('.alert').css('display', 'none');
    var type = $('#type').find('option:selected').text();
    var title = $('#title').val();
    var content = window.myeditor.value();
    if (!(type.length > 0 && title.length > 0 && content.length > 0)) {
        $('.alert-warning').css('display', 'block');
        return;
    }

    var ContentObj = Bmob.Object.extend('Content');
    var contentObj = new ContentObj();
    var md = window.markdownit();
    contentObj.set('title', title);
    contentObj.set('url', '');
    contentObj.set('content', md.render(content));
    contentObj.set('type', type);
    contentObj.save(null);
    $('.alert-success').css('display', 'block');
}

function showTab(name) {
    if (name == 'blog') {
        $('.tabContent').html($('#blog').html());
        window.myeditor = new SimpleMDE({ element: $(".editor")[0] });
    } else if (name == 'music') {
        $('.tabContent').html($('#music').html());
        showMusic(5);
    }
}

function showMusic(topid) {
    var appParams = {topid: topid};
    $('.musicList tbody').html('');
    showapiRequest('http://route.showapi.com/213-4', 17262, appParams, function(json) {
        if (json.showapi_res_code == 0) {
            var pagebean = json.showapi_res_body.pagebean;
            var html;
            if (typeof(pagebean) != 'undefined' && pagebean && pagebean.songlist.length > 0) {
                pagebean.songlist.forEach(function(song) {
                    html = ejs.render($('.song').html(), {
                        songid: song.songid,
                        singername: song.singername,
                        songname: song.songname,
                        url: song.url
                    });
                    $('.musicList tbody').append(html);
                });
            }
        } else {
            alert(json.showapi_res_error);
        }
    });
}

function getSongInfo(songid) {
    var result = {};
    $('.songRow').each(function(e) {
        if ($(this).attr('songid') === songid) {
            result.songid = $(this).attr('songid');
            result.songname = $(this).attr('songname');
            result.singername = $(this).attr('singername');
            result.url = $(this).attr('url');
            return false;
        }
    });
    return result;
}

function onPlay(self) {
    var songid = $(self).attr('songid');
    $('.songRow').each(function(e) {
        if ($(this).attr('songid') === songid) {
            var info = getSongInfo(songid);
            if (!isObjEmpty(info)) {
                $('#musicPlay p').text(info.songname + ' - ' + info.singername);
                $('#musicPlay audio').attr('src', info.url);
                $('#musicPlay audio')[0].play();
            }
        }
    });
}

function onCollect(self) {
    var info = getSongInfo($(self).attr('songid'));
    bb.songCollect(info);
    $(self).find('span').attr('class', 'glyphicon glyphicon-star');
}