export interface Post {
  id: string
  _id?:string
  content: string
  imgPath: string
  creator:  { _id: string; userName: string }
  createdAt?: Date
}
