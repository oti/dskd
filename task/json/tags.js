const fs = require('fs')

// タグごとのjsonを作る
const tags = (posts) => {
  const tags_post_map = []
  const tags_post_list = {}
  const json = {tags: {}}

  // タグとpage_idの対応オブジェクトを抽出
  // tags_post_map = [{'CSS': '1'}, {'CSS': '12'}, {'note': '7'},...]
  // tags_post_list = {'CSS': [], 'note': [],...}
  for(let key of Object.keys(posts)) {
    posts[key].page_tag.forEach(tag_name => {
      tags_post_map.push({[tag_name]: posts[key].page_id})
      // あとで使うので空の配列をキーごとに持たせる
      tags_post_list[tag_name] = []
    })
  }

  // タグごとに該当するpage_idを配列に入れる
  // tags_post_map = [{'CSS': '1'}, {'CSS': '12'}, {'note': '7'},...]
  // tags_post_list = {'CSS': ['1', '12'], note: ['7'],...}
  tags_post_map.forEach(set => {
    const tag_name = Object.keys(set)[0]
    tags_post_list[tag_name].push(set[tag_name])
  })

  // タグ別に記事が配列になったjsonを作る
  for(let key of Object.keys(tags_post_list)) {
    let dripped = tags_post_list[key].map(id => {
      // posts.jsonからpage_idを添え字にして記事の情報を取り出す
      return {
        page_id: posts[id].page_id,
        page_datetime: posts[id].page_datetime,
        page_title: posts[id].page_title,
        page_description: posts[id].page_description,
        page_tag: posts[id].page_tag
      }
    })

    // 日付で降順ソート
    dripped.sort((a, b) => {
      const date_a = Number(a.page_datetime.replace(/[-T:]/g, ''))
      const date_b = Number(b.page_datetime.replace(/[-T:]/g, ''))
      if (date_a > date_b) return -1
      if (date_a < date_b) return 1
      return 0
    })

    // 対応するタグネームに入れる
    // json = {'tags': {'CSS': [{post}, {post}...], 'note': [{post}, {post}...]}}
    json.tags[key] = dripped

    // tags_nameごとにmdファイルをwriteFile
    const yaml_block = `---\nlayout: ./src/html/index.pug\npage_type: 'tag'\npage_title: '${key}'\npage_cover: ''\n---`
    const safe_tag_name = key.toLowerCase().replace(/[ .-]/g, '_')
    fs.writeFileSync('./src/md/archives/'+safe_tag_name+'.md', yaml_block)
  }

  return json
}

module.exports = tags
