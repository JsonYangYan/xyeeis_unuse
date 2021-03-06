$(".total_span").click(function(){
	$(".total_span").removeClass("total_active").addClass("total_noraml");
	$(this).removeClass("total_normal").addClass("total_active");
	init();
});
var start_time = "2017-3";//开始时间 不要加0，如2016-2
var now = new Date();
var arr = start_time.split('-');
var start_year = arr[0];//开始年份
var start_month = arr[1];//开始月份
var month = now.getMonth()+1;//现在的月份
var year = now.getFullYear();//现在的年份
var count = ( year-start_year ) * 12 + month - start_month +1;//循环的次数
var data = [];
for( i=0; i<count; i++) {
	
	if (start_month < 10) {
  		start_month = "0" + start_month;
	}
	data[i] = start_year + "-" +start_month;
	if(start_month == 12) {
		start_year++;
		start_month =0;
	}
	start_month++;
}
for(var i=0; i<data.length;i++) {
	$(".total_title").append("<span class='total_span total_noraml'>"+data[i]+"</span>");
}

$(".total_title span:last-child").removeClass("total_noraml").addClass("total_active");
$(".total_span").click(function(){
	$(".total_span").removeClass("total_active").addClass("total_noraml");
	$(this).removeClass("total_normal").addClass("total_active");
	init();
});

var formNewArr_func_1 = function(divplace,title,type) { 
	var temp_array =  new Array();
	
	 $.ajax({
		 url: "../../../servlet/QxTpStatisticsServlet",
		 type: "POST",
		 data:{
			 operation:"wholestatistics",
			 "currentdate":$(".total_title").find(".total_active").html(),
		 },
		 success:function(data) {
			 var data = JSON.parse(data);
			 if( type == "pie" ){
				 for(var i=0;i<data.length;i++){
					 temp_array.push([data[i].name,data[i].value]);   //将JASON格式的文本存进去
				 }	
				title = data[0].area + title;
				$("#d_title").text(title);
				$("#school_list h2").html(title);
				$("#data").text(temp_array[0][1] + "%");
				$("#data_describe").text(temp_array[0][0]);
				var school_done_sum = data[0].subnum;
				var school_not_sum = data[0].totalnum-data[0].subnum;
				$("#d_info").html("<li style='background:#3bb2d0;color:#FFF;margin-bottom:10px;'><span style='color:#FFF;'>" + school_done_sum + "</span>个学校" + temp_array[0][0] + "</li><li style='background:#3bb2d0;color:#FFF;'><span style='color:#FFF;'>" + school_not_sum + "</span>个学校" + temp_array[1][0] + "</li>");
				 				 
				     build_pieTable(divplace,title,temp_array);  //生成饼状图   将JASON格式的文本
			 }
			 else{
				    var temp_data = new Array();
				    var temp_area = new Array();
				    for (var i = 0; i < data.length; i++) {
					    temp_area.push(data[i].name);
					    temp_data.push(data[i].value);
				    }
				    getBlankChart(divplace,title,"提交学校",temp_area,temp_data,'%');   //生成执折线图	
			 }
         },
         error:function() {
             alert("操作失败！！");
         }
	 });
}

function show_sch(sch_status) {
	$.ajax({
		url: "../../../servlet/QxTpStatisticsServlet",
		type: "POST",
		data:{
			operation:"getschoolname",
			"currentdate":$(".total_title").find(".total_active").html()
		},
		success:function(data) {
			var data = JSON.parse(data);
			$html = "<h2>"+ data[0].area +"信息化数据提交情况</h2>"
			$html += "<ul><li style='font-size:16px;'>学校名称</li><li style='font-size:16px;'>提交状态</li></ul>";
			if(sch_status == 1){
				var	sch_sta = "已提交";
			}else if(sch_status == 0){
				var	sch_sta = "未提交";
			}
			for(var i=0; i<data.length; i++){
				if(data[i].status == sch_status){
					$html += "<ul><li>" + data[i].name + "</li><li>"+sch_sta+"</li></ul>";
				}
			}
			$("#school_list").html($html);	
		},
		error:function() {
			
		}
	});
}
//翻页
$("#page_numbers").on("click",".goPageLink",function() {
    var linkId = $(this).attr("id").split("_");
    var goPageNo = new Number(linkId[3]);
    goPage(goPageNo);
})

//size每页显示的条数， pageNo第几页
var getPageJSON = function(size, pageNo) {
	var pageJSON = {"schoolData" : []};

	if (schoolJSON.schoolData.length <= size) {
		return schoolJSON;
	} else {
		for (var i = 0; i < size; i++) {
			if ((pageNo - 1) * size + i < schoolJSON.schoolData.length) {
				pageJSON.schoolData[i] = schoolJSON.schoolData[(pageNo - 1) * size + i];
			}
		}
		return pageJSON;
	}
};

//跳转页面
var goPage = function(pageNo) {

    //更新设置当前页面
    currentPageNo = pageNo;

    //获取当前页面数据
    currentPageJSON = getPageJSON(pageSize, pageNo);
    //显示数据
    showData(currentPageJSON);
};

//显示数据
var showData = function(data) {
	
	//获取当前数据，加载模版显示
	currentPageJSON = getPageJSON(pageSize, currentPageNo);
	$("#question").html(TrimPath.processDOMTemplate("list_template", currentPageJSON));
	
	//加载翻页按钮
	var totalItems = "" + schoolJSON.schoolData.length;

	//总记录数
	var currentPage = "" + currentPageNo;

	//当前页
	var totalPage = "" + Math.ceil(schoolJSON.schoolData.length / pageSize);

	//总页数
	$("#page_numbers").html(makePaging(totalItems, currentPage, totalPage, true, true));
	
}

/*
 * 初始化
 */	
	//分页
	//用于存储从后台获取的数据,所有数据
	var schoolJSON = {schoolData:[]};

	//当前页的数据
	var currentPageJSON = {};

	//当前处于第几页
	var currentPageNo = 1;

	//每页显示的条数
	var pageSize = 13;


//显示区域提交学校情况
function showSchool() {
	$.ajax({
		url: "../../../servlet/QxTpStatisticsServlet",
		type: "POST",
		data:{
			operation:"getschoolname",
			"currentdate":$(".total_title").find(".total_active").html()
		},
		success:function(data) {
			var data = JSON.parse(data);
			schoolJSON.schoolData = data;
			showData(data);
//			var area = data[0]["area"];
//			$("#school_list h2").html(area+"信息化数据提交情况");
		},
		error:function() {
			
		}
	});
};

//查询特定学校
function srearchSchool() {
	var schoolname = $("#schoolname").val();
	$.ajax({
		url: "../../../servlet/QxTpStatisticsServlet",
		type: "POST",
		data:{
			"schoolName":schoolname,
			"operation":"searchschool",
			"currentdate":$(".total_title").find(".total_active").html()
		},
		success:function(data) {
			var data = JSON.parse(data);
			schoolJSON.schoolData = data;
			if(data.length>0) {
				showData(data);
			}else{
				$("#question").html("无此学校,请输入正确的学校名字！");
			}
	
		},
		error:function() {
			
		}
	});
};


//隐藏“更新成功”提示语
function hideRedNotic() {
	document.getElementById('updata_notic_1').style.display='none';
}

//事件绑定函数
var bindevent = function() {
	
	$("#update_btn").click(function() {
		var title = $(this).prev().find(".d_title").text();
		var divplace = $(this).parent().parent().next().attr("id");
		var temp_array =  new Array();
		formNewArr_func_1("#"+divplace,title);
	});
	
	$("#sreachschbtn").click(function(){
		srearchSchool();
	});
}
	
//初始化函数
var init = function() {
	//加载右侧信息
	var loadDatefromDB = function(operation,title,func,num) { 
		var temp_arr = new Array();
		$.ajax({
			url: "../../../servlet/TpStatisticsServlet",
			type: "POST",
			data:{
				operation: "classifystatistics",
				"func": func,
				"currentdate":$(".total_title").find(".total_active").html()
			},
			success:function(data) {
				// config.log(data);
				if(num == 0) {
					var json = eval(data);
					for(var i=0; i<json.length; i++){
						temp_arr.push([json[i].name,json[i].value]);
					}
					$("#d_title").text(title);
					$("#data").text(temp_arr[0][1] + "%");
					$("#data_describe").text(temp_arr[0][0]);
					$("#d_info").html("<li><span>" + temp_arr[0][1] + "</span>个学校" + temp_arr[0][0] + "</li><li><span>" + temp_arr[1][1] + "</span>个学校" + temp_arr[1][0] + "</li>"); 
				}else{
					var json = eval(data);
					for(var i=0; i<json.length; i++){
						temp_arr.push([json[i].name,json[i].value,json[i].area_total,json[i].state_total,json[i].area_id]);
					}
					$("#a_title").text(title);
					var valuedata = 0;
					for(var i=0; i<temp_arr.length; i++){
						valuedata += temp_arr[i][1];
					}
					valuedata = temp_arr[0][1]/valuedata * 100; 
					$("#a_data").text(valuedata.toFixed(2) + "%");
					$html = "<table><tr><td>区域</td><td>试点学校</td><td>已提交数据</td></tr>";
					for(var i = 0; i < temp_arr.length; i++) {
						$html += "<tr><td><a href='#" + temp_arr[i][4] + "'>" + temp_arr[i][0] + "</a></td><td>"+ temp_arr[i][2] + "</td><td>" + temp_arr[i][3] + "</td></tr>"; 
					}
					$html += "</table>";
					$("#a_info").html($html);
				}
				      
	        },
	        error:function() {	        	
	            alert("操作失败！！");
	        }
		});
	};
	
	var initevent = function() { //初始化页面
		var arr = ["#tablePlaceforWhole","信息化数据提交情况","pie"];
		var brr = ["#tablePlaceforArea","信息化数据提交情况","column"];
		
		
		formNewArr_func_1(arr[0],arr[1],arr[2]);   //获取饼状图所需数据，并进行数据重组
		formNewArr_func_1(arr[0],arr[1],arr[2]);   //获取饼状图所需数据，并进行数据重组
	};
	
	//初始化饼状图
	initevent();
	
	//事件绑定
	bindevent();
	showSchool();
};

init();	

$(".statistcs").click(function(){
	window.location.href="../../tp_dataactuality/html/dataactuality.html";
});