import { HomePage } from "@/pages/HomePage/HomePage";
import { ItemPage } from "@/pages/ItemPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { Route, Routes } from "react-router-dom";

export enum PageRoutes{
  Home = '',
  Login = '/login',
  Items = '/items',
  User = '/user'
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={PageRoutes.Home} element={<HomePage />}/>
      <Route path={PageRoutes.Items} element={<ItemPage />}/>
      <Route path={PageRoutes.User} element={<ProfilePage />}/>
    </Routes>
  )
};