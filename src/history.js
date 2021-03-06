import R from 'ramda'

let dict = ['medium.com', 'quora.com', 'nytimes.com', 'cnn.com', 'newsweek.com', 
    'blog', 'topic', 'story', 'article']

//////////////Impure functions/////////////////

const includeUrl = (item = '') => {
    dict.push(item)
}

const removeUrl = (item = '') => {
    const index = dict.indexOf(item)
    if (index != -1) {
        dict.splice(index, 1)
    }
}

const getBaseUrl = () => {
    const splitUrl = window.location.href.split('/')
    const baseUrl = splitUrl[2]
    //common for sites to use 'blog' as subdomain, so we include it
    if (splitUrl[3] === 'blog') {
        return baseUrl + '/' + splitUrl[3]
    }
    return baseUrl
}

const addCurrentPageToDict = () => {
    dict.push(getBaseUrl())
}

const getTodaysDate = () => {
    const date = new Date()
    date.setHours(0,0,0,0)
    return date.getTime()
}

const searchChromeHistory = () => {
    return new Promise((resolve, reject) => {
        chrome.history.search({
            'text': '', //empty string returns all,
            'startTime': getTodaysDate(),
            'maxResults': 1000000
        }, historyItems => {
            const list = createList(historyItems)
            resolve(list)
        })
    })
}

//////////////(Mostly) pure functions////////////////

const strBuilder = (a = '', b = '') => {
    return a + '|' + b
}

const listFormatter = (a, b) => {
  return a + '\n' + b
}

const createRegexFromDict = (source = []) => {
    return new RegExp(R.reduce(strBuilder, '', source).slice(1))
}

const isMatch = item => {
    return R.test(createRegexFromDict(dict), item.url)
}

const getMatchedItems = R.filter(isMatch)

const getTitle = R.prop('title')

const getTitlesFromHistory = R.compose(
    R.uniq,
    R.map(getTitle)
)

const createList = R.compose(
    getTitlesFromHistory,
    getMatchedItems
)

const limiter = item => {
    //if get multiple url's like url/page-1, url/page-2 need to limit
}

export {
    listFormatter,
    searchChromeHistory  
}
