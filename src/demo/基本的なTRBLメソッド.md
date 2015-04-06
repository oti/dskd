<style>
.wrap{
  position: relative;
  width: 300px;
  height: 300px;
}

.inner{
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;

  width: 100px;
  height: 100px;
}

/* for Debug */
.wrap{
  border: 2px solid magenta;
  resize: both;
  overflow: hidden;
}

.inner{
  border: 2px solid navy;
  background-color: skyblue;
  overflow:hidden;
  resize:both;
}
</style>

---

<div class="wrap">
    <div class="inner"></div>
</div>