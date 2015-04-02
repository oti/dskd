<style type="text/css">
html{margin:0;padding:0;}

body {
	marign: 0;
	padding: 10px;
	color: #363636;
	font-size: 90%;
	line-height: 1.6;
	background: #efefef;
}

ins {
	color: #bf1212;
	text-decoration: none;
}

img {
	marign: 0;
	padding: 0;
}

header {border-bottom: 1px solid #9f9f9f;}
footer {border-top: 1px solid #ffffff;}
footer#credit {border: none;}

section {
	padding: 0 0 2em;
	border-bottom: 1px solid #9f9f9f;
	border-top: 1px solid #ffffff;
}

.wrapper {
	width: 100%;
	height: 300px;
	position: relative;
	background: #333333;
	overflow:hidden;
	resize:both;
}

.wrapper2 {
	width: 100%;
	height: 300px;
	position: relative;
	background: #336699;
	resize:both;
}

.target {
	margin: auto;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
}

div.target {
	background: #a6a9af;
}

span.target {
	background: #a9afa6;
}

.sizing {
	width: 200px;
	height: 200px;
}

.flex {
	margin: -25%;
	position: absolute;
	top: 50%;
	bottom: 50%;
	left: 50%;
	right: 50%;
	background: #afa6a9;
}
</style>

---

<h1>インライン要素にpointer-events: none;を指定する</h1>

<pre title="HTML"><code data-language="html">&lt;div class="wrapper"&gt;
	&lt;img class="target" src="https://placekitten.com/g/250/250" /&gt;
&lt;/div&gt;</code></pre>

<pre title="CSS"<code data-language="css">.wrapper {
  position: relative;
}

.target {
  margin: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}</code></pre>


<h2 id="sam1">１）インラインブロック要素を絶対中央配置</h2>

<div class="wrapper">
	<img class="target" src="https://placekitten.com/g/250/250" />
</div>

<p>img要素にwidth属性やheight属性がなくても中央に配置してくれる。素敵。これを画像じゃない要素でやりたい。<ins>（※Opera 11.62 では width 属性と height 属性を指定しないと中央配置になりませんでした）</ins></p>
<p><ins datetime="2013-03-04T13:40+09:00">2013/3/4 追記）Opera 12.12 で width/height 属性によるサイズ指定がなくても絶対中央配置になっていることを確認しました。</ins></p>

<h2 id="sam2">２）ブロック要素を絶対中央配置</h2>
<div class="wrapper">
	<div class="target">ブロック要素<br>
  <pre><code data-language="css"> div.target {
  background: #a6a9af;
 }</code></pre></div>
</div>
<p>ブロックですからビタビタ。サイズが同じなだけで中央には配置されてるよね...でもやりたいのはそうじゃなくて。</p>


<h2 id="sam3">３）要素にサイズを与える</h2>
<div class="wrapper">
	<div class="target sizing">サイズを与えたブロック要素<br>
  <pre><code data-language="css"> div.target.sizing {
  width: 200px;
  height: 200px;
  background: #a6a9af;
 }</code></pre></div>
</div>
<p>サイズを与えれば絶対中央配置。これですこれ。</p>

<h2 id="sam4">４）インライン要素を絶対中央配置</h2>
<div class="wrapper">
<span class="target">インライン要素<br>
	<pre><code data-language="css"> span.target {
 background: #a9afa6;
 }</code></pre></span>
</div>
<p>インライン要素にスニペットをあてると、ブロック化されてないのに親要素にビタビタする。これが top,bottom,left,rightプロパティ全指定の力...</p>

<h2 id="sam5">５）インライン要素にサイズを与える</h2>
<div class="wrapper">
	<span class="target sizing">サイズを与えたインライン要素<br>
	<pre><code data-language="css"> span.target.sizing {
  width: 200px;
  height: 200px;
  background: #a9afa6;
 }</code></pre></span>
</div>
<p>ブロック化してないのにサイジングできた。これが top,bottom,left,rightプロパティ全指定の力！</p>

<h2 id="omk1">おまけ１）サイズが固定しないインライン要素を中央配置にする</h2>
<ins datetime="2012-11-19T12:20+09:00">※サンプルの対象要素のクラスセレクタに flex と書かれていますが、この記事は display: flex; を解説するものではありません。紛らわしくてすみません。</ins>
<div class="wrapper">
	<span class="flex"><pre><code data-language="css"> span.flex {
  margin: -25%;
  position: absolute;
  top: 50%;
  bottom: 50%;
  left: 50%;
  right: 50%;
 }</code></pre></span>
</div>

<p>ブロック化もサイズ指定もしてないのに面白いなーと思ったけど、これ普通にブロック要素の入れ子で padding 指定すれば position 指定とか全くいらないで同じことできますねー。<br>
しかもFirefoxとChromeでなんか表示が違ったので、このおまけは見なかったことにしてください！<br>
<img src="ss_ff.png" /> <img src="ss_ch.png" /></p>

<p>この違いについて、他のブラウザでも検証してみました。[<a href="archives/12.html"> 記事を見る </a>]</p>
</div>

<h2 id="omk2">おまけ２）親要素を overflow: hidden; しない</h2>
<ins datetime="2012-11-19T12:20+09:00">※サンプルの対象要素のクラスセレクタに flex と書かれていますが、この記事は display: flex; を解説するものではありません。紛らわしくてすみません。</ins>
<p>おまけ１までのサンプルでは .wrapper に oveflow: hidden; のスタイルを指定していました。Chromeとそれ以外で表示が違うのはそのせいかな？と思ったのですが...</p>

<div class="wrapper2">
	<span class="flex"><pre><cod> span.flex {
  margin: -25%;
  position: absolute;
  top: 50%;
  bottom: 50%;
  left: 50%;
  right: 50%;
 }</code></pre></span>
</div>

<p>理由はこれじゃないようです。親要素をはみ出しても、上下方向でセンタリングされています。これはこれで面白いですね。</p>
</div>