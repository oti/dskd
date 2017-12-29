# dskd development manual

## starting

Start serve `dev/v6/`, watch `index.pug` and `style.sass`.

```
npm i
cd dev/v6/
npm run dev
```

Access `localhost:8888/`.

## ending

python does not stop(`[ctrl] + C`) the process using the `&`.

You must find `SimpleHTTPServer` proccess and kill that PID.

```
ps
```

Example output:

```
PID   TTY        TIME CMD
88801 ttys001    0:00.20 /Applications/iTerm.app/Contents/MacOS/iT
88803 ttys001    0:00.26 -zsh
89189 ttys001    0:00.15 python -m SimpleHTTPServer 8888
```

So,

```
kill -TERM 89189
```

done.
