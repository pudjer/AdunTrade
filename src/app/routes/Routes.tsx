import { ItemPage } from "@/pages/ItemPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { Route, Routes } from "react-router-dom";

export enum PageRoutes{
  Items = '/items',
  User = '/user'
}

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path={PageRoutes.Items} element={<ItemPage />}/>
      <Route path={PageRoutes.User} element={<ProfilePage />}/>
    </Routes>
  )
};