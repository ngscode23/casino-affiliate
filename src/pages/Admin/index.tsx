import { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Section from "@/components/common/section";
import Skeleton from "@/components/common/skeleton";
import { RequireAuth } from "./requireAuth";

const Login = lazy(() => import("./login"));
const OffersList = lazy(() => import("./offers/List"));
const OffersEdit = lazy(() => import("./offers/Edit"));



export default function AdminApp() {
  return (
    <Suspense fallback={<div className="p-6"><Skeleton className="h-6 w-40" /></div>}>
      <Routes>
        <Route path="login" element={<Login />} />

        <Route
          path="offers"
          element={
            <RequireAuth>
              <OffersList />
            </RequireAuth>
          }
        />
        <Route
          path="offers/new"
          element={
            <RequireAuth>
              <OffersEdit />
            </RequireAuth>
          }
        />
        <Route
          path="offers/:slug"
          element={
            <RequireAuth>
              <OffersEdit />
            </RequireAuth>
          }
        />

        <Route
          index
          element={
            <Section className="p-6 space-y-3">
              <h1 className="text-2xl font-bold">Admin</h1>
              <div className="space-x-3">
                <Link className="underline" to="offers">Offers</Link>
                <Link className="underline" to="login">Login</Link>
              </div>
            </Section>
          }
        />

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Suspense>
  );
}
