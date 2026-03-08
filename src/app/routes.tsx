import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { AuthCallback } from "./pages/AuthCallback";
import { LandingPage } from "./pages/W-01-Landing-Page";
import { SplashScreen } from "./pages/onboarding/S-01-Splash";
import { DemoSwipeScreen } from "./pages/onboarding/S-01b-DemoSwipe";
import { FamilySetupScreen } from "./pages/onboarding/S-02-FamilySetup";
import { HealthSetupScreen } from "./pages/onboarding/S-03-HealthSetup";
import { PreferencesScreen } from "./pages/onboarding/S-04-Preferences";
import { CommitmentScreen } from "./pages/onboarding/S-04b-Commitment";
import { HomeScreen } from "./pages/app/Home";
import { SummaryScreen } from "./pages/app/Summary";
import { RecipeScreen } from "./pages/app/Recipe";
import { CookingScreen } from "./pages/app/Cooking";
import { CompleteScreen } from "./pages/app/Complete";
import { HistoryScreen } from "./pages/app/History";
import { SettingsScreen } from "./pages/app/Settings";
import { PaywallScreen } from "./pages/app/Paywall";
import { PurchaseSuccessScreen } from "./pages/app/PurchaseSuccess";
import { FamilySettingsScreen } from "./pages/family/FamilySettings";
import { KitchenBudgetScreen } from "./pages/family/KitchenBudget";
import { MealScheduleScreen } from "./pages/meals/MealSchedule";
import { MealStructureScreen } from "./pages/meals/MealStructure";
import { NutritionBlogPage } from "./pages/NutritionBlog";
import { ArticleDetailPage } from "./pages/ArticleDetail";
import { WeeklyReportScreen } from "./pages/app/WeeklyReport";
import { MonthlyReportScreen } from "./pages/app/MonthlyReport";
import { FamilyJournalScreen } from "./pages/app/FamilyJournal";
import { NotFound } from "./pages/app/NotFound";
import { EditProfileScreen } from "./pages/app/EditProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: LandingPage },
      { path: "auth/callback", Component: AuthCallback },
      { path: "onboarding", Component: SplashScreen },
      { path: "onboarding/demo", Component: DemoSwipeScreen },
      { path: "onboarding/family", Component: FamilySetupScreen },
      { path: "onboarding/health", Component: HealthSetupScreen },
      { path: "onboarding/preferences", Component: PreferencesScreen },
      { path: "onboarding/commitment", Component: CommitmentScreen },
      { path: "app/home", Component: HomeScreen },
      { path: "app/summary", Component: SummaryScreen },
      { path: "app/recipe", Component: RecipeScreen },
      { path: "app/cooking", Component: CookingScreen },
      { path: "app/complete", Component: CompleteScreen },
      { path: "app/history", Component: HistoryScreen },
      { path: "app/settings", Component: SettingsScreen },
      { path: "app/paywall", Component: PaywallScreen },
      { path: "app/purchase-success", Component: PurchaseSuccessScreen },
      { path: "settings/family", Component: FamilySettingsScreen },
      { path: "settings/kitchen", Component: KitchenBudgetScreen },
      { path: "settings/schedule", Component: MealScheduleScreen },
      { path: "settings/structure", Component: MealStructureScreen },
      { path: "dinh-duong", Component: NutritionBlogPage },
      { path: "dinh-duong/:slug", Component: ArticleDetailPage },
      { path: "app/weekly-report", Component: WeeklyReportScreen },
      { path: "app/monthly-report", Component: MonthlyReportScreen },
      { path: "app/family-journal", Component: FamilyJournalScreen },
      { path: "app/settings/profile", Component: EditProfileScreen },
      { path: "*", Component: NotFound },
    ],
  },
]);