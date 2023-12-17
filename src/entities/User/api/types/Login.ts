import { RefreshResponse } from "./Refresh"

export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = RefreshResponse
//400