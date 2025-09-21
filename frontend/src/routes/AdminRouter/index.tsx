import { Route, Routes } from "react-router";
import { ManageCategoryPage } from "../../pages/admin/ManageCategoryPage";

export function AdminRouter() {
    return (
        <Routes>
            <Route path="categories" element={<ManageCategoryPage />} />
            <Route path="writers" />
        </Routes>
    );
}
