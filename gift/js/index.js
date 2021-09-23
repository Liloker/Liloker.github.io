$('#login-button').click(function (event) {
	var userName=document.getElementById("userName").value;
    var pwd=document.getElementById("pwd").value;
	var array=new Array(
		"是陈fairy来了吗?   让我康康是谁来打扰本大爷睡觉~~~",
		"你好像不是那个聪明的陈fairy诶~~~    陈fairy可厉害了一下子就答对了,你答错了，肯定不是陈fairy~~~",
		"你好呀~    猜猜答案是什么?",
		"难道又双叒错了???  答案大小写都可以哦，比如ABCDA或者abcda",
		"生日快乐~~~   生日快乐~~~  生日快乐~~~ 重要的事情说三遍哦~~~",
		"大王叫我保护礼物，说只有答对的人才能有机会打开礼物，今天有个叫陈fairy的仙女会驾到来着~~~",
		"答对了才可以通过仙女鉴定哦~~~",
		"其实呀，我早就猜到你肯定难以平复此时的心情啦~~~hhhh，你知道如何快速静下心来进入阅读状态吗?这样或许能尽快得到答案",
		"猜猜谁最可爱~~~  是哪个叫陈fairy的最可爱",
		"今天晚霞好美呀！想知道礼物里面是什么吗?");
	var iii=0;
	// iii=iii+1;
	// if (iii==10) {iii=0;}
	i=Math.floor(Math.random()*10);
    if(userName=="陈fairy" &&  (pwd=="BDCAB"||pwd=="bdcab")){
			event.preventDefault();
			$('form').fadeOut(500);
			$('.wrapper').addClass('form-success');
			setTimeout(function(){location.href="BirthdayCake.html";},2000);
		}
	else{
			alert(array[iii]);	
	}
});
