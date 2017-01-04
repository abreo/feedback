import '../less/feedback.less';
import html2canvas from './html2canvas.min.js';

var enterHTML = "<div id='jkquiz-door'></div>";
var feedbackHTML = `
    <div class="mask">
        <div class="quiz-container">
            <h3>提交反馈</h3>
            <textarea id="quiz-content" placeholder="告诉我们你的建议或遇到的问题。" rows="3"></textarea>
            <div id="canvas-content">
            </div>
            <label class="quiz-label">提交屏幕截图<input class="quiz-checkbox" type="checkbox" checked="checked"></label>
            <a id="quiz-submit" href="javascript:;">提交</a>
        </div>
    </div>`;

var feedback = {
    init:function(){
        this.enterInit();
        this.bind();
    },
    bind:function(){
        $('#jkquiz-door').on('click',this.show);
        $('body').on('click','#quiz-submit',this.submitFeedback);
        $('body').on('click','.quiz-checkbox',this.checkDraw);
    },
    enterInit:function(){
        $('body').append(enterHTML);
    },
    show:function(){
        var wH = $(window).height();
        var wW = $(window).width();
        var wST = $(window).scrollTop();
        var wrapper = document.body
        document.body.style.overflow = 'hidden'
        html2canvas(wrapper,{
            allowTaint:true,
            height:wH+wST
        }).then(function(canvas) {
            $('body').append(feedbackHTML);
            var ccW = $('#canvas-content').width();
            var ccH = parseInt(wH * ccW / wW);
            $('#canvas-content').height(ccH);
            var qcH = $('.quiz-container').outerHeight()
            $('.quiz-container').css('margin-top',-qcH/2);

            var drawCanvas = document.createElement('canvas')
            var canvasContent = document.getElementById('canvas-content')
            drawCanvas.setAttribute('id','draw-container')
            drawCanvas.width = ccW
            drawCanvas.height = ccH
            drawCanvas.getContext("2d").drawImage(canvas,0,0,wW,wH,0,0,ccW,ccH);
            canvasContent.appendChild(drawCanvas);
            feedback.bindDraw();
        });
    },
    bindDraw:function(){
        $('#draw-container').on('mousedown',this.startDraw);
        $('#draw-container').on('mousemove',this.moveDraw);
        $('#draw-container').on('mouseup',this.endDraw);
    },
    drawkey: false,
    startDraw:function(e){
        feedback.drawkey = true;
        var canvas = document.getElementById('draw-container')
        var ccSL = $("#canvas-content").offset().left;
        var ccST = $("#canvas-content").offset().top - $(document).scrollTop();
        var pencil = canvas.getContext("2d");
        pencil.lineWidth = 2
        pencil.strokeStyle = "red";

        var mouseX = e.clientX - ccSL;
        var mouseY = e.clientY - ccST;
        pencil.moveTo(mouseX, mouseY); //起始位置

    },
    moveDraw:function(e){
        if(!feedback.drawkey){return;}
        var canvas = document.getElementById('draw-container')
        var ccSL = $("#canvas-content").offset().left;
        var ccST = $("#canvas-content").offset().top - $(document).scrollTop();
        var pencil = canvas.getContext("2d");
        pencil.lineWidth = 2
        pencil.strokeStyle = "red";

        var mouseX = e.clientX - ccSL;
        var mouseY = e.clientY - ccST;
        pencil.lineTo(mouseX,mouseY); //终止位置
        pencil.stroke(); //结束图形
    },
    endDraw:function(){
        feedback.drawkey = false;
    },
    submitFeedback:function(){
        console.log('get');
    },
    checkDraw:function(event){
        event.stopPropagation();
        var checked = $('.quiz-checkbox').prop('checked');
        var drHeight = $('#draw-container').height();
        var conHeight = $('.quiz-container').height();

        if(!checked){
            $('#canvas-content').animate({height:0})
        }else{
            $('#canvas-content').animate({height:drHeight})
        }
    }
}

$(function(){
    feedback.init();
})