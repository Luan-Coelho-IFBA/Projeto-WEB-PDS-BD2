import { Route, Routes } from "react-router";
import { ManageCategoryPage } from "../../pages/admin/ManageCategoryPage";
import { ManageWritersPage } from "../../pages/admin/ManageWritersPage";
import { NotFoundPage } from "../../pages/NotFoundPage";

export function AdminRouter() {
    return (
        <Routes>
            <Route path="categories" element={<ManageCategoryPage />} />
            <Route path="writers" element={<ManageWritersPage />} />
            <Route path="/*" element={<NotFoundPage />} />
        </Routes>
    );
}
