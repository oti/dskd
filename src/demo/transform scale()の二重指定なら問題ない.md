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
    transform-origin: 0 0;
    transform: scale(2);
    box-sizing: border-box;
    width: 300px;
    border: 4px solid magenta;
}
</style>
<script>
function addScale(){
    var tar = document.getElementById('target');
    var val = document.getElementById('zoomVal').value;
    tar.style.transform = 'scale('+val+')';
}

function removeScale(){
    var tar = document.getElementById('target');
    tar.style.transform = '';
}
</script>

---

<div id="ctrl">
    <input type="number" id="zoomVal" value="2">
    <button onclick="addScale();">add style="transform: scale(N)"</button>
    <button onclick="removeScale();">remove style="transform: scale(N)"</button>
</div>
<div id="target">
    <div>この要素は幅300pxです。以下のスタイルが指定されています。</div>
    <xmp>    #target{
        transform-origin: 0 0;
        transform: scale(2);
        box-sizing: border-box;
        width: 300px;
        border: 1px solid magenta;
    }</xmp>
</div>