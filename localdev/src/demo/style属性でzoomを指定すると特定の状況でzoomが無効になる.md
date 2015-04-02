<style>
html,body{
    margin:0;
}
body{
    padding: 15px;
    background: url(bg50px.gif) repeat 15px 15px;
}
#ctrl{
    height: 50px;
    font-size: 18px;
    line-height: 50px;
}
#zoomVal{
    width: 3em;
    color: red;
}
#target{
    zoom: 2;
    box-sizing: border-box;
    width: 300px;
    border: 4px solid skyblue;
}
</style>
<script>
function addZoom(){
    var tar = document.getElementById('target');
    var val = document.getElementById('zoomVal').value;
    tar.style.zoom = val;
}

function removeZoom(){
    var tar = document.getElementById('target');
    tar.style.zoom = '';
}
</script>

---

<div id="ctrl">
    <input type="number" id="zoomVal" value="2">
    <button onclick="addZoom();">add style="zoom: N"</button>
    <button onclick="removeZoom();">remove style="zoom: N"</button>
</div>
<div id="target">
    <div>この要素は幅300pxです。以下のスタイルが指定されています。</div>
    <xmp>    #target{
        zoom: 2;
        box-sizing: border-box;
        width: 300px;
        border: 1px solid skyblue;
    }</xmp>
</div>
<p><a href="http://dskd.jp/archives/50.html">記事に戻る</a></p>