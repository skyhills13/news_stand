function init() {
    registerEvents();
    readImgFromJson();
}
            
//클릭 이벤트//
function registerEvents() {
        
        //네이게이션 펼치기 부분
        var navListener = document.getElementById('navListener');
        navListener.addEventListener('click', toggleMenu, false );
    
        var noneButtons = document.getElementsByClassName('alertNone'); //구현 페이지가 없는 버튼들을 묶어서 같은 클래스로 만듦
        for( var i = 0; i<noneButtons.length ; i++){
            noneButtons[i].addEventListener('click', alertNone, false);
        }
      }
      
function toggleMenu(e) {
    
    e.preventDefault();
    
    var magazine_menu = document.getElementById('magazine_menu');       
    console.log(magazine_menu);
    var magazine_display = getStyle(magazine_menu, 'display');
    console.log(magazine_display);
    
    if ( magazine_display === 'block' ) {
        magazine_menu.style.display = 'none';
        e.currentTarget.children[0].innerHTML = "네비게이션 펼치기";
        
    } else {
        magazine_menu.style.display  = 'block'; 
        
        e.currentTarget.children[0].innerHTML = "네비게이션 닫기";
    }
    
}

      
function getStyle( node, style ) {
    return window.getComputedStyle(node, null).getPropertyValue(style);
}

function alertNone(e){
    alert("구현되지 않은 페이지입니다.");
}

function readImgFromJson() {
    console.log("readImageFunction");
	var template = document.getElementById("template");	
	var templateInnerHTML = template.innerHTML;

	var url = "./NewsStand.json";
	var request = new XMLHttpRequest();
	
	request.open("GET", url, false); //false면  sync. 다 수행되야지 밑으로 넘어간다. true면 async. 바로 밑으로 내려가고 나중에 완료시 시행
	request.onreadystatechange=function() {
            console.log("request.readyState : ".concat(request.readyState));
            console.log("request.status : ".concat(request.status));
        
			//if ( request.readyState === 4 && request.status === 200 ) {
            if ( request.readyState === 4 ) { //톰캣이 아니니까 status는 체크 안하는걸로~
			var result = request.responseText;
                
            var responseArray = JSON.parse(result); //json파일에 5개짜리 배열로 저장되어 있다. [object, object, object, object, object]
            console.log("responseArray : ".concat(responseArray));
            var resultStringArray = new Array(5);
                
            var compiled = _.template(templateInnerHTML);
                
            for ( var index = 0 ; index < responseArray.length ; ++index ) {
                console.log("responseArray : ".concat(responseArray[index].title));
                var result = compiled( {title_template : responseArray[index].title });
                //                      html상에 선언한 변수: xhr통신 후 response한 데이터에서 key(title)값으로 가져온 것을 대입
                console.log(result);
                resultStringArray[index] = result;
            }
			
                
            var content1 = document.getElementById("contents1");
            console.log("content1 : ".concat(content1));
            content1.innerHTML = resultStringArray[0];
            setArticles(content1);    

            content2 = content1.nextElementSibling;
            content2.innerHTML = resultStringArray[1];
            setArticles(content2);    
                
            content3 = content2.nextElementSibling;
            content3.innerHTML = resultStringArray[2];
            setArticles(content3);
                
            content4 = content3.nextElementSibling;
            content4.innerHTML = resultStringArray[3];
            setArticles(content4);
                
            content5 = content4.nextElementSibling;
            content5.innerHTML = resultStringArray[4];
            setArticles(content5);
		}
	}
	
	request.send(null);
}
      
//신문기사 배치하는 부분//
function setArticles( contentElement ){
      
    var articlesList;
//      var articlesList = [['3일간의 리얼 다큐멘터리 NEXT WAY','http://blog.naver.com/nhnnext/20198433400',
//                       'http://static.campaign.naver.com/0/campaign/2012/04/line_sticker/img/pc/ko/img_cony7.png'],
//                      ['인터넷 데이터 센터 각 방문기','http://blog.naver.com/nhnnext/20196590574',
//                      'http://static.campaign.naver.com/0/campaign/2012/04/line_sticker/img/pc/ko/img_james11.png'],
//                      ['NEXT 기업탐방 프로그램 : 엑스엘게임즈','http://blog.naver.com/nhnnext/20193319013',
//                      'http://static.campaign.naver.com/0/campaign/2012/04/line_sticker/img/pc/ko/img_brown12.png'],
//                      ['NEXT를 위한 기분 좋은 시간, NHN NEXT 학생과의 만남','http://blog.naver.com/nhnnext/20188625676',
//                      'http://static.campaign.naver.com/0/campaign/2012/04/line_sticker/img/pc/ko/img_moon7.png'],
//                      ['NHN NEXT, 2013 iF 디자인어워드 디자인 부문 수상','http://blog.naver.com/nhnnext/20172842061',
//                      'http://static.campaign.naver.com/0/campaign/2012/04/line_sticker/img/pc/ko/img_brown4.png'],
//                      ['엔트리브소프트 김준영 대표의 편지','http://blog.naver.com/nhnnext/20194804116',
//                      'http://static.campaign.naver.com/0/campaign/2012/04/line_sticker/img/pc/ko/img_james10.png'],
//                      ['NEXT 소프트웨어 창의체험 활동 이야기','http://blog.naver.com/nhnnext/20191798933',
//                      'http://static.campaign.naver.com/0/campaign/2012/04/line_sticker/img/pc/ko/moon2.png']];
    
    
    
    //
    var url = "./NewsStand_article.json";
	var request = new XMLHttpRequest();
	
	request.open("GET", url, false);
	request.onreadystatechange=function() {
            console.log("request.readyState2 : ".concat(request.readyState));
            console.log("request.status2 : ".concat(request.status));
            debugger;
            if ( request.readyState === 4 ) {
                var resultString = request.responseText;
                console.log(resultString);
                articlesList = JSON.parse(resultString);
            }
	}
	request.send(null);
    //
    
    if ( articlesList === null )
        return;
    
    
      var article_individuals = contentElement.getElementsByClassName('article_individual'); 
      var num_of_articles  = article_individuals.length;      
      var selected_idx = [];
      
      for(var i = 0; i < num_of_articles ; i ++) {
                var index = parseInt(Math.random() * 10 % articlesList.length);
                if(selected_idx.indexOf(index) != -1) { //index가 있으면 중복되니까   
                    i--;
                    continue;
                }
                selected_idx.push(index);
            }
      
            for(var i = 0; i < article_individuals.length ; i ++ ) {
                var index = selected_idx[i];
                article_individuals[i].innerHTML = 
                    "<img src =\'"+ articlesList[index][2] +"\'" +" " + "width = 100px" + "</img>"
                +
                    "<a href=\'"+ articlesList[index][1] +"\'>" + articlesList[index][0] + "</a>";
            } 
}

init();