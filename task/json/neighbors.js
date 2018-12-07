// 記事ごとに前後の記事情報をもったjsonを作る
const neighbors = (archives) => {
  const json = {neighbors: {}}

  archives.forEach((post, i) => {
    const old_set = {}
    const new_set = {}

    // olderがあれば作る
    if(archives[i+1]) {
      old_set.page_id    = archives[i+1].page_id
      old_set.page_title = archives[i+1].page_title
    }

    // newerがあれば作る
    if(archives[i-1]) {
      new_set.page_id    = archives[i-1].page_id,
      new_set.page_title = archives[i-1].page_title
    }

    // postごとに持つ
    json.neighbors[post.page_id] = {
      older: old_set,
      newer: new_set
    }
  })

  return json
}

module.exports = neighbors
