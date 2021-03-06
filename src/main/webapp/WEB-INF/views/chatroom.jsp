﻿<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html>
<head>
    <%@ include file="/static/js/common/jsp/include.jsp" %>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <script type="text/javascript" src="<c:url value="/static/js/chat_room/emjon.js?v=20200116"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/js/chat_room/file_upload.js?v=20200116"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/js/chat_room/friend_list.js?v=20200116"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/js/chat_room/logout.js?v=20200116"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/js/chat_room/mess_log.js?v=20200116"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/js/chat_room/mess_send.js?v=20200116"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/js/chat_room/msg_box.js?v=20200116"/>"></script>
    <script type="text/javascript" src="<c:url value="/static/js/websocket/websocket-context.js?v=20200116"/>"></script>
    <title>在线聊天室</title>
</head>
<body>
<div class="qqBox">
    <div class="BoxHead">
        <div class="headImg">
            <img id="userIcon" src=""/>
        </div>
        <div id="userName" class="internetName"></div>
        <button class="close logout" onclick="logout()">&times;</button>
    </div>
    <div class="context">
        <div class="conLeft">
            <ul>

            </ul>
        </div>
        <div class="conRight">
            <div class="Righthead">
                <div class="headName"></div>
            </div>
            <div class="RightCont" style="overflow:-moz-scrollbars-none">
                <ul class="newsList-temp"></ul>
                <ul class="newsList">

                </ul>
            </div>

            <div class="RightFoot">
                <div class="emjon">
                    <ul>
                        <li><img src="static/img/emoji/emoji_01.png"></li>
                        <li><img src="static/img/emoji/emoji_02.png"></li>
                        <li><img src="static/img/emoji/emoji_03.png"></li>
                        <li><img src="static/img/emoji/emoji_04.png"></li>
                        <li><img src="static/img/emoji/emoji_05.png"></li>
                        <li><img src="static/img/emoji/emoji_06.png"></li>
                        <li><img src="static/img/emoji/emoji_07.png"></li>
                        <li><img src="static/img/emoji/emoji_08.png"></li>
                        <li><img src="static/img/emoji/emoji_09.png"></li>
                        <li><img src="static/img/emoji/emoji_10.png"></li>
                        <li><img src="static/img/emoji/emoji_11.png"></li>
                        <li><img src="static/img/emoji/emoji_12.png"></li>
                        <li><img src="static/img/emoji/emoji_13.png"></li>
                        <li><img src="static/img/emoji/emoji_14.png"></li>
                        <li><img src="static/img/emoji/emoji_15.png"></li>
                        <li><img src="static/img/emoji/emoji_16.png"></li>
                        <li><img src="static/img/emoji/emoji_17.png"></li>
                        <li><img src="static/img/emoji/emoji_18.png"></li>
                        <li><img src="static/img/emoji/emoji_19.png"></li>
                        <li><img src="static/img/emoji/emoji_20.png"></li>
                        <li><img src="static/img/emoji/emoji_21.png"></li>
                        <li><img src="static/img/emoji/emoji_22.png"></li>
                        <li><img src="static/img/emoji/emoji_23.png"></li>
                        <li><img src="static/img/emoji/emoji_24.png"></li>
                    </ul>
                </div>
                <div class="footTop">
                    <ul>
                        <li class="ExP">
                            <img src="static/img/emoji.jpg">
                        </li>
                        <li class="file-upload">
                            <a data-toggle="modal" data-target="#upload-modal" data-backdrop="static">
                                <img src="static/img/upload.jpg">
                            </a>
                        </li>
                        <li class="note">
                            <a onclick="noteOpen()">消息记录</a>
                        </li>
                    </ul>
                </div>
                <div class="inputBox">
                    <input id="toUserId" type="hidden">
                    <input id="toGroupId" type="hidden">
                    <textarea id="dope" style="width: 99%;height: 68px; border: none;outline: none;" name="" rows=""
                              cols=""></textarea>
                    <button title="按下回车可发送" class="sendBtn">发送</button>
                </div>

            </div>
        </div>
    </div>

    <div class="modal fade" id="upload-modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button class="close" data-dismiss="modal">&times;</button>
                    <h3 class="modal-title text-primary">文件上传</h3>
                </div>
                <div class="modal-body">
                    <form class="form-horizontal">
                        <div class="form-group">
                            <label class="col-sm-3 control-label">选择文件</label>
                            <div class="col-sm-9">
                                <input type="file" name="file"
                                       class="col-sm-9 myfile"/>
                                <p class="help-block">注意：文件大小不超过30M，有效期为7天</p>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button id="upload-cancel" class="btn btn-sm btn-muted" data-dismiss="modal">
                        <i class="glyphicon glyphicon-remove"></i> 取消
                    </button>
                </div>
            </div>
        </div>
    </div>
    <div class="chat-notes" style="display: none">
        <div class="chatNoteHead">
        </div>
        <div class="RightNoteCont" style="overflow:-moz-scrollbars-none">
            <div class="notesList">
                <ul>

                </ul>
            </div>
        </div>
    </div>
</div>
</body>
</html>
