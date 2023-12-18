
export const baseLocation = document.getElementById('userLocation')!.getAttribute('value')!

export enum Locations{
  login = 'login',
  refresh = 'refresh',
  me = 'me',
  subscribe = 'subscribe',
  register = 'register',
  unsubscribe = 'unsubscribe'
}
