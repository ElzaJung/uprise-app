import { createBrowserRouter, Outlet } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import LandAnalyzerPage from './components/land-analyzer/LandAnalyzerPage';

// Layouts
import PublicLayout from './components/PublicLayout';
import SidebarLayout from './components/ui/sidebar-layout';

// Pages
import LandingPage from './components/LandingPage';
import AuthGate from './components/AuthGate';
import RedirectToLandAnalyzer from './components/RedirectToLandAnalyzer';
import AnalysisQueue from './components/AnalysisQueue';
import ListingDraft from './components/ListingDraft';
import EditListing from './components/EditListing';
import CreateListing from './components/CreateListing';
import PublishListing from './components/PublishListing';
import PublicListing from './components/PublicListing';
import BrowseListings from './components/BrowseListings';
import AboutPage from './components/AboutPage';
import SupportPage from './components/SupportPage';
import ContactPage from './components/ContactPage';
import ParcelMap from './components/ParcelMap';
import ParcelAnalysis from './components/ParcelAnalysis';
import SettingsPage from './components/SettingsPage';
import SavedParcels from './components/SavedParcels';
import SavedAnalyses from './components/SavedAnalyses';
import RequestsInbox from './components/RequestsInbox';
import ProtectedRoute from './components/ProtectedRoute';
import TestListingsAPI from './components/TestListingsAPI';
// import AddTestListings from './components/AddTestListings'; // Disabled until backend is available

const Root = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <LandingPage /> },
          { path: "about", element: <AboutPage /> },
          { path: "support", element: <SupportPage /> },
          { path: "contact", element: <ContactPage /> },
          { path: "browse", element: <BrowseListings /> },
          { path: "listing/:listingId", element: <PublicListing /> },
          { path: "land_analyzer", element: <LandAnalyzerPage /> },
          { path: "dashboard", element: <LandAnalyzerPage /> },
          { path: "test/listings-api", element: <TestListingsAPI /> },
          // { path: "test/add-listings", element: <AddTestListings /> }, // Disabled until backend is available
          {
            element: (
              <ProtectedRoute>
                <SidebarLayout />
              </ProtectedRoute>
            ),
            children: [
              { path: "parcels", element: <ParcelMap /> },
              { path: "parcel/:parcelId", element: <ParcelAnalysis /> },
              { path: "analysis", element: <AnalysisQueue /> },
              { path: "analysis-queue", element: <AnalysisQueue /> },
              { path: "saved-analyses", element: <SavedAnalyses /> },
              { path: "listing/create", element: <CreateListing /> },
              { path: "listing/publish/:listingId", element: <PublishListing /> },
              { path: "listing/draft/:parcelId", element: <ListingDraft /> },
              { path: "listing/edit/:listingId", element: <EditListing /> },
              { path: "saved", element: <SavedParcels /> },
              { path: "requests", element: <RequestsInbox /> },
              { path: "settings", element: <SettingsPage /> },
            ],
          },
        ],
      },
      {
        path: "auth",
        element: <AuthGate />,
      },
      {
        path: "role-select",
        element: <RedirectToLandAnalyzer />,
      },
      {
        path: "dashboard/owner",
        element: <RedirectToLandAnalyzer />,
      },
      {
        path: "dashboard/searcher",
        element: <RedirectToLandAnalyzer />,
      },
      {
        path: "dashboard/admin",
        element: <RedirectToLandAnalyzer />,
      },
      {
        path: "onboarding/owner",
        element: <RedirectToLandAnalyzer />,
      },
      {
        path: "onboarding/searcher",
        element: <RedirectToLandAnalyzer />,
      },
    ],
  },
]);