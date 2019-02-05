export interface Post {
  id: string
  title: string
  content: string
  imgPath: string
  creator:  { _id: string; userName: string }
  createdAt?: Date
}
