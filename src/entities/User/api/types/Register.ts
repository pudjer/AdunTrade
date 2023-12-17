export type RegisterRequest = {
  username: string
  password: string
}

export type RegisterResponse = {
  id: string
  username: string
  token: string
}