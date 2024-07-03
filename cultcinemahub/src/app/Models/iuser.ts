export interface iUser {
  id: number
  firstName: string
  lastName: string
  email: string
  password: string
  address:Address
  cart: number[]
  wishlist: number[]
  admin: boolean
}

export interface Address {
  street: string
  zip: string
  city: string
  country: string
}
