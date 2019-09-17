$("#generate").click(function () {
    var tree = {};
    var nodeLink = {};
    var num = $("input[name=number]").val() || 0;
    var fixed_weight_checked = $("input[name=fixed]").prop("checked");
    var fixed_weight = $("input[name=fixed-weight]").val();
    nodeLink.nodes = [];
    nodeLink.links = [];
    for (var i = 0; i < num; i++) {
        var node = {};
        node.id = NickNameUtil.getStringRandom(30);
        node.nickName = NickNameUtil.getRandomName(4);                
        node.gender=Math.round(Math.random())==1?'男':'女';
        node.filePath="";
        nodeLink.nodes.push(node);
    }
    var nodes = nodeLink.nodes;
    i=0;
    for (key in nodes) {
        var randomTargetKey = Math.floor(Math.random() * nodes.length);
        link = {}
        link.source = nodes[key].id;
        if(nodes[randomTargetKey].id==link.source){
            i++;
            continue;
        }else{
            link.target = nodes[randomTargetKey].id;
            link.value = fixed_weight_checked ? fixed_weight : Math.ceil(Math.random() * 20);
            nodeLink.links.push(link);
        }
    }
    for (key in nodes) {
        var randomTargetKey = Math.floor(Math.random() * nodes.length);
        link = {}
        link.source = nodes[key].id;
        if(nodes[randomTargetKey].id==link.source){
            i++;
            continue;
        }else{
            link.target = nodes[randomTargetKey].id;
            link.value = fixed_weight_checked ? fixed_weight : Math.ceil(Math.random() * 20);
            nodeLink.links.push(link);
        }
    }
    // for (key in nodes) {
    //     var randomTargetKey = Math.floor(Math.random() * nodes.length);
    //     link = {}
    //     link.source = nodes[key].id;
    //     if(nodes[randomTargetKey].id==link.source){
    //         i++;
    //         continue;
    //     }else{
    //         link.target = nodes[randomTargetKey].id;
    //         link.value = fixed_weight_checked ? fixed_weight : Math.ceil(Math.random() * 20);
    //         nodeLink.links.push(link);
    //     }
    // }
    console.log(i);
    $("#result").val(JSON.stringify(nodeLink));
    console.log(nodeLink);
});

$("#copy").click(function () {
    var result =  document.getElementById("result");
    result.select();
    document.execCommand("Copy");
});



function NickNameUtil() {}

//自动生成名字（中文）,可以生产17万的唯一名字
NickNameUtil.getRandomChineseName = function () {
    firstname = ["赵", "钱", "孙", "李", "周", "吴", "郑", "王",
        "冯", "陈", "楮", "卫", "蒋", "沈", "韩", "杨",
        "朱", "秦", "尤", "许", "何", "吕", "施", "张",
        "孔", "曹", "严", "华", "金", "魏", "陶", "姜",
        "戚", "谢", "邹", "喻", "柏", "水", "窦", "章",
        "云", "苏", "潘", "葛", "奚", "范", "彭", "郎",
        "鲁", "韦", "昌", "马", "苗", "凤", "花", "方",
        "俞", "任", "袁", "柳", "酆", "鲍", "史", "唐",
        "费", "廉", "岑", "薛", "雷", "贺", "倪", "汤",
        "滕", "殷", "罗", "毕", "郝", "邬", "安", "常",
        "乐", "于", "时", "傅", "皮", "卞", "齐", "康",
        "伍", "余", "元", "卜", "顾", "孟", "平", "黄",
        "和", "穆", "萧", "尹", "姚", "邵", "湛", "汪",
        "祁", "毛", "禹", "狄", "米", "贝", "明", "臧",
        "计", "伏", "成", "戴", "谈", "宋", "茅", "庞",
        "熊", "纪", "舒", "屈", "项", "祝", "董", "梁",
        "杜", "阮", "蓝", "闽", "席", "季", "麻", "强",
        "贾", "路", "娄", "危", "江", "童", "颜", "郭",
        "梅", "盛", "林", "刁", "锺", "徐", "丘", "骆",
        "高", "夏", "蔡", "田", "樊", "胡", "凌", "霍",
        "虞", "万", "支", "柯", "昝", "管", "卢", "莫",
        "经", "房", "裘", "缪", "干", "解", "应", "宗",
        "丁", "宣", "贲", "邓", "郁", "单", "杭", "洪",
        "包", "诸", "左", "石", "崔", "吉", "钮", "龚",
        "程", "嵇", "邢", "滑", "裴", "陆", "荣", "翁",
        "荀", "羊", "於", "惠", "甄", "麹", "家", "封",
        "芮", "羿", "储", "靳", "汲", "邴", "糜", "松",
        "井", "段", "富", "巫", "乌", "焦", "巴", "弓",
        "牧", "隗", "山", "谷", "车", "侯", "宓", "蓬",
        "全", "郗", "班", "仰", "秋", "仲", "伊", "宫",
        "宁", "仇", "栾", "暴", "甘", "斜", "厉", "戎",
        "祖", "武", "符", "刘", "景", "詹", "束", "龙",
        "叶", "幸", "司", "韶", "郜", "黎", "蓟", "薄",
        "印", "宿", "白", "怀", "蒲", "邰", "从", "鄂",
        "索", "咸", "籍", "赖", "卓", "蔺", "屠", "蒙",
        "池", "乔", "阴", "郁", "胥", "能", "苍", "双",
        "闻", "莘", "党", "翟", "谭", "贡", "劳", "逄",
        "姬", "申", "扶", "堵", "冉", "宰", "郦", "雍",
        "郤", "璩", "桑", "桂", "濮", "牛", "寿", "通",
        "边", "扈", "燕", "冀", "郏", "浦", "尚", "农",
        "温", "别", "庄", "晏", "柴", "瞿", "阎", "充",
        "慕", "连", "茹", "习", "宦", "艾", "鱼", "容",
        "向", "古", "易", "慎", "戈", "廖", "庾", "终",
        "暨", "居", "衡", "步", "都", "耿", "满", "弘",
        "匡", "国", "文", "寇", "广", "禄", "阙", "东",
        "欧", "殳", "沃", "利", "蔚", "越", "夔", "隆",
        "师", "巩", "厍", "聂", "晁", "勾", "敖", "融",
        "冷", "訾", "辛", "阚", "那", "简", "饶", "空",
        "曾", "毋", "沙", "乜", "养", "鞠", "须", "丰",
        "巢", "关", "蒯", "相", "查", "后", "荆", "红",
        "游", "竺", "权", "逑", "盖", "益", "桓", "公",
        "佟", "商", "楚", "岳", "万俟", "司马", "上官", "欧阳",
        "夏侯", "诸葛", "闻人", "东方",
        "赫连", "皇甫", "尉迟", "公羊",
        "澹台", "公冶", "宗政", "濮阳",
        "淳于", "单于", "太叔", "申屠",
        "公孙", "仲孙", "轩辕", "令狐",
        "锺离", "宇文", "长孙", "慕容",
        "鲜于", "闾丘", "司徒", "司空",
        "丌官", "司寇", "左丘", "子车",
        "颛孙", "端木", "巫马", "公西",
        "漆雕", "乐正", "壤驷", "公良",
        "拓拔", "夹谷", "宰父", "谷梁"
    ];
    namelist = [
        "爱", "芳", "伟", "兰", "花", "影", "英", "音",
        "敏", "静", "丽", "乐", "秀", "强", "光", "杰",
        "洁", "倩", "君", "如", "勇", "风", "峰", "磊",
        "娟", "艳", "涛", "平", "刚", "剑", "霞", "燕",
        "梅", "妍", "亲", "婷", "青", "源", "辉", "荣", "蓉", "靖", "军",
        "澄邈", "德泽", "海超", "海阳", "海荣", "海逸", "海昌", "瀚钰", "瀚文", "涵亮", "涵煦", "涵蓄",
        "涵衍", "浩皛", "浩波", "浩博", "浩初", "浩宕", "浩歌", "浩广", "浩涆", "浩瀚", "浩慨", "浩阔",
        "浩邈", "浩气", "浩然", "浩思", "浩言", "鸿宝", "鸿波", "鸿博", "鸿才", "鸿畅", "鸿畴", "鸿达",
        "鸿德", "鸿飞", "鸿风", "鸿福", "鸿光", "鸿晖", "鸿朗", "鸿文", "鸿熙", "鸿羲", "鸿禧", "鸿信",
        "鸿轩", "鸿煊", "鸿骞", "鸿远", "鸿云", "鸿运", "鸿哲", "鸿祯", "鸿志", "鸿卓", "嘉澍", "光济",
        "澎湃", "彭泽", "鹏池", "鹏海", "浦和", "浦泽", "瑞渊", "越泽", "泽洋", "泽雨", "泽民", "哲瀚",
        "博耘", "德运", "辰宇", "辰皓", "辰钊", "辰铭", "辰锟", "辰阳", "辰龙", "辰韦", "辰良", "辰沛",
        "晨轩", "晨涛", "晨濡", "晨潍", "鸿振", "吉星", "铭晨", "起运", "胤运", "佑运", "允晨", "运恒",
        "运凡", "运凯", "运鹏", "运浩", "运诚", "运良", "运鸿", "运锋", "运盛", "运升", "运杰", "运珹",
        "运珧", "运骏", "运凯", "运乾", "维运", "运晟", "运莱", "运华", "运发", "云天", "耘志", "耘涛",
        "耘豪", "星爵", "星腾", "星睿", "星泽", "星鹏", "星然", "震轩", "震博", "康震", "震博", "振强",
        "振博", "振华", "振宇", "振锐", "振凯", "振海", "振国", "振平", "振荣", "振翱", "中震", "子辰",
        "昂然", "昂雄", "昂杰", "昂熙", "昌勋", "昌盛", "昌淼", "昌茂", "昌黎", "昌燎", "昌翰", "晨朗",
        "德明", "德昌", "德曜", "范明", "飞昂", "高朗", "高旻", "晗日", "晗昱", "瀚玥", "瀚昂", "瀚彭",
        "昊然", "昊天", "昊苍", "昊英", "昊宇", "昊嘉", "昊明", "昊伟", "昊硕", "昊磊", "昊东", "鸿晖",
        "鸿朗", "华晖", "金鹏", "晋鹏", "敬曦", "景明", "景天", "景浩", "景行", "景中", "景逸", "景彰",
        "景平", "俊晖", "君昊", "昆琦", "昆鹏", "昆纬", "昆宇", "昆锐", "昆卉", "昆峰", "昆颉", "昆谊",
        "昆皓", "昆鹏", "昆明", "昆杰", "昆雄", "昆纶", "鹏涛", "鹏煊", "绍晖", "文昂", "文景", "曦哲",
        "曦晨", "曦之", "新曦", "鑫鹏", "旭彬", "旭尧", "旭鹏", "旭东", "旭炎", "炫明", "宣朗", "学智",
        "轩昂", "彦昌", "曜坤", "曜栋", "曜文", "曜曦", "曜灿", "曜瑞", "永昌", "子昂", "智宇", "智晖",
        "智伟", "智杰", "智刚", "智阳", "昌勋", "昌盛", "昌淼", "昌茂", "昌黎", "昌燎", "昌翰", "晨朗",
        "昂然", "昂雄", "昂杰", "昂熙", "范明", "飞昂", "高朗", "高旻", "晗日", "晗昱", "瀚玥", "瀚昂",
        "德明", "德昌", "德曜", "智伟", "智杰", "智刚", "智阳", "瀚彭", "旭炎", "炫明", "宣朗", "学智",
        "昊然", "昊天", "昊苍", "昊英", "昊宇", "昊嘉", "昊明", "昊伟", "昊硕", "昊磊", "昊东", "鸿晖",
        "鸿朗", "华晖", "金鹏", "晋鹏", "敬曦", "景明", "景天", "景浩", "景行", "景中", "景逸", "景彰",
        "昆皓", "昆鹏", "昆明", "昆杰", "昆雄", "昆纶", "鹏涛", "鹏煊", "绍晖", "文昂", "文景", "曦哲",
        "景平", "俊晖", "君昊", "昆琦", "昆鹏", "昆纬", "昆宇", "昆锐", "昆卉", "昆峰", "昆颉", "昆谊",
        "轩昂", "彦昌", "曜坤", "曜栋", "曜文", "曜曦", "曜灿", "曜瑞", "永昌", "子昂", "智宇", "智晖",
        "曦晨", "曦之", "新曦", "鑫鹏", "旭彬", "旭尧", "旭鹏", "旭东"
    ];

    var a = Math.floor(Math.abs(firstname.length * Math.random()));
    var b = Math.floor(Math.abs(namelist.length * Math.random()));
    var name = firstname[a] + namelist[b];
    return name;
}

//生成随机用户名，数字和字母组成,
NickNameUtil.getStringRandom = function (length) {
    var val = "";
    //参数length，表示生成几位随机数
    for (var i = 0; i < length; i++) {
        var charOrNum = Math.ceil(Math.random() * 2) % 2 == 0 ? "char" : "num";
        //输出字母还是数字
        if ("char" == charOrNum) {
            //输出是大写字母还是小写字母
            var temp = Math.floor(Math.random() * 2) == 0 ? 65 : 97;
            val += String.fromCharCode(Math.floor(Math.random() * 26) + temp);
        } else if ("num" == charOrNum) {
            val += Math.floor(Math.random() * 10);
        }
    }
    return val;
}

/**
 * 返回中英文名称，理论上可以生产  178000后面length个0 个唯一的用户名
 * @param length 随机生成的名字中英文字母的个数
 * @return
 */
NickNameUtil.getRandomName = function (length) {
    return NickNameUtil.getRandomChineseName() + NickNameUtil.getStringRandom(length);
}