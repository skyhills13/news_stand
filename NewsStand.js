function init() {
    registerEvents();
    readImgFromJson();
}
            
// 클릭 이벤트//
function registerEvents() {
        
        // 네이게이션 펼치기 부분
        var navListener = document.getElementById('navListener');
        navListener.addEventListener('click', toggleMenu, false );
    
        var noneButtons = document.getElementsByClassName('alertNone'); // 구현
																		// 페이지가
																		// 없는
																		// 버튼들을
																		// 묶어서
																		// 같은
																		// 클래스로
																		// 만듦
        for( var i = 0; i<noneButtons.length ; i++){
            noneButtons[i].addEventListener('click', alertNone, false);
        }
    
        var fix_area = document.querySelector(".contents_fix_area");
        fix_area.addEventListener('click', rolling, true);
    
        var add_magazine_tag = document.getElementById("add_magazine_tag");
        add_magazine_tag.addEventListener('click', addMagazine, false);
}
      
function toggleMenu(e) {
    
    e.preventDefault();
    
    var magazine_menu = document.getElementById('magazine_menu');       
    var magazine_display = getStyle(magazine_menu, 'display');
    
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
 	var template = document.getElementById("template");	
	var templateInnerHTML = template.innerHTML;

	var url = "./NewsStand.json";
	var request = new XMLHttpRequest();
	
	request.open("GET", url, false); // false면 sync. 다 수행되야지 밑으로 넘어간다. true면
										// async. 바로 밑으로 내려가고 나중에 완료시 시행
	request.onreadystatechange=function() {
        
    // if ( request.readyState === 4 && request.status === 200 ) {
    if ( request.readyState === 4 ) { // 톰캣이 아니니까 status는 체크 안하는걸로~
			var result = request.responseText;
                
            var responseArray = JSON.parse(result); // json파일에 5개짜리 배열로 저장되어 있다.
													// [object, object, object,
													// object, object]
            // console.log("responseArray : ".concat(responseArray));
            var resultStringArray = new Array(5);
                
            var compiled = _.template(templateInnerHTML);
                
            for ( var i = 0 ; i < responseArray.length ; ++i ) {
                // console.log("responseArray :
				// ".concat(responseArray[i].title));
                var result = compiled( {title_template : responseArray[i].title, index_template : responseArray[i].index });
                // html상에 선언한 변수: xhr통신 후 response한 데이터에서 key(title)값으로 가져온 것을
				// 대입
                resultStringArray[i] = result;
            }
			
                
            var content1 = document.getElementById("contents1");
            // console.log("content1 : ".concat(content1));
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


function addMagazine (e) {
    e.preventDefault();
    var content = document.querySelector(".contents_full_area").children[2];
    var content_index = content.querySelector("#index").innerHTML;
    var content_foot_navi_img;
    
	var url = "./NewsStand.json";
	var request = new XMLHttpRequest();
	
	request.open("GET", url, false); // false면 sync. 다 수행되야지 밑으로 넘어간다. true면
										// async. 바로 밑으로 내려가고 나중에 완료시 시행
	request.onreadystatechange=function() {
            
        // if ( request.readyState === 4 && request.status === 200 ) {
        if ( request.readyState === 4 ) {
                var result = request.responseText;
                var responseArray = JSON.parse(result); // json파일에 5개짜리 배열로 저장되어
														// 있다. [object, object,
														// object, object,
														// object]
                content_foot_navi_img = responseArray[content_index].foot_navi;
        }
	}
	request.send(null);
    
   var foot_navi_div = document.getElementById("magazine_menu");
    var template = "<a href = '#'><img src='<%=foot_navi_template%>'></a>";
    var compiled = _.template(template);
    var result = compiled( {foot_navi_template : content_foot_navi_img });
    foot_navi_div.insertAdjacentHTML('afterbegin', result);
}

// 신문기사 배치하는 부분//
function setArticles( contentElement ){
      
    var articlesList;
        
    var url = "./NewsStand_article.json";
	var request = new XMLHttpRequest();
	
	request.open("GET", url, false);
	request.onreadystatechange=function() {
          
            if ( request.readyState === 4 ) {
                var resultString = request.responseText;
                //console.log(resultString);
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
                if(selected_idx.indexOf(index) != -1) { // index가 있으면 중복되니까
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

function rolling(e){
    e.preventDefault();
    var targetName = e.target.className;
    
    // 롤링할 대상 (contents집합)
    var contents = document.querySelector(".contents_full_area");
        
    var setting = new Object();
    setting.direction = null;
    
    if ( targetName === "left_rolling_btn") {
        setting.direction = -1;
    } else if ( targetName === "right_rolling_btn" ) {
        setting.direction = 1;
        
    // 롤링버튼이 아닐경우 함수를 탈출
    } else {
        return;
    }
        
    // rolling을 stop하기 위해서 setInterval함수의 리턴값의 아이디를 저장
    setting.id = null;
    
    // 현재 롤링이 얼마만큼 진행됬는지를 파악하기 위해 저장
    setting.count = 0;
    
    // 938이 나누어떨어지는 수로 해야ㅏ널이ㅏ럼니ㅑ더랴ㅣ머리ㅑㄷ널ㄴ
    // 롤링버튼 클릭한번할때 content가 총 66번 움직이게
    setting.max = 67;
    setting.id = setInterval(function() { (move)(setting,contents);	}, 3);
}

function move (setting, contents) {
    var leftValue = parseInt(getStyle(contents, 'left'));	
	    ++setting.count;// 한번 move할때마다 count가 1씩 증가
	contents.style.left = leftValue + (setting.direction * 14) +"px";
	// 14씩 66회(max회) 이동했을 경우
	if ( setting.max < setting.count ) {
		clearInterval(setting.id);
		setting.count = 0;		
        
        if ( setting.direction === -1 )
            contents.insertBefore(contents.children[0] , contents.children[5]);// 맨 앞을
																				// 맨뒤로
        else
            contents.insertBefore(contents.children[4] , contents.children[0]);// 맨뒤에
																				// 있는
																				// 페이지
																				// 맨 앞로
																				// 보내는거
    
        contents.style.left = leftValue + (setting.direction * -938)+"px";// 옮긴거
																			// 다시
																			// 되돌려야되니까
    }
}

init();