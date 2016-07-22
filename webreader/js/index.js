//localStorage ����
(function(){
    //Util �Ե��ñհ�����  ���� ����getJSONP��set/get storage
    var Util=(function(){
        var prefix='_reader'; //���ش洢����ǰ׺
        var StorageGetter=function(key){
            return localStorage.getItem(prefix+key)
        }
        var StorageSetter=function(key,val){
            return localStorage.setItem(prefix+key,val)
        }
//JSONP
        var getJSONP=function(url,callback){
            return $.jsonp({
                url:url,
                cache:true,
                callback:'duokan_fiction_chapter',
                success:function(result){
                    //debugger �ϵ���Բ鿴ת�����
                    var data=$.base64.decode(result)
                    var json=decodeURIComponent(escape(data));
                    callback(json);
                }
            })
        }
        return {
            getJSONP:getJSONP,
            StorageSetter:StorageSetter,
            StorageGetter:StorageGetter
        }
    })()

//ҳ���ʼ������ȫ�ֱ���
    var initfontsize=Util.StorageGetter('font_size')
    var initbackground=Util.StorageGetter('background_color');
    var neightdisplay=Util.StorageGetter('neight')
    var init360=Util.StorageGetter('background360');
//localStorage init

//localStorage font_size

    if(!initfontsize){
        initfontsize=14
    }else{
        parseInt(initfontsize)
        $('#format_container').css('font-size',initfontsize+'px')
    }
    //localStorage background

    if(!initbackground){
        initbackground='#e9dfc7'
    }else{
        $('body').css('background',initbackground)
    }
    //localStorage neight display

    if(neightdisplay=='true'){
        $('#neight').hide()
        $('#neight1').show()
    }else{
        $('#neight').show()
        $('#neight1').hide()
    }
    //localStorage init360
    if(init360){
        $('.bk-container-current').eq(init360-1).show()
    }
    var Dom={
        top_nav:$('#top_nav'),
        bottom_nav:$('#bottom_nav'),
        mulu:$('#mulu'),
        neight:$('neight'),
        font_set_button:$('#font_set_button'),
        font_container:$('#font_container'),
        nav_pannel_bk:$('.nav-pannel-bk'),
        format_container:$('#format_container')
    }
//��ں���
    function main(){

        var readerModel=ReaderModel();//����ajax��ں���

        var readerUI=ReaderBaseFrame($('#format_container'))//�Ķ���UI��Ⱦ�������� ����container
        readerModel.init(function(){
            readerUI(arguments[0])
        })
        EventHanlder();//�����¼�����ں���

    }
    function ReaderModel(){
        //ajax
        var Chapter_id;
//init ������������������������Լ��������ݺ�����ݵĴ������ҳ���е���Ⱦ
        var init = function(UIcallback){//ҳ����Ⱦ���� ����Ϊҳ����Ⱦ�Ļص�����


            getFictionInfo(function(){  //��ִ�������½��б��json���� Ȼ���ڻص�������ִ�������½����ݵ�getCurChapterContent����

                getCurChapterContent(Chapter_id,function(data){//�������½����ݣ�Ȼ����ִ�лص�������Ⱦ���󵽵�������ҳ����
                    //to do
                    UIcallback&&UIcallback(data)
                })
            })

        }
//���������½���Ϣ
        var getFictionInfo=function(callback){
            $.get('data/chapter.json',function(){
                //console.log(data); ע�⿴���󵽵����ݵĸ�ʽӴ
                //����½���Ϣ�Ļص�
                Chapter_id = arguments[0].chapters[1].chapter_id; //Charter_id ��ֵΪ����json�����chapters���� ��������һ�����������ԱΪjson��ʽ�Ķ�����������chapter_id����ֵ������ ������ǵڼ���
                callback&&callback()//Ȼ��ִ��getFictionInfo�Ļص�����
            },'json')

        }
//����½����ݺ���
        var getCurChapterContent=function(chapter_id,callback){


            $.get('data/data'+chapter_id+'.json',function(data){//��get������ȡҪ��ȡ��С˵����  ����1Ϊ �ַ���ƴ�ӵ�·�����ڶ�������Ϊ�ص�������$.getִ�����Ժ� ��õ��������� ����������Ϊ�涨��������������Ϊjson��ʽ
                //console.log(data)  ����һ��data Ϊjson���� ����Ҫ����Ĵ����Ǹ������json��������������б�̵ġ� �ڹ����кܶ�ʱ���ܵȺ�̨ʵ�ֹ�������ȥдǰ���߼����������ⶨһ�����ݸ�ʽ
                if(data.result==0){     //��֤��json�����ڵ����� �����֤�ɹ�˵��data���ɹ���������

                    var url=data.jsonp  //url Ϊjson �����jsonp����
                    Util.getJSONP(url,function(data){ //����jsonp����

                        callback&&callback(data) //����getCurChapterContent �����Ļص���������ΪdataҲ����ͨ����ȡ�½����ݵõ��ķ��ؽ��
                    })
                }
            },'json')
        }
        return{//����һ�����������ĺô��Ƿ���ֵӵ�������ռ� ֻ��ͨ��ReaderModel.init���Բ��ܷ��ʵ�init������
            init:init
        }
    }

    function ReaderBaseFrame(container){
        //Frame UI Node
        function parseChapterData(){//�����ַ���ƴ��
            //console.log(arguments[0])
            var jsonObj = JSON.parse(arguments[0]);
            //console.log(jsonObj) ��Ԫ����Ŷ
            var html="<h4>"+jsonObj.t+'</h4>';
            for(var i=0;i<jsonObj.p.length;i++){
                html+='<p>'+jsonObj.p[i]+'</p>';
            }
            return html//���������ַ���
        }
        return function(){//����һ��������������
            container.html(parseChapterData(arguments[0]))
        }
    }

//�¼���
    function EventHanlder(){
        //��Ļ���� �����ʾ���¹��ܲ˵�
        $('#action_mid').click(function(){
            if(Dom.top_nav.css('display')=='none'){
                Dom.bottom_nav.show();
                Dom.top_nav.show()
            }else{
                Dom.font_container.hide()
                Dom.nav_pannel_bk.hide()
                Dom.bottom_nav.hide();
                Dom.top_nav.hide();
            }
        })
        //���������Լ�����ɫѡ�
        $('#font_set_button').click(function(){
            if(Dom.font_container.css('display')=='none'){
                Dom.font_container.show()
                Dom.nav_pannel_bk.show()
                this.className='current'
            }else{
                Dom.font_container.hide()
                Dom.nav_pannel_bk.hide()
                this.className=''
            }
        })
        //�л�ҹ��ģʽ
        $('#neight').click(function(){
            initbackground='#0f1410'
            init360=6
            $(this).hide()
            $('#neight1').show()
            $('body').css('background',initbackground)
            $('.bk-container-current').hide()
            $('.bk-container-current').eq(5).show()
            Util.StorageSetter('neight','true')
            Util.StorageSetter('background_color',initbackground)
            Util.StorageSetter('background360',init360)

        })
        //�л��ռ�ģʽ
        $('#neight1').click(function(){
            initbackground='#e9dfc7'
            init360=2
            $(this).hide()
            $('#neight').show()
            $('body').css('background',initbackground)
            $('.bk-container-current').hide()
            $('.bk-container-current').eq(1).show()
            Util.StorageSetter('neight','false')
            Util.StorageSetter('background_color','#e9dfc7')
            Util.StorageSetter('background360',init360)
        })
        //�Ŵ�����
        $('#large-font').click(function(){
            if(initfontsize<24){
                initfontsize++
                Dom.format_container.css('font-size',initfontsize)
                Util.StorageSetter('font_size',initfontsize)
            }
        })
        //��С����
        $('#small-font').click(function(){
            if(initfontsize>13){
                initfontsize--
                Dom.format_container.css('font-size',initfontsize)
                Util.StorageSetter('font_size',initfontsize)
            }
        })
        //background�л�
        $('.bk-container').click(function(){
            if($(this).index()==6){
                $('#neight').hide()
                $('#neight1').show()
                Util.StorageSetter('neight','true')
            }else{
                if($('#neight').css('display')=='none'){
                    $('#neight').show()
                    $('#neight1').hide()
                    Util.StorageSetter('neight','false')
                }
            }
            initbackground=$(this).data('color')
            init360=$(this).index()
            $('.bk-container-current').hide()
            $(this).children().show()
            $('body').css('background',initbackground)
            Util.StorageSetter('background_color',initbackground)
            Util.StorageSetter('background360',init360)
        })

        $(window).scroll(function(){
            Dom.font_container.hide()
            Dom.nav_pannel_bk.hide()
            Dom.bottom_nav.hide();
            Dom.top_nav.hide();
        })
    }
    main()
})()
