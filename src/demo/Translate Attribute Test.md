Translate service can understand '<span translate="no">translate</span>' attribute?

<p>Below &lt;div&gt; element has '<span translate="no">translate=no</span>'.</p>

<div translate="no" style="border: 1px solid tomato">[11:34:21] Using gulpfile ~/develop/mbrs/test-yargs/gulpfile.js
[11:34:21] Starting 'test'...
{ _: [ 'test' ],
  name: 'oti',
  male: true,
  female: 'false',
  'rain bringer': true,
  note: 'oti is not real name.',
  '$0': '/Users/tkg/.nodebrew/current/bin/gulp' }
[11:34:21] Finished 'conslog' after 1.83 ms</div>

<p>Below &lt;code&gt; element has '<span translate="no">translate=no</span>'.</p>

<code translate="no" style="border: 1px solid tomato">[11:34:21] Using gulpfile ~/develop/mbrs/test-yargs/gulpfile.js
[11:34:21] Starting 'test'...
{ _: [ 'test' ],
  name: 'oti',
  male: true,
  female: 'false',
  'rain bringer': true,
  note: 'oti is not real name.',
  '$0': '/Users/tkg/.nodebrew/current/bin/gulp' }
[11:34:21] Finished 'conslog' after 1.83 ms</code>

<p>Below &lt;pre&gt; element has '<span translate="no">translate=no</span>'.</p>

<pre translate="no" style="border: 1px solid tomato">[11:34:21] Using gulpfile ~/develop/mbrs/test-yargs/gulpfile.js
[11:34:21] Starting 'test'...
{ _: [ 'test' ],
  name: 'oti',
  male: true,
  female: 'false',
  'rain bringer': true,
  note: 'oti is not real name.',
  '$0': '/Users/tkg/.nodebrew/current/bin/gulp' }
[11:34:21] Finished 'conslog' after 1.83 ms</pre>

<p>Below &lt;samp&gt; element has '<span translate="no">translate=no</span>'.</p>

<samp translate="no" style="border: 1px solid tomato">[11:34:21] Using gulpfile ~/develop/mbrs/test-yargs/gulpfile.js
[11:34:21] Starting 'test'...
{ _: [ 'test' ],
  name: 'oti',
  male: true,
  female: 'false',
  'rain bringer': true,
  note: 'oti is not real name.',
  '$0': '/Users/tkg/.nodebrew/current/bin/gulp' }
[11:34:21] Finished 'conslog' after 1.83 ms</samp>

<p>Below &lt;kbd&gt; element has '<span translate="no">translate=no</span>'.</p>

<kbd translate="no" style="border: 1px solid tomato">[11:34:21] Using gulpfile ~/develop/mbrs/test-yargs/gulpfile.js
[11:34:21] Starting 'test'...
{ _: [ 'test' ],
  name: 'oti',
  male: true,
  female: 'false',
  'rain bringer': true,
  note: 'oti is not real name.',
  '$0': '/Users/tkg/.nodebrew/current/bin/gulp' }
[11:34:21] Finished 'conslog' after 1.83 ms</kbd>

<p>Below is nesting '<span translate="no">translate</span>' sample. outer &lt;div&gt; element has '<span translate="no">translate=no</span>'. inner &lt;p&gt; element has '<span translate="no">translate=yes</span>'.</p>

<div translate="no" style="border: 1px solid tomato">
  <p translate="yes">this p element has 'translate=yes'. below pre element doesn't have 'translate' attribute. these parent div element has 'translate=no'.</p>
  <pre>[11:34:21] Using gulpfile ~/develop/mbrs/test-yargs/gulpfile.js
[11:34:21] Starting 'test'...
{ _: [ 'test' ],
  name: 'oti',
  male: true,
  female: 'false',
  'rain bringer': true,
  note: 'oti is not real name.',
  '$0': '/Users/tkg/.nodebrew/current/bin/gulp' }
[11:34:21] Finished 'conslog' after 1.83 ms</pre>
</div>

<hr>

<a href="http://dskd.jp/archives/69.html">back to post</a>