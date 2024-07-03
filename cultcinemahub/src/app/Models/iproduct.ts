export interface iProduct {
  id:number
  category:string
  price:number
  name:string
  brand:string
  productImg:string
  description:string
  available:boolean
  quantity?:number
  isInWishlist?:boolean
  isInCart?:boolean
}
