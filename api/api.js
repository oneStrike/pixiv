import request from './request'

export const pixiv = (data)=>request('',data)
/*
* illust	作品详情
* member	用户详情
* member_illust	用户作品
* favorite	用户收藏
* following	用户关注
* follower	用户粉丝
* rank	排行榜
* search	搜索
* tags	热门标签
* related	相关作品
* ugoira_metadata	获取ugoira信息
* */