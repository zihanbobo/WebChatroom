function setUserInfo() {
    $.ajax({
        type: 'POST',
        url: 'chatroom/get_userinfo',
        dataType: 'json',
        async: true,
        success: function (data) {
            console.log("获取用户信息...");
            if (data.status == 200) {
                var userInfo = data.data.userInfo;
                userId = userInfo.userId;
                $("#userName").html(userInfo.userName);
                $("#userIcon").attr("src", userInfo.userIcon);
                var groupListHTML = "";
                var groupList = userInfo.groups;
                for (var i = 0; i < groupList.length; i++) {
                    groupListHTML +=
                        '<li>' +
                        '<div class="liLeft"><img src="' + groupList[i].groupIcon + '"></div>' +
                        '<div class="liRight">' +
                        '<span class="hidden-groupId">' + groupList[i].groupId + '</span>' +
                        '<span class="intername">' + groupList[i].groupName + '</span>' +
                        '<span class="infor"></span>' +
                        '</div>' +
                        '</li>';
                }
                $('.conLeft ul').append(groupListHTML);

                var friendListHTML = "";
                var friendList = userInfo.fridents;
                for (var i = 0; i < friendList.length; i++) {
                    friendListHTML +=
                        '<li>' +
                        '<div class="liLeft"><img src="' + friendList[i].userIcon + '"></div>' +
                        '<div class="liRight">' +
                        '<span class="hidden-userId">' + friendList[i].userId + '</span>' +
                        '<span class="intername">' + friendList[i].userName + '</span>' +
                        '<span class="infor"></span>' +
                        '</div>' +
                        '</li>';
                }
                // 设置好友列表
                $('.conLeft ul').append(friendListHTML);
                // 绑定好友框点击事件
                $('.conLeft ul li').on('click', friendLiClickEvent);
            } else {
                alert(data.msg);
            }
            setSentMessageMap(groupList, friendList);
        }
    });
}

Date.prototype.format = function (format) {
    var args = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var i in args) {
        var n = args[i];
        if (new RegExp("(" + i + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
    }
    return format;

};

function setSentMessageMap(groupList, friendList) {
    sentMessageMap = new SentMessageMap();
    for (var i = 0; i < groupList.length; i++) {
        sentMessageMap.put(groupList[i].groupId, new Array());
    }
    for (var i = 0; i < friendList.length; i++) {
        sentMessageMap.put(friendList[i].userId, new Array());
    }
}


var ws = {
    register: function () {
        if (!window.WebSocket) {
            return;
        }
        if (socket.readyState == WebSocket.OPEN) {
            var data = {
                "userId": userId,
                "type": "REGISTER"
            };
            socket.send(JSON.stringify(data));
        } else {
            alert("Websocket连接没有开启！");
        }
    },

    singleSend: function (fromUserId, toUserId, content) {
        if (!window.WebSocket) {
            return;
        }
        if (socket.readyState == WebSocket.OPEN) {
            var data = {
                "fromUserId": fromUserId,
                "toUserId": toUserId,
                "content": content,
                "type": "SINGLE_SENDING"
            };
            socket.send(JSON.stringify(data));
        } else {
            alert("Websocket连接没有开启！");
        }
    },

    groupSend: function (fromUserId, toGroupId, content) {
        if (!window.WebSocket) {
            return;
        }
        if (socket.readyState == WebSocket.OPEN) {
            var data = {
                "fromUserId": fromUserId,
                "toGroupId": toGroupId,
                "content": content,
                "type": "GROUP_SENDING"
            };
            socket.send(JSON.stringify(data));
        } else {
            alert("Websocket连接没有开启！");
        }
    },

    fileMsgSingleSend: function (fromUserId, toUserId, originalFilename, fileUrl, fileSize) {
        if (!window.WebSocket) {
            return;
        }
        if (socket.readyState == WebSocket.OPEN) {
            var data = {
                "fromUserId": fromUserId,
                "toUserId": toUserId,
                "originalFilename": originalFilename,
                "fileUrl": fileUrl,
                "fileSize": fileSize,
                "type": "FILE_MSG_SINGLE_SENDING"
            };
            socket.send(JSON.stringify(data));
        } else {
            alert("Websocket连接没有开启！");
        }
    },

    fileMsgGroupSend: function (fromUserId, toGroupId, originalFilename, fileUrl, fileSize) {
        if (!window.WebSocket) {
            return;
        }
        if (socket.readyState == WebSocket.OPEN) {
            var data = {
                "fromUserId": fromUserId,
                "toGroupId": toGroupId,
                "originalFilename": originalFilename,
                "fileUrl": fileUrl,
                "fileSize": fileSize,
                "type": "FILE_MSG_GROUP_SENDING"
            };
            socket.send(JSON.stringify(data));
        } else {
            alert("Websocket连接没有开启！");
        }
    },

    registerReceive: function () {
        console.log("userId为 " + userId + " 的用户登记到在线用户表成功！");
    },

    singleReceive: function (data) {
        // 获取、构造参数
        console.log(data);
        var fromUserId = data.fromUserId;
        var toUserId = data.toUserId;
        var fromUserName = data.fromUserName;
        var sendTime = data.sendTime;
        var content = data.content;
        var fromAvatarUrl;
        var $receiveLi;
        $('.conLeft').find('span.hidden-userId').each(function () {
            if (this.innerHTML == fromUserId) {
                fromAvatarUrl = $(this).parent(".liRight")
                    .siblings(".liLeft").children('img').attr("src");
                $receiveLi = $(this).parent(".liRight").parent("li");
            }
        })
        var answer = '';
        //自己发送的消息
        if (fromUserId === userId) {
            //     // alert(content);
            //     answer += '<li>' +
            //         '<div class="answers">' + content + '</div>' +
            //         '<div class="answerHead"><img src="' + $("#userIcon").attr('src') + '"/></div>' +
            //         '</li>';
            // } else {
            //     answer += '<li>' +
            //         '<div class="answers">' + content + '</div>' +
            //         '<div class="answerHead"><img src="' + fromAvatarUrl + '"/></div>' +
            //         '</li>';
            // }
            answer +=
                '<li>' +
                '<div class="answers" >' + '<span style="color:#70FF3B;font-weight:bold">' + fromUserName + '&nbsp' + sendTime + '</span>' + '<br/>' + '<span style="color:#210A19;font-weight:bold">' + content + '</span>' + '</div>' +
                '<div class="answerHead"><br/><img src="' + $("#userIcon").attr('src') + '"/></div>'
                + '</li>';
        } else {
            answer +=
                '<li>' +
                '<div class="answers" >' + '<span style="color:#4A3FFF;font-weight:bold">' + fromUserName + '&nbsp' + sendTime + '</span>' + '<br/>' + '<span style="color:#210A19;font-weight:bold">' + content + '</span>' + '</div>' +
                '<div class="answerHead"><br/><img src="' + fromAvatarUrl + '"/></div>'
                + '</li>';
        }

        // 消息框处理
        processMsgBox.receiveSingleMsg(answer, fromUserId, toUserId);
        // 好友列表处理
        processFriendList.receiving(content, $receiveLi);
    },

    groupReceive: function (data) {
        // 获取、构造参数
        console.log(data);
        var fromUserId = data.fromUserId;
        var fromUserName = data.fromUserName;
        var fromUserIcon = data.fromUserIcon;
        var content = data.content;
        var toGroupId = data.toGroupId;
        var sendTime = data.sendTime;
        var fromAvatarUrl;
        var $receiveLi;
        $('.conLeft').find('span.hidden-userId').each(function () {
            if (this.innerHTML == fromUserId) {
                fromAvatarUrl = $(this).parent(".liRight")
                    .siblings(".liLeft").children('img').attr("src");
                /* $receiveLi = $(this).parent(".liRight").parent("li"); */
            }
        })
        $('.conLeft').find('span.hidden-groupId').each(function () {
            if (this.innerHTML == toGroupId) {
                $receiveLi = $(this).parent(".liRight").parent("li");
            }
        })
        var answer = '';
        if (fromUserId === userId) {
            answer +=
                '<li>' +
                '<div class="answers" >' + '<span style="color:#70FF3B;font-weight:bold">' + fromUserName + '&nbsp' + sendTime + '</span>' + '<br/>' + '<span style="color:#210A19;font-weight:bold">' + content + '</span>' + '</div>' +
                '<div class="answerHead"><br/><img src="' + $("#userIcon").attr('src') + '"/></div>'
                + '</li>';
        } else {
            answer +=
                '<li>' +
                '<div class="answers" >' + '<span style="color:#4A3FFF;font-weight:bold">' + fromUserName + '&nbsp' + sendTime + '</span>' + '<br/>' + '<span style="color:#210A19;font-weight:bold">' + content + '</span>' + '</div>' +
                '<div class="answerHead"><br/><img src="' + fromUserIcon + '"/></div>'
                + '</li>';

        }


        // 消息框处理
        processMsgBox.receiveGroupMsg(answer, toGroupId);
        // 好友列表处理
        processFriendList.receiving(content, $receiveLi);
    },

    fileMsgSingleRecieve: function (data) {
        // 获取、构造参数
        console.log(data);
        var fromUserId = data.fromUserId;
        var fromUserName = data.fromUserName;
        var originalFilename = data.originalFilename;
        var fileSize = data.fileSize;
        var fileUrl = data.fileUrl;
        var content = "[文件]";
        var sendTime = data.sendTime;
        var fromAvatarUrl;
        var $receiveLi;
        $('.conLeft').find('span.hidden-userId').each(function () {
            if (this.innerHTML == fromUserId) {
                fromAvatarUrl = $(this).parent(".liRight")
                    .siblings(".liLeft").children('img').attr("src");
                $receiveLi = $(this).parent(".liRight").parent("li");
            }
        })
        var fileHtml =
            '<li>' +
            '<h5 class="answers" style="margin-right: 303px;">' + '<span style="color:#4A3FFF;font-weight:bold">' + fromUserName + sendTime + '</span>' + '</h5>' +
            '<div class="receive-file-shown">' +
            '<div class="media">' +
            '<div class="media-body"> ' +
            '<h5 class="media-heading">' + originalFilename + '</h5>' +
            '<span>' + fileSize + '</span>' +
            '</div>' +
            '<a href="' + fileUrl + '" download="" class="media-left">' +
            '<i class="glyphicon glyphicon-file" style="font-size:28pt;"></i>' +
            '</a>' +
            '</div>' +
            '</div>' +
            '<div class="answerHead"><img src="' + fromAvatarUrl + '"/></div>' +
            '</li>';

        // 消息框处理
        processMsgBox.receiveSingleMsg(fileHtml, fromUserId);
        // 好友列表处理
        processFriendList.receiving(content, $receiveLi);
    },

    fileMsgGroupRecieve: function (data) {
        // 1. 获取、构造参数
        console.log(data);
        var fromUserId = data.fromUserId;
        var fromUserName = data.fromUserName;
        var toGroupId = data.toGroupId;
        var originalFilename = data.originalFilename;
        var fileSize = data.fileSize;
        var fileUrl = data.fileUrl;
        var content = "[文件]";
        var sendTime = data.sendTime;
        var fromUserIcon = data.fromUserIcon;
        var $receiveLi;
        $('.conLeft').find('span.hidden-userId').each(function () {
            if (this.innerHTML == fromUserId) {
                fromAvatarUrl = $(this).parent(".liRight")
                    .siblings(".liLeft").children('img').attr("src");
                /* $receiveLi = $(this).parent(".liRight").parent("li"); */
            }
        })
        $('.conLeft').find('span.hidden-groupId').each(function () {
            if (this.innerHTML == toGroupId) {
                $receiveLi = $(this).parent(".liRight").parent("li");
            }
        })
        var fileHtml =
            '<li>' +
            '<h5 class="answers" style="margin-right: 303px;">' + '<span style="color:#4A3FFF;font-weight:bold">' + fromUserName + '&nbsp' + sendTime + '</span>' + '</h5>' +
            '<div class="receive-file-shown">' +
            '<div class="media">' +
            '<div class="media-body"> ' +
            '<h5 class="media-heading">' + originalFilename + '</h5>' +
            '<span>' + fileSize + '</span>' +
            '</div>' +
            '<a href="' + fileUrl + '" download="" class="media-left">' +
            '<i class="glyphicon glyphicon-file" style="font-size:28pt;"></i>' +
            '</a>' +
            '</div>' +
            '</div>' +
            '<div class="answerHead"><img src="' + fromUserIcon + '"/></div>' +
            '</li>';

        // 2. 消息框处理
        processMsgBox.receiveGroupMsg(fileHtml, toGroupId);
        // 3. 好友列表处理
        processFriendList.receiving(content, $receiveLi);
    },

    //关闭连接
    remove: function () {
        socket.close();
    },

};

function logout() {
    // 1. 关闭websocket连接
    ws.remove();

    // 2. 注销登录状态
    $.ajax({
        type: 'POST',
        url: 'logout',
        dataType: 'json',
        async: true,
        success: function (data) {
            if (data.status == 200) {
                // 3. 注销成功，进行页面跳转
                console.log("注销成功！");
                window.location.href = "login";
            } else {
                alert(data.msg);
            }
        }
    });
}
//消息记录
function noteOpen() {
    var fromUserId = userId;
    var toUserId = $('#toUserId').val();
    var toGroupId = $('#toGroupId').val();
    // $(".chat-notes").toggle();//改变显示状态
    if( $(".chat-notes").hasClass("show") ){
        // 执行隐藏
        $(".chat-notes").hide().removeClass("show");
    }else{
        if($(".chat-notes ul").find("li").length > 0){//如果再次查看则不需要请求
            $(".chat-notes").show().addClass("show");
        } else{
            // 显示
            $(".chat-notes").show().addClass("show");
            var data1={"toUserId":toUserId,"fromUserId":fromUserId,"groupId":toGroupId};
            $.ajax({
                type: 'POST',
                url: 'chatroom/get_chatNotes',
                data:JSON.stringify(data1),
                contentType:"application/json",
                async: true,
                success: function (data) {
                    console.log("获取消息记录...");
                    console.log(data);
                    if (data.status === 200) {
                        var messageInfos = data.data.messageInfos;
                        var ChatNotesHTML = "";
                        for (var i = 0; i < messageInfos.length; i++) {
                            if(messageInfos[i].type==1 || messageInfos[i].type==2){//消息
                                ChatNotesHTML +=
                                    '<li>' +
                                    '<div class="notes" >' + '<span class="corle">' + messageInfos[i].fromUserId + '&nbsp' +new Date (messageInfos[i].userTime).format("yyyy-MM-dd hh:mm:ss") + '</span>' + '<br/>' +
                                    '<span style="color:#210A19;font-weight:bold">' + messageInfos[i].content+'</span>' + '</div>' +
                                    // '<div class="answerHead"><br/><img src="' + fromUserIcon + '"/></div> + '
                                    '</li>';
                            }
                            if(messageInfos[i].type==3||messageInfos[i].type==4){//文件
                                ChatNotesHTML +=
                                    '<li>' +
                                    '<div class="notes">' +
                                    '<span class="corle">' + messageInfos[i].fromUserId + '&nbsp' +new Date (messageInfos[i].userTime).format("yyyy-MM-dd hh:mm:ss") + '</span>' +
                                    '<div class="note-file" >' +
                                    '<div class="media">' +
                                    '<div class="media-body"> ' +
                                    '<h5 class="media-heading">' + messageInfos[i].fileName + '</h5>' +
                                    '<span>' + messageInfos[i].fileSize + '</span>' +
                                    '</div>' +
                                    // '<div class="note-file-img">' +
                                    '<a href="' + messageInfos[i].fileUrl + '" download="" class="media-left">' +
                                    '<i class="glyphicon glyphicon-file" style="font-size:28pt;"></i>' +
                                    '</a>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>'+
                                    '</li>';
                            }
                        }

                        $('.notesList ul').append(ChatNotesHTML);
                        // 绑定好友框点击事件
                        $('.conLeft ul li').on('click', friendLiClick);
                    } else {
                        alert(data.msg);
                    }
                }
            });
        }
    }
}


$(".myfile").fileinput({
    uploadUrl: "chatroom/upload",
    uploadAsync: true, //默认异步上传
    showUpload: true, //是否显示上传按钮,跟随文本框的那个
    showRemove: false, //显示移除按钮,跟随文本框的那个
    showCaption: false,//是否显示标题,就是那个文本框
    showPreview: true, //是否显示预览,不写默认为true
    dropZoneTitle: "请通过拖拽图片文件放到这里",
    dropZoneEnabled: false,//是否显示拖拽区域/多文件上传，默认不写为true，但是会占用很大区域
    maxFileSize: 30720,//单位为kb，如果为0表示不限制文件大小
    maxFileCount: 1, //表示允许同时上传的最大文件个数
    enctype: 'multipart/form-data',
    validateInitialCount: true,
    previewFileIcon: "<i class='glyphicon glyphicon-file'></i>",
    msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
    language: 'zh'//设置语言
})
//异步上传返回错误结果处理
$('.myfile').on('fileerror', function (event, data, msg) {
    console.log("上传错误");
    console.log(data);
});
//异步上传返回成功结果处理
$(".myfile").on("fileuploaded", function (event, data, previewId, index) {

    // 1. 上传成功1.5秒后自动关闭上传模态框
    console.log("上传成功");
    setTimeout(function () {
        $('#upload-cancel').trigger('click');
        $('.fileinput-remove').trigger('click');
    }, 1500);

    // 2. 获取、设置参数
    var returnData = data.response.data;
    var originalFilename = returnData.originalFilename;
    var fileSize = returnData.fileSize;
    var fileUrl = returnData.fileUrl;
    var content = "[文件]";
    var fromUserId = userId;
    var userIcon = $('#userIcon').attr("src");
    var $sendLi = $('.conLeft').find('li.bg');
    var toUserId = $('#toUserId').val();
    var toGroupId = $('#toGroupId').val();
    var fileHtml =

        '<li>' +
        '<div class="times" >' + '<span style="color:#70FF3B;font-weight:bold">' + new Date().format("yyyy-MM-dd hh:mm:ss") + '</span>' + '</div>' +
        '<div class="send-file-shown">' +
        '<div class="media">' +
        '<a href="' + fileUrl + '" download="" class="media-left">' +
        '<i class="glyphicon glyphicon-file" style="font-size:28pt;"></i>' +
        '</a>' +
        '<div class="media-body"> ' +
        '<h5 class="media-heading">' + originalFilename + '</h5>' +
        '<span>' + fileSize + '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="nesHead"><img src="' + userIcon + '"/></div>' +
        '</li>';

    // 3. 发送信息到服务器
    if (toUserId.length != 0) {
        ws.fileMsgSingleSend(fromUserId, toUserId, originalFilename, fileUrl, fileSize);
    } else {
        ws.fileMsgGroupSend(fromUserId, toGroupId, originalFilename, fileUrl, fileSize);
    }

    // 4. 消息框处理：
    processMsgBox.sendFileMsg(fileHtml, toUserId, toGroupId);

    // 5. 好友列表处理
    processFriendList.sending(content, $sendLi);
});
// //上传前
// $('.myfile').on('filepreupload', function(event, data, previewId, index) {
//     console.log("filepreupload");
// });
// 绑定发送按钮回车事件
$('#dope').keydown(function (e) {
    if (e.keyCode == 13) {
        $('.sendBtn').trigger('click');
        e.preventDefault(); //屏蔽enter对系统作用。按后增加\r\n等换行
    }
});

// 绑定发送按钮点击事件
$('.sendBtn').on('click', function () {
    var fromUserId = userId;
    var toUserId = $('#toUserId').val();
    var toGroupId = $('#toGroupId').val();
    var news = $('#dope').val();
    if (toUserId == '' && toGroupId == '') {
        alert("请选择对话方");
        return;
    }
    if (news == '') {
        alert('消息不能为空');
        return;
    } else {
        if (toUserId.length != 0) {
            ws.singleSend(fromUserId, toUserId, news);
        } else {
            ws.groupSend(fromUserId, toGroupId, news);
        }

        $('#dope').val('');
        var userIcon = $('#userIcon').attr("src");
        var msg = '';
        msg += '<li>' +
            '<div class="news">' + '<span style="color:#70FF3B;font-weight:bold">' + new Date().format("yyyy-MM-dd hh:mm:ss") + '</span>' + '</br>' + news + '</div>' +
            '<div class="nesHead"><img src="' + userIcon + '"/></div>' +
            '</li>';

        // 消息框处理：
        processMsgBox.sendMsg(msg, toUserId, toGroupId)

        // 好友列表处理：
        var $sendLi = $('.conLeft').find('li.bg');
        processFriendList.sending(news, $sendLi);
    }
})

$('.ExP').on('mouseenter', function () {
    $('.emjon').show();
})

$('.emjon').on('mouseleave', function () {
    $('.emjon').hide();
})

$('.emjon li').on('click', function () {
    var imgSrc = $(this).children('img').attr('src');
    $('.emjon').hide();
    var fromUserId = userId;
    var toUserId = $('#toUserId').val();
    var toGroupId = $('#toGroupId').val();
    var content = '<img class="Expr" src="' + imgSrc + '">';
    if (toUserId == '' && toGroupId == '') {
        alert("请选择对话方");
        return;
    }
    if (toUserId.length != 0) {
        ws.singleSend(fromUserId, toUserId, content);
    } else {
        ws.groupSend(fromUserId, toGroupId, content);
    }
    var userIcon = $('#userIcon').attr("src");
    var msg = '';
    msg += '<li>' +
        '<div class="news">' + '<span style="color:#70FF3B;font-weight:bold">' + new Date().format("yyyy-MM-dd hh:mm:ss") + '</span>' + '</br>' + content + '</div>' +
        '<div class="nesHead"><img src="' + userIcon + '"/></div>' +
        '</li>';
    processMsgBox.sendMsg(msg, toUserId, toGroupId);
    var $sendLi = $('.conLeft').find('li.bg');
    content = "[图片]";
    processFriendList.sending(content, $sendLi);
})

function friendLiClick(){
    $(".chat-notes").hide().removeClass("show");
    $(".chat-notes ul").find("li").remove();//移除上一个好友的聊天记录
}
// 好友框点击事件
function friendLiClickEvent() {

    // 1. 设置点击阴影效果
    $(this).addClass('bg').siblings().removeClass('bg');

    // 2. 设置显示右侧消息框
    $('.conRight').css("display", "-webkit-box");

    // 3. 设置消息框显示对方信息，清空对方id
    var intername = $(this).children('.liRight').children('.intername').text();
    var toUserId = $(this).children('.liRight').children('.hidden-userId').text();
    var toGroupId = $(this).children('.liRight').children('.hidden-groupId').text();
    /*alert('userId:' + (toUserId.length != 0));
    alert('groupId:' + toGroupId);*/
    $('.headName').text(intername);
    $('#toUserId').val("");
    $('#toGroupId').val("");

    // 4. 设置显示已收到的信息，设置好对方的id
    $('.newsList').html('');
    var messageArray;
    if (toUserId.length != 0) {
        messageArray = sentMessageMap.get(toUserId);
        $('#toUserId').val(toUserId);
    } else {
        messageArray = sentMessageMap.get(toGroupId);
        $('#toGroupId').val(toGroupId);
    }
    for (var i = 0; i < messageArray.length; i++) {
        $('.newsList').append(messageArray[i]);
    }

    // 5.设置消息框滚动条滑到底部
    $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight);

    // 6. 去掉红色提醒徽章
    var $badge = $(this).find(".layui-badge");
    if ($badge.length > 0) {
        $badge.remove();
    }
}

// 处理消息框的对象，统一管理相关处理函数，主要包括4个事件函数：
// (实际上应该有8个事件函数，发送得4个：单发普通信息、群发普通信息、单发文件信息、群发文件信息，
// 再加上对应的接收4个，但根据实际情况，发现代码可重用，于是便缩减为4个)
// 1. sendMsg: 发送(单个、群)消息时，调用此函数处理消息框变化；
// 2. sendFileMsg： 文件上传成功后，发送(单个、群)文件消息时，调用此函数处理消息框变化；
// 3. receiveSingleMsg： 收到单发(普通对话、文件)消息时，调用此函数处理消息框变化；
// 4. receiveGroupMsg： 收到群发(普通对话、文件)消息时，调用此函数处理消息框变化。
var processMsgBox = {
    sendMsg: function (msg, toUserId, toGroupId) {
        // 1. 把内容添加到消息框
        $('.newsList').append(msg);

        // 2. 手动计算、调整回显消息show的宽度
        var $newsDiv = $('.newsList li').last().children("div").first();
        var fixWidth = 300; // 自定义的消息框本身的最长宽度
        var maxWidth = 493; // 消息框所在行(div)的满宽度(不包含头像框的宽度部分)
        var minMarginLeftWidth = 224; // 按理说应该是 maxwidth - fixWidth，这里出现了点问题
        var marginLeftWidth; // 要计算消息框的margin-left宽度
        if ($newsDiv.actual('width') < fixWidth) {
            marginLeftWidth = maxWidth - $newsDiv.actual('width');
            ;
            $newsDiv.css("margin-left", marginLeftWidth + "px");
        } else {
            $newsDiv.css("width", fixWidth + "px")
                .css("margin-left", minMarginLeftWidth + "px");
        }

        // 3. 把调整后的消息html标签字符串 添加到已发送用户消息表
        if (toUserId.length != 0) {
            sentMessageMap.get(toUserId).push($('.newsList li').last().prop("outerHTML"));
        } else {
            sentMessageMap.get(toGroupId).push($('.newsList li').last().prop("outerHTML"));
        }

        // 4. 滚动条往底部移
        $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight);
    },

    sendFileMsg: function (msg, toUserId, toGroupId) {
        // 注意，文件信息消息框不需要计算宽度，已通过css设置好固定的样式
        // 1. 回显发送的新消息
        $('.newsList').append(msg);

        // 2. 把消息html标签字符串 添加到已发送用户消息表
        if (toUserId.length != 0) {
            sentMessageMap.get(toUserId).push($('.newsList li').last().prop("outerHTML"));
        } else {
            sentMessageMap.get(toGroupId).push($('.newsList li').last().prop("outerHTML"));
        }

        // 3. 消息框往下移
        $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight);
    },

    receiveSingleMsg: function (msg, fromUserId, toUserId) {
        // 1. 设置消息框可见
        $('.conRight').css("display", "-webkit-box");

        // 2. 把新消息放到暂存区$('.newsList-temp)，如果用户正处于与发出新消息的用户的消息框，则消息要回显
        $('.newsList-temp').append(msg);
        var $focusUserId = $(".conLeft .bg").find('span.hidden-userId');
        if ($focusUserId.length > 0 && $focusUserId.html() == fromUserId) {
            $('.newsList').append(msg);
        }

        // 3. 利用暂存区手动计算、调整新消息的宽度；
        var $answersDiv = $('.newsList-temp li').last().children("div").first();
        var fixWidth = 300; // 消息框本身的最长宽度
        var maxWidth = 480; // 消息框所在行(div)的满宽度(不包含头像框的宽度部分)
        var minMarginRightWidth = 212; // 按理说应该是 maxwidth - fixWidth，这里出现了点问题
        var marginRightWidth; // 要计算消息框的margin-right宽度
        if ($answersDiv.actual('width') < fixWidth) {
            marginRightWidth = maxWidth - $answersDiv.actual('width');
            $answersDiv.css("margin-right", marginRightWidth + "px");
            if ($focusUserId.length > 0 && $focusUserId.html() == fromUserId) {
                $('.newsList li').last().children("div").first()
                    .css("margin-right", marginRightWidth + "px");
            }
        } else {
            $answersDiv.css("width", fixWidth + "px")
                .css("margin-right", minMarginRightWidth + "px");
            if ($focusUserId.length > 0 && $focusUserId.html() == fromUserId) {
                $('.newsList li').last().children("div").first()
                    .css("width", fixWidth + "px")
                    .css("margin-right", minMarginRightWidth + "px");
            }
        }

        // 4. 把 调整后的消息html标签字符串 添加到已发送用户消息表，并清空暂存区
        if (fromUserId === userId) {
            sentMessageMap.get(toUserId).push($('.newsList-temp li').last().prop("outerHTML"));
        } else {
            sentMessageMap.get(fromUserId).push($('.newsList-temp li').last().prop("outerHTML"));
        }
        $('.newsList-temp').empty();

        // 5. 滚动条滑到底
        $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight);
    },

    receiveGroupMsg: function (msg, toGroupId) {
        // 1. 设置消息框可见
        $('.conRight').css("display", "-webkit-box");

        // 2. 把新消息放到暂存区$('.newsList-temp)，如果用户正处于与发出新消息的用户的消息框，则消息要回显
        $('.newsList-temp').append(msg);
        var $focusGroupId = $(".conLeft .bg").find('span.hidden-groupId');
        if ($focusGroupId.length > 0 && $focusGroupId.html() == toGroupId) {
            $('.newsList').append(msg);
        }

        // 3. 手动计算、调整回显消息的宽度
        var $answersDiv = $('.newsList-temp li').last().children("div").first();
        var fixWidth = 300; // 消息框本身的最长宽度
        var maxWidth = 480; // 消息框所在行(div)的满宽度(不包含头像框的宽度部分)
        var minMarginRightWidth = 212; // 按理说应该是 maxwidth - fixWidth，这里出现了点问题
        var marginRightWidth; // 要计算消息框的margin-right宽度
        if ($answersDiv.actual('width') < fixWidth) {
            marginRightWidth = maxWidth - $answersDiv.actual('width');
            $answersDiv.css("margin-right", marginRightWidth + "px");
            if ($focusGroupId.length > 0 && $focusGroupId.html() == toGroupId) {
                $('.newsList li').last().children("div").first()
                    .css("margin-right", marginRightWidth + "px");
            }
        } else {
            $answersDiv.css("width", fixWidth + "px")
                .css("margin-right", minMarginRightWidth + "px");
            if ($focusGroupId.length > 0 && $focusGroupId.html() == toGroupId) {
                $('.newsList li').last().children("div").first()
                    .css("width", fixWidth + "px")
                    .css("margin-right", minMarginRightWidth + "px");
            }
        }

        // 4. 把 调整后的消息html标签字符串 添加到已发送用户消息表，并清空暂存区
        sentMessageMap.get(toGroupId).push($('.newsList-temp li').last().prop("outerHTML"));
        $('.newsList-temp').empty();

        // 5. 滚动条滑到底(Firefox不兼容)
        $('.RightCont').scrollTop($('.RightCont')[0].scrollHeight);
        // css加height: 200px;//获取，兼容火狐谷歌
    }
}

var processFriendList = {
    sending: function (content, $sendLi) {
        // 1. 设置部分新消息提醒
        if (content.length > 8) {
            content = content.substring(0, 8) + "...";
        }
        $('.conLeft').find('li.bg').children('.liRight').children('.infor').text(content);
        // 2. 如果存在新消息提醒徽章，则去除徽章
        if ($sendLi.find('.layui-badge').length > 0) {
            $sendLi.find('.layui-badge').remove();
        }
        //$('.conLeft ul').prepend('<li class="bg">' + $sendLi.html() + '</li>');
        // 3. 好友框新消息置顶
        $('.conLeft ul').prepend($sendLi.prop("outerHTML"));
        $sendLi.remove();
        $('.conLeft ul li').first().on('click', friendLiClickEvent)
    },

    receiving: function (content, $receiveLi) {
        // 1. 设置红色提醒徽章
        var $badge = $receiveLi.find(".layui-badge");
        if ($badge.length > 0) {
            $badge.html(parseInt($badge.html()) + 1);
        } else {
            var badgeHTML = '<span class="layui-badge badge-avatar">1</span>';
            $receiveLi.children(".liLeft").prepend(badgeHTML);
        }
        // 2. 设置部分新消息提醒
        if (content.length > 8) { // 只显示前八个字符
            content = content.substring(0, 8) + "...";
        }
        if (content.search("<img") != -1) { // 若是图片，显示 “[图片]”
            content = "[图片]";
        }
        $receiveLi.children(".liRight").children('.infor').text(content);

        // 3. 新消息置顶
        $('.conLeft ul').prepend($receiveLi.prop("outerHTML"));
        $('.conLeft ul li').first().on('click', friendLiClickEvent);
        $receiveLi.remove();
    }
}

// 自定义数据结构：已发送用户消息表
function SentMessageMap() {
    this.elements = new Array();

    //获取MAP元素个数
    this.size = function () {
        return this.elements.length;
    };

    //判断MAP是否为空
    this.isEmpty = function () {
        return (this.elements.length < 1);
    };

    //删除MAP所有元素
    this.clear = function () {
        this.elements = new Array();
    };

    //向MAP中增加元素（key, value)
    this.put = function (_key, _value) {
        this.elements.push({
            key: _key,
            value: _value
        });
    };

    //删除指定KEY的元素，成功返回True，失败返回False
    this.removeByKey = function (_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };

    //删除指定VALUE的元素，成功返回True，失败返回False
    this.removeByValue = function (_value) {//removeByValueAndKey
        var bln = false;
        try {
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value) {
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };

    //删除指定VALUE的元素，成功返回True，失败返回False
    this.removeByValueAndKey = function (_key, _value) {
        var bln = false;
        try {
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value && this.elements[i].key == _key) {
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };

    //获取指定KEY的元素值VALUE，失败返回NULL
    this.get = function (_key) {
        try {
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    return this.elements[i].value;
                }
            }
        } catch (e) {
            return false;
        }
        return false;
    };

    //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
    this.element = function (_index) {
        if (_index < 0 || _index >= this.elements.length) {
            return null;
        }
        return this.elements[_index];
    };

    //判断MAP中是否含有指定KEY的元素
    this.containsKey = function (_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };

    //判断MAP中是否含有指定VALUE的元素
    this.containsValue = function (_value) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };

    //判断MAP中是否含有指定VALUE的元素
    this.containsObj = function (_key, _value) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value && this.elements[i].key == _key) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };

    //获取MAP中所有VALUE的数组（ARRAY）
    this.values = function () {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].value);
        }
        return arr;
    };

    //获取MAP中所有VALUE的数组（ARRAY）
    this.valuesByKey = function (_key) {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            if (this.elements[i].key == _key) {
                arr.push(this.elements[i].value);
            }
        }
        return arr;
    };

    //获取MAP中所有KEY的数组（ARRAY）
    this.keys = function () {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].key);
        }
        return arr;
    };

    //获取key通过value
    this.keysByValue = function (_value) {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            if (_value == this.elements[i].value) {
                arr.push(this.elements[i].key);
            }
        }
        return arr;
    };

    //获取MAP中所有KEY的数组（ARRAY）
    this.keysRemoveDuplicate = function () {
        var arr = new Array();
        for (var i = 0; i < this.elements.length; i++) {
            var flag = true;
            for (var j = 0; j < arr.length; j++) {
                if (arr[j] == this.elements[i].key) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                arr.push(this.elements[i].key);
            }
        }
        return arr;
    };
}